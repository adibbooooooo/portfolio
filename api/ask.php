<?php
declare(strict_types=1);

/**
 * Ask Adib — server-side orchestration (same-origin, keys in config.local.php).
 *
 * Ollama Cloud: relevance gate (moderator)
 * Gemini: embeddings + grounded answer
 * Supabase: rate limits + knowledge RAG
 */

require __DIR__ . '/bootstrap.php';
require __DIR__ . '/ask_helpers.php';

apply_cors();

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

const REFUSAL = "I can only answer questions about Adib's work, experience, skills, projects, and personality content on this site. For other topics, email work@adibomar.com or book a call at cal.com/adibomar/meeting.";

if ($method !== 'POST') {
    respond_json(405, ['error' => 'Method not allowed']);
}

$body = read_json_body();

if (!empty($body['website'])) {
    respond_json(200, ask_response_payload('', REFUSAL, false));
}

$question = trim((string) ($body['question'] ?? ''));
$sessionId = trim((string) ($body['sessionId'] ?? 'anon'));

if ($question === '' || mb_strlen($question) > 500) {
    respond_json(200, ask_response_payload($question, 'Hey! Ask me anything, even a quick "Hi" works.'));
}

$blocked = [
    'ignore previous',
    'ignore all',
    'system prompt',
    'repeat everything',
    'dump all',
    'jailbreak',
    'you are now',
    'act as',
];
$lower = mb_strtolower($question);
foreach ($blocked as $phrase) {
    if (str_contains($lower, $phrase)) {
        respond_json(200, ask_response_payload($question, REFUSAL, false));
    }
}

$geminiKey = trim((string) ask_config('gemini_api_key', ''));
$ollamaKey = trim((string) ask_config('ollama_api_key', ''));
$serviceKey = trim((string) ask_config('supabase_service_role_key', ''));

if ($geminiKey === '' || $ollamaKey === '' || $serviceKey === '') {
    respond_json(503, [
        'error' => 'Ask API is not configured. Copy api/config.example.php to api/config.local.php on the server.',
    ]);
}

$ip = trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? 'unknown')[0]);
$bucketKey = mb_substr($ip . ':' . ($sessionId !== '' ? $sessionId : 'anon'), 0, 120);
$rateLimit = (int) ask_config('rate_limit_per_hour', 24);
$windowMs = 60 * 60;

$rateRow = supabase_get_rate_limit($bucketKey);
$now = time();
$count = 0;
$windowStartIso = gmdate('c', $now);

if ($rateRow['ok'] && is_array($rateRow['data']) && isset($rateRow['data'][0])) {
    $row = $rateRow['data'][0];
    $windowStart = strtotime((string) ($row['window_start'] ?? ''));
    $count = (int) ($row['request_count'] ?? 0);
    if ($windowStart !== false && ($now - $windowStart) <= $windowMs) {
        $windowStartIso = gmdate('c', $windowStart);
    } else {
        $count = 0;
        $windowStartIso = gmdate('c', $now);
    }
}

if ($count >= $rateLimit) {
    respond_json(429, ['error' => 'Too many questions. Please try again in an hour.']);
}

$nextCount = $count + 1;
supabase_upsert_rate_limit($bucketKey, $windowStartIso, $nextCount);

$history = parse_client_history($body['history'] ?? null);

$hanisEaster = hanis_easter_egg_answer($question, $history);
if ($hanisEaster !== null) {
    respond_json(200, ask_response_payload($question, $hanisEaster));
}

if (is_clearly_off_topic($question)) {
    respond_json(200, ask_response_payload($question, REFUSAL, false));
}

if (!is_clearly_portfolio_question($question) && !ollama_gate_allows($question)) {
    respond_json(200, ask_response_payload($question, REFUSAL, false));
}

// Conversational path: greetings, thanks, small talk (no RAG required)
if (is_mostly_social($question)) {
    $contents = build_gemini_contents($history, $question);
    $chat = gemini_chat($contents, AI_DIB_PERSONA, 0.55);
    if (!$chat['ok']) {
        ask_respond_gemini_failure($chat);
    }
    respond_json(200, ask_response_payload($question, $chat['text']));
}

$chunks = [];

$search = supabase_rpc('search_portfolio_knowledge', [
    'search_query' => $question,
    'match_count' => 6,
]);
if ($search['ok'] && is_array($search['data'])) {
    $chunks = $search['data'];
}

if (fts_results_are_weak($chunks)) {
    $embed = gemini_embed($question);
    if ($embed['ok']) {
        $match = supabase_rpc('match_portfolio_knowledge', [
            'query_embedding' => $embed['values'],
            'match_count' => 6,
        ]);
        if ($match['ok'] && is_array($match['data']) && count($match['data']) > 0) {
            $chunks = $match['data'];
        }
    }
}

$contextParts = [];
$i = 1;
foreach ($chunks as $chunk) {
    if (!is_array($chunk)) {
        continue;
    }
    $topic = (string) ($chunk['topic'] ?? '');
    $content = (string) ($chunk['content'] ?? '');
    if ($content === '') {
        continue;
    }
    $contextParts[] = '[' . $i . '] (' . $topic . ') ' . $content;
    $i++;
}

if (is_contact_question($question)) {
    array_unshift($contextParts, '[0] ' . contact_knowledge_block());
    $contactOnly = [];
    $other = [];
    foreach ($contextParts as $part) {
        if (str_contains($part, '(contact)')) {
            $contactOnly[] = $part;
        } else {
            $other[] = $part;
        }
    }
    $contextParts = array_merge($contactOnly, array_slice($other, 0, 2));
}

$context = implode("\n\n", $contextParts);

if ($context === '') {
    $contents = build_gemini_contents($history, $question);
    $chat = gemini_chat($contents, AI_DIB_PERSONA, 0.5);
    if (!$chat['ok']) {
        ask_respond_gemini_failure($chat);
    }
    respond_json(200, ask_response_payload($question, $chat['text']));
}

$userTurn = build_rag_user_turn($context, $question);

$contents = build_gemini_contents($history, $userTurn);
$answer = gemini_chat($contents, AI_DIB_PERSONA, 0.58);
if (!$answer['ok']) {
    ask_respond_gemini_failure($answer);
}

respond_json(200, ask_response_payload($question, $answer['text']));
