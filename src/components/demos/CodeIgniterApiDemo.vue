<template>
    <div class="p-4 md:p-6 text-white/90 space-y-5">
        <!-- Header -->
        <header class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
                <h2 class="text-xl font-bold text-white normal-font">
                    CodeIgniter <span class="text-[#a3a3a3]">REST API</span>
                </h2>
                <p class="text-sm text-white/60 pt-1">
                    Login to get a JWT, then hit endpoints and inspect JSON responses.
                </p>
            </div>

            <div class="flex gap-2">
                <button class="btn" @click="quickLogin">Quick Login</button>
                <button class="btn ghost" @click="clearLogs">Clear Log</button>
            </div>
        </header>

        <!-- Controls -->
        <div class="grid gap-3 md:grid-cols-[240px_210px_1fr]">
            <!-- Endpoint -->
            <div class="field">
                <label class="lbl">Endpoint</label>
                <select v-model="endpointKey" class="inp">
                    <option v-for="e in endpoints" :key="e.key" :value="e.key">
                        {{ e.method }} {{ e.path }}
                    </option>
                </select>
            </div>

            <!-- Mode -->
            <div class="field">
                <label class="lbl">Mode</label>
                <div class="seg">
                    <button class="seg-btn" :class="{ on: latency === 'fast' }" @click="latency = 'fast'">Fast</button>
                    <button class="seg-btn" :class="{ on: latency === 'slow' }" @click="latency = 'slow'">Slow</button>
                    <button class="seg-btn" :class="{ on: errorMode }" @click="errorMode = !errorMode">Error</button>
                </div>
            </div>

            <!-- JWT -->
            <div class="field">
                <label class="lbl">JWT Token</label>
                <input v-model="token" class="inp mono" placeholder="eyJhbGciOi..." />
            </div>
        </div>

        <!-- Body (shown for POST/PUT) -->
        <div v-if="showBody" class="field">
            <label class="lbl">Request Body (JSON)</label>
            <textarea v-model="bodyStr" class="inp min-h-[100px] mono" spellcheck="false" />
            <div class="flex gap-2 pt-2">
                <button class="btn" :disabled="!validJson" @click="send">Send</button>
                <button class="btn ghost" @click="useSampleBody">Use Sample</button>
                <span v-if="!validJson" class="text-[12px] text-rose-300/90 leading-7">Invalid JSON</span>
            </div>
        </div>

        <!-- Call button (for GET routes) -->
        <div v-else class="pt-1">
            <button class="btn" @click="send">Send</button>
        </div>

        <!-- Log -->
        <div class="log-area mt-3 no-scrollbar" v-if="logs.length">
            <div v-for="(entry, i) in logs" :key="i" class="log-line">
                <div class="log-row">
                    <span class="pill" :class="entry.ok ? 'ok' : 'bad'">
                        {{ entry.ok ? entry.ms + 'ms' : 'ERR' }}
                    </span>

                    <span class="mono shrink-0 method">{{ entry.method }}</span>
                    <span class="mono path">{{ entry.path }}</span>

                    <span class="status" :class="entry.ok ? 'ok' : 'bad'">
                        {{ entry.ok ? entry.status : entry.error }}
                    </span>
                </div>
                <pre class="json">{{ entry.payload }}</pre>
            </div>
        </div>

        <!-- Empty state -->
        <div v-else class="empty">
            <div class="empty-inner">
                <div class="emoji">🧪</div>
                <div class="title">No requests yet</div>
                <p class="hint">Click <span class="mono">Quick Login</span> then hit <span
                        class="mono">/api/posts</span> to see a JSON response here.</p>
                <div class="actions">
                    <button class="btn" @click="quickLogin">Quick Login</button>
                    <button class="btn ghost" @click="send">Try GET /api/posts</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type EndpointKey = 'login' | 'posts' | 'post_show' | 'post_create' | 'me'

const endpoints = [
    { key: 'login' as EndpointKey, method: 'POST', path: '/api/login', auth: false },
    { key: 'posts' as EndpointKey, method: 'GET', path: '/api/posts', auth: false },
    { key: 'post_show' as EndpointKey, method: 'GET', path: '/api/posts/1', auth: false },
    { key: 'post_create' as EndpointKey, method: 'POST', path: '/api/posts', auth: true },
    { key: 'me' as EndpointKey, method: 'GET', path: '/api/me', auth: true },
]

const endpointKey = ref<EndpointKey>('posts')
const token = ref('')
const latency = ref<'fast' | 'slow'>('fast')
const errorMode = ref(false)
const bodyStr = ref('{}')

const logs = ref<Array<{
    ok: boolean
    method: string
    path: string
    status?: number
    error?: string
    ms?: number
    payload: string
}>>([])

const current = computed(() => endpoints.find(e => e.key === endpointKey.value)!)
const showBody = computed(() => ['POST', 'PUT', 'PATCH'].includes(current.value.method))

const validJson = computed(() => {
    if (!showBody.value) return true
    try { JSON.parse(bodyStr.value || '{}'); return true } catch { return false }
})

function quickLogin() {
    token.value = 'eyMock.jwt.token.demo'
    addLog({
        ok: true, method: 'POST', path: '/api/login', status: 200, ms: 42,
        payload: JSON.stringify({ token: token.value, user: { id: 7, name: 'Demo User' } }, null, 2)
    })
}
function useSampleBody() {
    if (endpointKey.value === 'post_create') {
        bodyStr.value = JSON.stringify({ title: 'Hello CI', body: 'Created from the demo console.' }, null, 2)
    }
}
function addLog(e: any) { logs.value.unshift(e) }
function clearLogs() { logs.value = [] }
function parseBody() {
    if (!showBody.value) return undefined
    try { return JSON.parse(bodyStr.value || '{}') } catch { return {} }
}
function now() { return performance.now() }

async function send() {
    const e = current.value
    const started = now()
    const wait = latency.value === 'fast' ? 80 : 420
    await new Promise(r => setTimeout(r, wait))

    if (errorMode.value) {
        addLog({ ok: false, method: e.method, path: e.path, error: '500 Internal Server Error', payload: '—' })
        return
    }
    if (e.auth && !token.value) {
        addLog({ ok: false, method: e.method, path: e.path, error: '401 Unauthorized (missing token)', payload: '—' })
        return
    }

    let status = 200
    let payload: any = {}
    switch (e.key) {
        case 'login':
            payload = { token: 'eyMock.jwt.token.demo', user: { id: 7, name: 'Demo User' } }
            token.value = payload.token
            break
        case 'posts':
            payload = [
                { id: 1, title: 'Welcome to CI', body: 'Sample list item.' },
                { id: 2, title: 'REST in CI', body: 'Clean controllers, resources, filters.' }
            ]
            break
        case 'post_show':
            payload = { id: 1, title: 'Welcome to CI', body: 'Details of a single post.' }
            break
        case 'post_create':
            status = 201
            payload = { id: Math.floor(Math.random() * 900 + 100), ...parseBody() }
            break
        case 'me':
            payload = { id: 7, name: 'Demo User', roles: ['admin'], tokenPreview: token.value.slice(0, 12) + '...' }
            break
    }

    addLog({
        ok: true, method: e.method, path: e.path, status, ms: Math.round(now() - started),
        payload: JSON.stringify(payload, null, 2)
    })
}
</script>

<style scoped>
/* Inputs / labels */
.field {
    display: grid;
    gap: 6px;
}

.lbl {
    font-size: 12px;
    color: #a3a3a3;
}

.inp {
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .05);
    color: #e5e7eb;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 13px;
    outline: none;
}

.inp:focus {
    border-color: rgba(16, 185, 129, .5);
    box-shadow: 0 0 0 3px rgba(16, 185, 129, .15);
}

.mono {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

/* Segmented control */
.seg {
    display: inline-flex;
    gap: 6px;
}

.seg-btn {
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .05);
    color: #e5e7eb;
    font-size: 13px;
    border-radius: 8px;
    padding: 7px 12px;
    transition: .2s;
}

.seg-btn.on,
.seg-btn:hover {
    border-color: rgba(16, 185, 129, .5);
    background: rgba(16, 185, 129, .1);
    color: #a7f3d0;
}

/* Buttons */
.btn {
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .05);
    color: #e5e7eb;
    font-size: 13px;
    border-radius: 8px;
    padding: 7px 12px;
    cursor: pointer;
    transition: all .2s ease;
}

.btn[disabled] {
    opacity: .5;
    cursor: not-allowed;
}

.btn:hover {
    border-color: rgba(16, 185, 129, .5);
    background: rgba(16, 185, 129, .1);
    color: #a7f3d0;
    box-shadow: 0 0 10px rgba(16, 185, 129, .2);
    transform: translateY(-1px);
}

.btn:active {
    transform: scale(.96);
}

.btn.ghost {
    background: transparent;
    color: #9ca3af;
    border-color: rgba(255, 255, 255, .1);
}

.btn.ghost:hover {
    color: #d1fae5;
    border-color: rgba(16, 185, 129, .4);
}

.btn.ghost.on {
    border-color: rgba(16, 185, 129, .6);
    color: #a7f3d0;
}

/* Log list */
.log-area {
    background: #0f0f0f;
    border: 1px solid rgba(255, 255, 255, .08);
    border-radius: 10px;
    padding: 12px 14px;
    max-height: 260px;
    overflow-y: auto;
    font-size: 13px;
}

.log-line {
    padding: 10px 0;
    border-bottom: 1px dashed rgba(255, 255, 255, .06);
}

.log-line:last-child {
    border-bottom: 0;
}

.log-row {
    display: flex;
    gap: 10px;
    align-items: center;
    margin-bottom: 6px;
}

.pill {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, .12);
    background: rgba(255, 255, 255, .06);
}

.pill.ok {
    border-color: rgba(16, 185, 129, .45);
    background: rgba(16, 185, 129, .10);
    color: #a7f3d0;
}

.pill.bad {
    border-color: rgba(239, 68, 68, .45);
    background: rgba(239, 68, 68, .1);
    color: #fecaca;
}

.method {
    color: #cbd5e1;
}

.path {
    color: #e5e7eb;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.status {
    margin-left: auto;
}

.status.ok {
    color: #10b981;
}

.status.bad {
    color: #ef4444;
}

.json {
    white-space: pre-wrap;
    color: #d6e0ea;
}

/* Empty state */
.empty {
    background: #0f0f10;
    border: 1px dashed rgba(255, 255, 255, .12);
    border-radius: 12px;
    padding: 28px 18px;
    display: grid;
    place-items: center;
}

.empty-inner {
    text-align: center;
    max-width: 560px;
}

.emoji {
    font-size: 28px;
    margin-bottom: 6px;
}

.title {
    font-weight: 700;
    margin-bottom: 6px;
}

.hint {
    color: #a3a3a3;
    font-size: 13px;
}

.actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    justify-content: center;
}
</style>