<?php
declare(strict_types=1);

function load_ask_config(): array
{
    static $config = null;
    if ($config !== null) {
        return $config;
    }

    $base = __DIR__;
    $local = $base . '/config.local.php';
    $example = $base . '/config.example.php';

    if (is_file($local)) {
        $config = require $local;
    } elseif (is_file($example)) {
        $config = require $example;
    } else {
        $config = [];
    }

    if (!is_array($config)) {
        $config = [];
    }

    return $config;
}

function ask_config(string $key, mixed $default = null): mixed
{
    $config = load_ask_config();
    return $config[$key] ?? $default;
}

function apply_cors(): void
{
    $allowed = ask_config('allowed_origins', []);
    if (!is_array($allowed)) {
        $allowed = [];
    }

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if ($origin !== '' && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

function respond_json(int $status, array $payload): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json_body(): array
{
    $raw = file_get_contents('php://input');
    $body = json_decode($raw !== false ? $raw : '', true);
    return is_array($body) ? $body : [];
}

function curl_json_request(
    string $method,
    string $url,
    ?array $payload,
    array $headers,
    int $timeout = 60,
): array {
    if (!function_exists('curl_init')) {
        return ['ok' => false, 'status' => 503, 'error' => 'PHP curl extension is required'];
    }

    $ch = curl_init();
    if ($ch === false) {
        return ['ok' => false, 'status' => 502, 'error' => 'Could not start HTTP client'];
    }

    $httpHeaders = $headers;
    $opts = [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_HTTPHEADER => $httpHeaders,
    ];

    if ($method === 'POST') {
        $opts[CURLOPT_POST] = true;
        if ($payload !== null) {
            $encoded = json_encode($payload);
            if ($encoded === false) {
                curl_close($ch);
                return ['ok' => false, 'status' => 400, 'error' => 'Could not encode JSON body'];
            }
            $opts[CURLOPT_POSTFIELDS] = $encoded;
            $httpHeaders[] = 'Content-Type: application/json';
            $opts[CURLOPT_HTTPHEADER] = $httpHeaders;
        }
    } else {
        $opts[CURLOPT_HTTPGET] = true;
    }

    curl_setopt_array($ch, $opts);
    $response = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false) {
        return ['ok' => false, 'status' => 502, 'error' => $curlError !== '' ? $curlError : 'Upstream request failed'];
    }

    $decoded = json_decode($response, true);
    if ($status >= 400) {
        $message = upstream_error_message(is_array($decoded) ? $decoded : null, trim($response));
        return ['ok' => false, 'status' => $status, 'error' => $message];
    }

    return ['ok' => true, 'status' => $status, 'data' => $decoded];
}

function upstream_error_message(?array $decoded, string $rawResponse): string
{
    if ($decoded !== null) {
        if (isset($decoded['error'])) {
            $err = $decoded['error'];
            if (is_string($err) && $err !== '') {
                return $err;
            }
            if (is_array($err)) {
                if (isset($err['message']) && is_string($err['message']) && $err['message'] !== '') {
                    return $err['message'];
                }
            }
        }
        if (isset($decoded['message']) && is_string($decoded['message']) && $decoded['message'] !== '') {
            return $decoded['message'];
        }
    }

    if ($rawResponse !== '') {
        return $rawResponse;
    }

    return 'Upstream error';
}

function supabase_service_headers(): array
{
    $key = trim((string) ask_config('supabase_service_role_key', ''));
    return [
        'apikey: ' . $key,
        'Authorization: Bearer ' . $key,
        'Content-Type: application/json',
    ];
}

function supabase_rpc(string $name, array $body): array
{
    $base = rtrim((string) ask_config('supabase_url', ''), '/');
    if ($base === '') {
        return ['ok' => false, 'status' => 503, 'error' => 'Supabase URL not configured'];
    }

    return curl_json_request(
        'POST',
        $base . '/rest/v1/rpc/' . rawurlencode($name),
        $body,
        supabase_service_headers(),
        30,
    );
}

function supabase_upsert_rate_limit(string $bucketKey, string $windowStart, int $count): array
{
    $base = rtrim((string) ask_config('supabase_url', ''), '/');
    if ($base === '') {
        return ['ok' => false, 'status' => 503, 'error' => 'Supabase URL not configured'];
    }

    return curl_json_request(
        'POST',
        $base . '/rest/v1/portfolio_ask_rate_limits?on_conflict=bucket_key',
        [
            'bucket_key' => $bucketKey,
            'window_start' => $windowStart,
            'request_count' => $count,
        ],
        array_merge(supabase_service_headers(), ['Prefer: resolution=merge-duplicates']),
        30,
    );
}

function supabase_get_rate_limit(string $bucketKey): array
{
    $base = rtrim((string) ask_config('supabase_url', ''), '/');
    if ($base === '') {
        return ['ok' => false, 'status' => 503, 'error' => 'Supabase URL not configured'];
    }

    $url = $base . '/rest/v1/portfolio_ask_rate_limits?bucket_key=eq.'
        . rawurlencode($bucketKey) . '&select=window_start,request_count&limit=1';

    return curl_json_request('GET', $url, null, supabase_service_headers(), 30);
}

function ollama_cloud_chat(
    string $model,
    array $messages,
    ?string $format = 'json',
    float $temperature = 0.0,
): array {
    $apiKey = trim((string) ask_config('ollama_api_key', ''));
    if ($apiKey === '') {
        return ['ok' => false, 'status' => 503, 'error' => 'OLLAMA_API_KEY not configured on server'];
    }

    $payload = [
        'model' => $model,
        'messages' => $messages,
        'stream' => false,
        'options' => ['temperature' => $temperature],
    ];
    if ($format !== null && $format !== '') {
        $payload['format'] = $format;
    }

    $result = curl_json_request(
        'POST',
        'https://ollama.com/api/chat',
        $payload,
        [
            'Authorization: Bearer ' . $apiKey,
            'Accept: application/json',
            'Content-Type: application/json',
        ],
        90,
    );

    if (!$result['ok']) {
        return $result;
    }

    $data = $result['data'];
    $content = '';
    if (is_array($data) && isset($data['message']) && is_array($data['message'])) {
        $content = (string) ($data['message']['content'] ?? '');
    }

    if ($content === '') {
        return ['ok' => false, 'status' => 502, 'error' => 'Empty response from Ollama Cloud'];
    }

    return ['ok' => true, 'content' => $content];
}

/**
 * Fetches all models visible to your API key (paginated ListModels).
 *
 * @return array{ok: true, models: list<array<string, mixed>>}|array{ok: false, status: int, error: string}
 */
function gemini_list_all_models(?string $apiKey = null): array
{
    $apiKey = $apiKey ?? trim((string) ask_config('gemini_api_key', ''));
    if ($apiKey === '') {
        return ['ok' => false, 'status' => 503, 'error' => 'GEMINI_API_KEY not configured'];
    }

    $all = [];
    $pageToken = null;

    do {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models?key='
            . rawurlencode($apiKey) . '&pageSize=100';
        if ($pageToken !== null) {
            $url .= '&pageToken=' . rawurlencode($pageToken);
        }

        $result = curl_json_request('GET', $url, null, [], 60);
        if (!$result['ok']) {
            return $result;
        }

        $models = $result['data']['models'] ?? null;
        if (is_array($models)) {
            foreach ($models as $model) {
                if (is_array($model)) {
                    $all[] = $model;
                }
            }
        }

        $next = $result['data']['nextPageToken'] ?? null;
        $pageToken = is_string($next) && $next !== '' ? $next : null;
    } while ($pageToken !== null);

    return ['ok' => true, 'models' => $all];
}

function gemini_model_record_id(array $model): string
{
    $name = (string) ($model['name'] ?? '');

    return normalize_gemini_model_id($name);
}

function gemini_model_supports_method(array $model, string $method): bool
{
    $methods = $model['supportedGenerationMethods'] ?? null;
    if (!is_array($methods)) {
        return false;
    }

    return in_array($method, $methods, true);
}

function normalize_gemini_model_id(string $model): string
{
    $model = trim($model);
    if (str_starts_with($model, 'models/')) {
        $model = substr($model, strlen('models/'));
    }

    return trim($model);
}

/** Live / streaming models do not support REST generateContent. */
function gemini_model_is_live_only(string $model): bool
{
    $m = mb_strtolower(normalize_gemini_model_id($model));

    // flash-lite is fine; flash-live and *-live-preview are not.
    return str_starts_with($m, 'gemini-live-') || str_contains($m, 'flash-live');
}

/**
 * @return list<string>
 */
function gemini_model_chain(string $listKey, string $singleKey, string $default, bool $forGenerateContent = false): array
{
    $models = ask_config($listKey, null);
    if (is_array($models)) {
        $out = [];
        foreach ($models as $model) {
            $model = normalize_gemini_model_id((string) $model);
            if ($model === '') {
                continue;
            }
            if ($forGenerateContent && gemini_model_is_live_only($model)) {
                continue;
            }
            $out[] = $model;
        }
        if ($out !== []) {
            return array_values(array_unique($out));
        }
    }

    $single = normalize_gemini_model_id((string) ask_config($singleKey, $default));
    if ($single === '') {
        $single = $default;
    }
    if ($forGenerateContent && gemini_model_is_live_only($single)) {
        return [$default];
    }

    return [$single];
}

function gemini_is_retryable_failure(array $result): bool
{
    if (($result['ok'] ?? false) === true) {
        return false;
    }

    $status = (int) ($result['status'] ?? 0);
    if (in_array($status, [429, 500, 502, 503, 504], true)) {
        return true;
    }

    $err = mb_strtolower((string) ($result['error'] ?? ''));
    $needles = [
        'quota',
        'rate limit',
        'rate_limit',
        'resource exhausted',
        'resource_exhausted',
        'too many requests',
        'overloaded',
        'unavailable',
        'high demand',
        'not found',
        'not supported',
        'does not exist',
        'model is not',
        'limit exceeded',
    ];

    foreach ($needles as $needle) {
        if (str_contains($err, $needle)) {
            return true;
        }
    }

    return false;
}

function gemini_embed_with_model(string $model, string $text, string $apiKey): array
{
    return curl_json_request(
        'POST',
        'https://generativelanguage.googleapis.com/v1beta/models/'
            . rawurlencode($model) . ':embedContent?key=' . rawurlencode($apiKey),
        [
            'model' => 'models/' . $model,
            'content' => ['parts' => [['text' => mb_substr($text, 0, 2000)]]],
            'taskType' => 'RETRIEVAL_QUERY',
            'outputDimensionality' => 768,
        ],
        ['Content-Type: application/json'],
        60,
    );
}

function gemini_embed(string $text): array
{
    $apiKey = trim((string) ask_config('gemini_api_key', ''));
    if ($apiKey === '') {
        return ['ok' => false, 'status' => 503, 'error' => 'GEMINI_API_KEY not configured on server'];
    }

    $models = gemini_model_chain('gemini_embed_models', 'gemini_embed_model', 'gemini-embedding-001');
    $last = ['ok' => false, 'status' => 502, 'error' => 'No embedding returned from Gemini'];

    foreach ($models as $model) {
        $result = gemini_embed_with_model($model, $text, $apiKey);
        if (!$result['ok']) {
            $last = $result;
            if (gemini_is_retryable_failure($result)) {
                continue;
            }
            return $last;
        }

        $values = $result['data']['embedding']['values'] ?? null;
        if (!is_array($values) || count($values) === 0) {
            $last = ['ok' => false, 'status' => 502, 'error' => 'No embedding returned from Gemini'];
            continue;
        }

        return ['ok' => true, 'values' => $values];
    }

    return $last;
}

function gemini_generate(string $prompt): array
{
    return gemini_chat(
        [['role' => 'user', 'parts' => [['text' => $prompt]]]],
        null,
        0.35,
    );
}

function gemini_chat_with_model(
    string $model,
    array $contents,
    ?string $systemInstruction,
    float $temperature,
    string $apiKey,
): array {
    $body = [
        'contents' => $contents,
        'generationConfig' => ['temperature' => $temperature, 'maxOutputTokens' => 1024],
    ];
    if ($systemInstruction !== null && $systemInstruction !== '') {
        $body['systemInstruction'] = ['parts' => [['text' => $systemInstruction]]];
    }

    return curl_json_request(
        'POST',
        'https://generativelanguage.googleapis.com/v1beta/models/'
            . rawurlencode($model) . ':generateContent?key=' . rawurlencode($apiKey),
        $body,
        ['Content-Type: application/json'],
        120,
    );
}

/**
 * Multi-turn Gemini chat. $contents items: role "user" | "model", parts: [['text' => ...]].
 * Tries gemini_answer_models in order when quota/limit/model errors occur.
 */
function gemini_chat(array $contents, ?string $systemInstruction = null, float $temperature = 0.45): array
{
    $apiKey = trim((string) ask_config('gemini_api_key', ''));
    if ($apiKey === '') {
        return ['ok' => false, 'status' => 503, 'error' => 'GEMINI_API_KEY not configured on server'];
    }

    if (count($contents) === 0) {
        return ['ok' => false, 'status' => 400, 'error' => 'No messages'];
    }

    $models = gemini_model_chain('gemini_answer_models', 'gemini_answer_model', 'gemini-2.5-flash-lite', true);
    if ($models === []) {
        $models = ['gemini-2.5-flash-lite'];
    }

    $last = ['ok' => false, 'status' => 502, 'error' => 'All configured Gemini answer models failed'];
    $tried = [];

    foreach ($models as $model) {
        $tried[] = $model;
        $result = gemini_chat_with_model($model, $contents, $systemInstruction, $temperature, $apiKey);
        if (!$result['ok']) {
            $last = $result;
            if (gemini_is_retryable_failure($result)) {
                continue;
            }
            $last['triedModels'] = $tried;
            return $last;
        }

        $text = $result['data']['candidates'][0]['content']['parts'][0]['text'] ?? '';
        $text = is_string($text) ? trim($text) : '';
        if ($text === '') {
            $last = ['ok' => false, 'status' => 502, 'error' => 'Empty answer from Gemini'];
            continue;
        }

        return ['ok' => true, 'text' => $text];
    }

    $lastError = (string) ($last['error'] ?? 'unknown');
    $last['triedModels'] = $tried;
    $last['error'] = 'All configured Gemini answer models failed (tried: '
        . implode(', ', $tried) . '). Last error: ' . $lastError;

    return $last;
}

function parse_json_from_text(string $text): array
{
    $cleaned = trim($text);
    if (preg_match('/```(?:json)?\s*([\s\S]*?)\s*```/i', $cleaned, $m)) {
        $cleaned = trim($m[1]);
    }
    $decoded = json_decode($cleaned, true);
    if (is_array($decoded)) {
        return $decoded;
    }
    $start = strpos($cleaned, '{');
    $end = strrpos($cleaned, '}');
    if ($start !== false && $end !== false && $end > $start) {
        $decoded = json_decode(substr($cleaned, $start, $end - $start + 1), true);
        if (is_array($decoded)) {
            return $decoded;
        }
    }
    return [];
}
