import { ref } from 'vue'
import { useSessionStorage } from '@vueuse/core'
import { inferSuggestContact } from '@/lib/askSuggestContact'
import { isSyntheticErrorReply } from '@/lib/askClientErrors'

export type AskMessage = {
    role: 'user' | 'assistant'
    content: string
    /** In-chat Contact CTA after this assistant turn */
    suggestContact?: boolean
    /** Failed request — do not send to API as assistant history */
    isError?: boolean
}

/** Same-origin PHP API — keys stay on the server (see api/config.local.php). */
const apiUrl = import.meta.env.VITE_ASK_API_URL ?? '/api/ask.php'
const MIN_LOADING_MS = 1000

/** Shared across modal open/close; cleared only via clear() or full page reload. */
const messages = ref<AskMessage[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const sessionId = useSessionStorage('portfolio-ask-session', () => crypto.randomUUID())

export function useAskAdib() {

    async function ask(question: string) {
        const q = question.trim()
        if (!q || loading.value) return

        const startedAt = Date.now()
        loading.value = true
        error.value = null
        messages.value.push({ role: 'user', content: q })

        try {
            const prior = messages.value
                .slice(0, -1)
                .slice(-10)
                .filter(
                    (m) =>
                        !m.isError &&
                        !(m.role === 'assistant' && isSyntheticErrorReply(m.content)),
                )
                .map((m) => ({
                    role: m.role,
                    content: m.content,
                }))

            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: q,
                    sessionId: sessionId.value,
                    history: prior,
                    website: '',
                }),
            })

            const data = (await safeParseJson(res)) as {
                answer?: string
                error?: unknown
                allowed?: boolean
                suggestContact?: boolean
                code?: string
                hint?: string
            }

            if (!res.ok) {
                throw new Error(
                    resolveFriendlyError(
                        res.status,
                        normalizeApiError(data.error),
                        typeof data.code === 'string' ? data.code : undefined,
                        typeof data.hint === 'string' ? data.hint : undefined,
                    ),
                )
            }

            await ensureMinLoading(startedAt)
            const answer = data.answer ?? 'No answer returned.'
            const suggestContact =
                typeof data.suggestContact === 'boolean'
                    ? data.suggestContact
                    : inferSuggestContact(q, answer)
            messages.value.push({
                role: 'assistant',
                content: answer,
                suggestContact,
            })
        } catch (e) {
            const msg = e instanceof Error ? toFriendlyClientError(e.message) : 'Sorry, I hit a small issue. Please try again.'
            await ensureMinLoading(startedAt)
            error.value = msg
            messages.value.push({
                role: 'assistant',
                content: msg,
                isError: true,
            })
        } finally {
            loading.value = false
        }
    }

    function clear() {
        messages.value = []
        error.value = null
    }

    return { messages, loading, error, ask, clear, sessionId }
}

async function ensureMinLoading(startedAt: number): Promise<void> {
    const elapsed = Date.now() - startedAt
    if (elapsed >= MIN_LOADING_MS) return
    await new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS - elapsed))
}

async function safeParseJson(res: Response): Promise<Record<string, unknown>> {
    const text = await res.text()
    if (!text.trim()) return {}
    try {
        return JSON.parse(text) as Record<string, unknown>
    } catch {
        return {}
    }
}

function normalizeApiError(err: unknown): string | undefined {
    if (typeof err === 'string' && err.trim() && err !== 'Array') {
        return err.trim()
    }
    if (err && typeof err === 'object') {
        const msg = (err as { message?: unknown }).message
        if (typeof msg === 'string' && msg.trim()) return msg.trim()
    }
    return undefined
}

function resolveFriendlyError(
    status: number,
    apiError?: string,
    code?: string,
    hint?: string,
): string {
    if (status === 429) {
        return 'Hey, we have hit the question limit for now. Please try again in about an hour.'
    }
    if (code === 'gemini_model_misconfigured') {
        return hint?.trim()
            ? `Sorry, my answer model is misconfigured on the server. ${hint}`
            : 'Sorry, my answer model is misconfigured on the server. Update gemini_answer_models in config.local.php (use list:gemini-models, not Live models).'
    }
    if (status === 503) {
        const detail = apiError?.toLowerCase() ?? ''
        if (detail.includes('not configured')) {
            return 'I am still being set up right now. Please try again soon.'
        }
        if (detail.includes('not found') && detail.includes('model')) {
            return 'Sorry, my answer model is misconfigured on the server. Use generateContent model ids from list:gemini-models (not *flash-live*).'
        }
        return 'I am still being set up right now. Please try again soon.'
    }
    if (status >= 500) {
        const detail = apiError?.toLowerCase() ?? ''
        if (detail.includes('not found') && detail.includes('model')) {
            return 'Sorry, my answer model is misconfigured on the server. Use generateContent model ids from list:gemini-models (not *flash-live*).'
        }
        return 'Sorry, I am having a small hiccup right now. Please try again in a bit.'
    }
    if (apiError && apiError.trim()) return withFriendlyPrefix(apiError)
    return 'Sorry, I could not answer that this time. Mind trying once more?'
}

function withFriendlyPrefix(message: string): string {
    const clean = message.trim()
    if (!clean) return 'Sorry, something went wrong on my side. Please try again.'
    if (/unexpected end of json input/i.test(clean)) {
        return 'Sorry, I got an incomplete response just now. Please try again.'
    }
    if (/failed to fetch|networkerror|network request failed/i.test(clean)) {
        return 'Sorry, I could not reach the server. Please check your connection and try again.'
    }
    if (/method not allowed/i.test(clean)) {
        return 'Sorry, I could not process that request format. Please try again.'
    }
    if (/^(hey|hi|hello|sorry)\b/i.test(clean)) return clean
    return `Sorry, I hit an issue: ${clean}`
}

function toFriendlyClientError(message: string): string {
    const clean = message.trim()
    if (!clean) return 'Sorry, something went wrong on my side. Please try again.'
    if (/unexpected end of json input/i.test(clean)) {
        return 'Sorry, I got an incomplete response just now. Please try again.'
    }
    if (/failed to fetch|networkerror|network request failed/i.test(clean)) {
        return 'Sorry, I could not reach the server. Please check your connection and try again.'
    }
    return clean
}
