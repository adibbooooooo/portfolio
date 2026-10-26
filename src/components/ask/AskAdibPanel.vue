<template>
    <div
        class="ask-panel relative flex min-h-0 flex-col overflow-hidden rounded-[10px] border border-seperator bg-[#141414]/98"
        :class="variant === 'modal' ? 'ask-panel--modal h-full' : ''"
        aria-label="Ask about Adib">
        <div v-if="showHeader" class="border-b border-seperator px-3 py-2.5">
            <div class="text-[13px] font-medium text-white">ask.adib()</div>
            <p class="mt-0.5 text-[11px] leading-snug text-white/45">
                Questions about my work, experience &amp; style
            </p>
        </div>

        <div
            ref="logEl"
            class="ask-log min-h-[120px] flex-1 overflow-y-auto px-3 py-3 text-[13px] leading-relaxed no-scrollbar"
            :class="variant === 'modal' ? 'max-h-none' : 'max-h-[220px]'"
            @scroll="onLogScroll">
            <div
                v-if="!messages.length && !loading"
                class="ask-empty flex flex-col items-center px-2 py-5 text-center">
                <p class="text-[15px] font-semibold text-white/95">Hey, I'm AI-dib</p>
                <p class="mt-1 max-w-[260px] text-[12px] leading-snug text-white/45">
                    Adib's digital self. Ask about work, projects, teamwork, or personality.
                </p>
                <div class="mt-4 flex w-full max-w-[300px] flex-col gap-1.5">
                    <button
                        v-for="s in suggestions"
                        :key="s"
                        type="button"
                        class="ask-suggestion-pill w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-[12px] text-white/70 transition-colors hover:border-emerald-400/35 hover:bg-emerald-400/[0.06] hover:text-emerald-50 disabled:opacity-40"
                        :disabled="loading"
                        @click="submit(s)">
                        {{ s }}
                    </button>
                </div>
            </div>

            <div v-else class="ask-thread space-y-3">
                <div
                    v-for="(m, i) in messages"
                    :key="i"
                    class="flex"
                    :class="m.role === 'user' ? 'justify-end' : 'justify-start'">
                    <div
                        class="ask-bubble max-w-[min(100%,18rem)]"
                        :class="
                            m.role === 'user'
                                ? 'ask-bubble--user rounded-2xl rounded-br-md px-3 py-2'
                                : 'ask-bubble--assistant rounded-2xl rounded-bl-md px-3 py-2'
                        ">
                        <span
                            v-if="m.role === 'assistant'"
                            class="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-emerald-300/70">
                            ai-dib
                        </span>
                        <p
                            v-if="shouldLinkifyMessage(m, i)"
                            class="ask-message-body whitespace-pre-wrap"
                            v-html="formatAssistantMessageHtml(renderedMessage(m, i))" />
                        <p v-else class="whitespace-pre-wrap">{{ renderedMessage(m, i) }}</p>
                    </div>
                </div>

                <div v-if="loading" class="flex justify-start">
                    <div class="ask-bubble ask-bubble--assistant rounded-2xl rounded-bl-md px-3 py-2.5">
                        <span class="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-emerald-300/70">
                            ai-dib
                        </span>
                        <div class="flex items-center gap-2">
                            <span class="typing-dots" aria-hidden="true">
                                <span /><span /><span />
                            </span>
                            <p class="typing-indicator text-[12px] font-medium tracking-wide">
                                thinking…
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="border-t border-seperator px-3 py-2.5">
            <form class="flex items-end gap-2" @submit.prevent="submit(input)">
                <label class="sr-only" :for="inputId">Your question</label>
                <textarea
                    :id="inputId"
                    ref="inputEl"
                    v-model="input"
                    rows="1"
                    autocomplete="off"
                    maxlength="500"
                    :disabled="loading"
                    placeholder="Message AI-dib…"
                    class="ask-input no-scrollbar min-w-0 flex-1 resize-none rounded-xl border border-white/10 bg-[#0a0b0c] px-3 py-2.5 leading-5 text-white/90 placeholder:text-white/35 focus:border-emerald-400/45 focus:outline-none focus:ring-1 focus:ring-emerald-400/20 disabled:opacity-50"
                    @focus="onInputFocus"
                    @blur="onInputBlur"
                    @input="resizeInput"
                    @keydown="onInputKeydown" />
                <button
                    type="submit"
                    class="flex h-[42px] w-[42px] shrink-0 cursor-pointer items-center justify-center rounded-xl border border-emerald-400/45 bg-emerald-500/15 text-emerald-100 transition-colors hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:opacity-40"
                    :disabled="loading || !input.trim()"
                    aria-label="Send message">
                    <i class="pi pi-send text-[13px]" />
                </button>
            </form>
        </div>

        <input
            v-model="honeypot"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
            class="sr-only"
            aria-hidden="true" />
    </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onBeforeUnmount, onMounted } from 'vue'
import { useAskAdib } from '@/composables/useAskAdib'
import { formatAssistantMessageHtml } from '@/lib/linkifyMessage'
import {
    lockViewportZoom,
    scrollInputIntoView,
    unlockViewportZoom,
} from '@/lib/preventInputZoom'

withDefaults(
    defineProps<{
        variant?: 'rail' | 'modal'
        showHeader?: boolean
        inputId?: string
    }>(),
    {
        variant: 'rail',
        showHeader: true,
        inputId: 'ask-adib-input',
    },
)

const suggestions = [
    'What do you do?',
    'Would I fit a small team?',
    'How do you work on a team?',
]

const MAX_INPUT_LINES = 5

const { messages, loading, ask } = useAskAdib()
const input = ref('')
const honeypot = ref('')
const logEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLTextAreaElement | null>(null)
const stickToBottom = ref(true)
const animatedAssistantText = ref<Record<number, string>>({})
const typewriterTimers = new Map<number, ReturnType<typeof setTimeout>>()

async function submit(text: string) {
    if (honeypot.value) return
    const q = text.trim()
    if (!q) return
    input.value = ''
    stickToBottom.value = true
    await nextTick()
    resizeInput()
    await ask(q)
    await nextTick()
    scrollLogToBottom()
}

function onInputFocus() {
    lockViewportZoom()
    scrollInputIntoView(inputEl.value)
}

function onInputBlur() {
    unlockViewportZoom()
}

function onInputKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        void submit(input.value)
    }
}

function resizeInput() {
    const el = inputEl.value
    if (!el) return
    el.style.height = 'auto'
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight) || 20
    const verticalPad = el.offsetHeight - el.clientHeight
    const maxHeight = lineHeight * MAX_INPUT_LINES + verticalPad
    el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`
    el.style.overflowY = 'hidden'
}

function onLogScroll() {
    const el = logEl.value
    if (!el) return
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    stickToBottom.value = distance < 56
}

function renderedMessage(message: { role: 'user' | 'assistant'; content: string }, index: number): string {
    if (message.role !== 'assistant') return message.content
    const animated = animatedAssistantText.value[index]
    if (animated !== undefined) return animated
    return message.content
}

function shouldLinkifyMessage(message: { role: 'user' | 'assistant'; content: string }, index: number): boolean {
    const text = renderedMessage(message, index)
    if (!text) return false
    if (message.role === 'user') return true
    const animated = animatedAssistantText.value[index]
    if (animated === undefined) return true
    return animated.length >= message.content.length
}

function scrollLogToBottom() {
    const el = logEl.value
    if (!el) return
    el.scrollTop = el.scrollHeight
}

function animateAssistantMessage(index: number, text: string) {
    const existing = typewriterTimers.get(index)
    if (existing) clearTimeout(existing)

    animatedAssistantText.value = { ...animatedAssistantText.value, [index]: '' }
    let cursor = 0
    const total = text.length

    const tick = () => {
        cursor = Math.min(total, cursor + 1)
        animatedAssistantText.value = {
            ...animatedAssistantText.value,
            [index]: text.slice(0, cursor),
        }
        if (stickToBottom.value && (cursor % 6 === 0 || cursor >= total)) {
            void nextTick().then(scrollLogToBottom)
        }
        if (cursor >= total) {
            typewriterTimers.delete(index)
            return
        }
        const ch = text[cursor - 1]
        const delay = ch === '\n' ? 26 : ch === ' ' ? 13 : 17
        typewriterTimers.set(index, setTimeout(tick, delay))
    }

    tick()
}

watch(
    () => messages.value.length,
    async (nextLen, prevLen) => {
        if (nextLen > prevLen) {
            const idx = nextLen - 1
            const msg = messages.value[idx]
            if (msg?.role === 'user') {
                stickToBottom.value = true
            }
            if (msg?.role === 'assistant') {
                animateAssistantMessage(idx, msg.content)
            }
        }

        await nextTick()
        if (stickToBottom.value) {
            scrollLogToBottom()
        }
    },
)

watch(loading, async (isLoading) => {
    if (isLoading && stickToBottom.value) {
        await nextTick()
        scrollLogToBottom()
    }
})

onMounted(() => {
    resizeInput()
})

onBeforeUnmount(() => {
    unlockViewportZoom()
    for (const timer of typewriterTimers.values()) {
        clearTimeout(timer)
    }
    typewriterTimers.clear()
})
</script>

<style scoped>
.ask-panel:not(.ask-panel--modal) {
    max-height: min(480px, calc(100dvh - 300px));
}

.ask-input {
    /* 16px minimum stops iOS Safari auto-zoom on focus */
    font-size: 16px;
    max-height: calc(1.25rem * 5 + 1.25rem);
    overflow-y: hidden;
    field-sizing: content;
    -webkit-text-size-adjust: 100%;
    touch-action: manipulation;
}

.ask-input::placeholder {
    font-size: 16px;
}

@media (min-width: 768px) {
    .ask-input {
        font-size: 13px;
    }

    .ask-input::placeholder {
        font-size: 13px;
    }
}

.ask-bubble--user {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.1) 100%);
    border: 1px solid rgba(52, 211, 153, 0.22);
    color: rgba(236, 253, 245, 0.95);
}

.ask-bubble--assistant {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    color: rgba(243, 244, 246, 0.88);
}

.ask-message-body :deep(.ask-link) {
    color: rgba(167, 243, 208, 0.95);
}

.ask-message-body :deep(.ask-list-item) {
    margin-top: 0.35rem;
    padding-left: 0.65rem;
    border-left: 2px solid rgba(52, 211, 153, 0.25);
}

.ask-message-body :deep(.ask-list-item + .ask-list-item) {
    margin-top: 0.45rem;
}

.ask-message-body :deep(.ask-list-line + .ask-list-item) {
    margin-top: 0.5rem;
}

.typing-indicator {
    color: rgba(209, 213, 219, 0.55);
    background-image: linear-gradient(
        105deg,
        rgba(209, 213, 219, 0.4) 38%,
        rgba(110, 231, 183, 0.92) 50%,
        rgba(209, 213, 219, 0.4) 62%
    );
    background-size: 240% 100%;
    background-position: 120% 0;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: typingShine 4.2s ease-in-out infinite;
}

@keyframes typingShine {
    0%,
    100% {
        background-position: 120% 0;
    }
    50% {
        background-position: -120% 0;
    }
}

.typing-dots {
    display: inline-flex;
    gap: 4px;
    align-items: center;
}

.typing-dots span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: rgba(110, 231, 183, 0.75);
    animation: dotBounce 1.4s ease-in-out infinite;
}

.typing-dots span:nth-child(2) {
    animation-delay: 0.16s;
}

.typing-dots span:nth-child(3) {
    animation-delay: 0.32s;
}

@keyframes dotBounce {
    0%,
    80%,
    100% {
        transform: translateY(0);
        opacity: 0.45;
    }
    40% {
        transform: translateY(-4px);
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .typing-indicator {
        animation: none;
        -webkit-text-fill-color: rgba(209, 213, 219, 0.55);
        background: none;
    }

    .typing-dots span {
        animation: none;
        opacity: 0.7;
    }
}
</style>
