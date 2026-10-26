<?php
declare(strict_types=1);

/**
 * CLI: list Gemini models your API key can use (from Google ListModels).
 *
 *   php api/list-gemini-models.php
 *   php api/list-gemini-models.php --json
 *
 * Reads gemini_api_key from api/config.local.php, or inline:
 *   GEMINI_API_KEY='your-key' php api/list-gemini-models.php
 */
if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "Run from terminal: php api/list-gemini-models.php\n");
    exit(1);
}

require __DIR__ . '/bootstrap.php';

$asJson = in_array('--json', $argv ?? [], true);

$envKey = trim((string) (getenv('GEMINI_API_KEY') ?: ''));
$result = gemini_list_all_models($envKey !== '' ? $envKey : null);
if (!$result['ok']) {
    fwrite(STDERR, $result['error'] . "\n");
    fwrite(STDERR, "Set gemini_api_key in api/config.local.php or:\n");
    fwrite(STDERR, "  GEMINI_API_KEY='your-key' php api/list-gemini-models.php\n");
    exit(1);
}

/** @var list<array<string, mixed>> $models */
$models = $result['models'];

$forChat = [];
$forEmbed = [];
$liveOnly = [];

foreach ($models as $model) {
    $id = gemini_model_record_id($model);
    if ($id === '') {
        continue;
    }

    $supportsGenerate = gemini_model_supports_method($model, 'generateContent');
    $supportsEmbed = gemini_model_supports_method($model, 'embedContent');

    $row = [
        'id' => $id,
        'displayName' => (string) ($model['displayName'] ?? ''),
        'inputTokenLimit' => (int) ($model['inputTokenLimit'] ?? 0),
        'outputTokenLimit' => (int) ($model['outputTokenLimit'] ?? 0),
    ];

    if ($supportsGenerate) {
        $forChat[] = $row;
    }
    if ($supportsEmbed) {
        $forEmbed[] = $row;
    }
    if (!$supportsGenerate && gemini_model_is_live_only($id)) {
        $liveOnly[] = $row;
    }
}

usort($forChat, static fn (array $a, array $b): int => strcmp($a['id'], $b['id']));
usort($forEmbed, static fn (array $a, array $b): int => strcmp($a['id'], $b['id']));

$suggestedChat = [];
foreach ($forChat as $row) {
    $id = $row['id'];
    if (!preg_match('/flash-lite/i', $id)) {
        continue;
    }
    if (preg_match('/preview|exp|image|tts|audio|live/i', $id)) {
        continue;
    }
    $suggestedChat[] = $id;
    if (count($suggestedChat) >= 4) {
        break;
    }
}

if ($asJson) {
    echo json_encode([
        'generateContent' => $forChat,
        'embedContent' => $forEmbed,
        'liveOnlySkippedForChat' => $liveOnly,
        'suggestedGeminiAnswerModels' => $suggestedChat,
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n";
    exit(0);
}

echo "Gemini models for this API key (" . count($models) . " total)\n";
echo str_repeat('=', 72) . "\n\n";

echo "Use for AI-dib chat (generateContent) — " . count($forChat) . " models:\n\n";
foreach ($forChat as $row) {
    $label = $row['displayName'] !== '' ? " — {$row['displayName']}" : '';
    echo "  {$row['id']}{$label}\n";
}

echo "\nUse for RAG embeddings (embedContent) — " . count($forEmbed) . " models:\n\n";
foreach ($forEmbed as $row) {
    $label = $row['displayName'] !== '' ? " — {$row['displayName']}" : '';
    echo "  {$row['id']}{$label}\n";
}

if ($liveOnly !== []) {
    echo "\nLive / streaming only (NOT for ask.php) — " . count($liveOnly) . " models:\n\n";
    foreach ($liveOnly as $row) {
        echo "  {$row['id']}\n";
    }
}

echo "\nSuggested gemini_answer_models (copy into config.local.php):\n\n";
echo "    'gemini_answer_models' => [\n";
foreach ($suggestedChat as $id) {
    echo "        '{$id}',\n";
}
if ($suggestedChat === []) {
    echo "        'gemini-2.5-flash-lite', // pick ids from the generateContent list above\n";
}
echo "    ],\n\n";

echo "Tip: npm run list:gemini-models  (uses .env GEMINI_API_KEY)\n";
