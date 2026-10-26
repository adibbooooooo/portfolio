<?php
/**
 * Copy to config.local.php and fill in (never commit config.local.php).
 */
return [
    'gemini_api_key' => '',
    'ollama_api_key' => '', // https://ollama.com/settings/keys
    'ollama_gate_model' => 'gemma3:4b',
    /** Optional; defaults to ollama_gate_model. Used for Hanis easter-egg small talk. */
    'ollama_chat_model' => 'gemma3:4b',
    /**
     * Text chat uses generateContent — NOT Live API models.
     * Wrong: gemini-3-flash-live, gemini-2.0-flash-live-001 (streaming only).
     * Right: gemini-2.5-flash-lite, gemini-3.1-flash-lite, gemini-3.5-flash (check AI Studio → List models).
     */
    'gemini_answer_model' => 'gemini-2.5-flash-lite',
    'gemini_answer_models' => [
        'gemini-2.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-2.0-flash-lite',
        'gemini-2.0-flash-lite-001',
    ],
    'gemini_embed_model' => 'gemini-embedding-001',
    'gemini_embed_models' => [
        'gemini-embedding-001',
    ],
    'supabase_url' => 'https://pdgwvhsicrgvxuvpdedp.supabase.co',
    'supabase_service_role_key' => '',
    'rate_limit_per_hour' => 24,
    'allowed_origins' => [
        'https://adibomar.com',
        'https://www.adibomar.com',
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:8888',
        'http://127.0.0.1:8888',
    ],
];
