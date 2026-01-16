<template>
    <section>
        <p class="text-[12px] text-[#8F8F8F] mb-3">{{ "<!-- Get in touch -->" }}</p>

        <div class="w-full rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8">
            <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[34px] md:text-5xl mb-6">
                Let’s Work <span class="text-neutral-400">Together</span>
            </h2>

            <form @submit.prevent="sendEmail" class="grid gap-4" novalidate>
                <!-- Name -->
                <label class="sr-only" for="ct-name">Your name</label>
                <input id="ct-name" v-model.trim="name" type="text" placeholder="Your name"
                    class="w-full rounded-xl border border-white/15 bg-[#0e0f10] text-white/90 placeholder-white/30 px-4 py-3 focus:outline-none focus:border-emerald-400/50"
                    required />

                <!-- Email -->
                <label class="sr-only" for="ct-email">Email address</label>
                <input id="ct-email" v-model.trim="email" type="email" inputmode="email" placeholder="Email address"
                    class="w-full rounded-xl border bg-[#0e0f10] text-white/90 placeholder-white/30 px-4 py-3 focus:outline-none
                 transition-colors
                 border-white/15"
                    :class="!email || isEmail ? 'focus:border-emerald-400/50' : 'border-red-400/40 focus:border-red-400/70'"
                    required />
                <p v-if="email && !isEmail" class="text-[12px] text-red-300/90 -mt-2">
                    Please enter a valid email.
                </p>

                <!-- Subject -->
                <label class="sr-only" for="ct-title">Subject</label>
                <input id="ct-title" v-model.trim="title" type="text"
                    placeholder="Subject (e.g. Stripe Connect dashboard)"
                    class="w-full rounded-xl border border-white/15 bg-[#0e0f10] text-white/90 placeholder-white/30 px-4 py-3 focus:outline-none focus:border-emerald-400/50"
                    required />

                <!-- Message -->
                <label class="sr-only" for="ct-message">Message</label>
                <textarea
                    id="ct-message"
                    v-model.trim="message"
                    rows="6"
                    placeholder="Short brief (scope, timeline, goals)…"
                    class="w-full min-h-[140px] rounded-xl border border-white/15 bg-[#0e0f10] text-white/90 placeholder-white/30 px-4 py-3 focus:outline-none focus:border-emerald-400/50 resize-y"
                    required
                />
                <div class="flex items-center justify-between -mt-2">
                    <span class="text-[12px] text-white/40">Autosaved locally • {{ timezoneNote }}</span>
                    <span class="text-[12px] text-white/50">{{ wordCount }} words</span>
                </div>

                <div class="mt-3 primary-text text-[14px]">Send through:</div>

                <div class="flex flex-wrap gap-3">
                    <!-- Email -->
                    <a :href="isReady ? emailHref : undefined" :aria-disabled="!isReady" class="inline-flex items-center gap-2 rounded-lg border border-emerald-400/50 bg-emerald-400/10 px-4 py-2 text-emerald-100
                   hover:bg-emerald-400/15 hover:border-emerald-400/70 transition
                   disabled:opacity-40 disabled:pointer-events-none"
                        :class="!isReady ? 'opacity-40 pointer-events-none' : ''">
                        Email <i class="pi pi-envelope text-[12px]"></i>
                    </a>

                    <!-- WhatsApp -->
                    <a :href="isReady ? waHref : undefined" target="_blank" rel="noopener" :aria-disabled="!isReady"
                        class="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-white/5 px-4 py-2 text-white/85
                   hover:bg-white/10 transition disabled:opacity-40 disabled:pointer-events-none"
                        :class="!isReady ? 'opacity-40 pointer-events-none' : ''">
                        WhatsApp
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-[14px] w-[14px]" viewBox="0 0 24 24"
                            fill="currentColor">
                            <path
                                d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.62-6.002C.122 5.3 5.48 0 12.06 0c3.19 0 6.167 1.24 8.413 3.488A11.77 11.77 0 0124 11.93c-.003 6.58-5.36 11.936-11.94 11.936a11.95 11.95 0 01-6.084-1.64L.057 24zM6.51 20.13c1.81 1.07 3.903 1.64 6.05 1.64h.006c5.448 0 9.885-4.434 9.888-9.88.002-5.455-4.43-9.89-9.884-9.892-5.45 0-9.885 4.434-9.887 9.884 0 2.16.676 4.166 1.83 5.81l-.844 3.086 3.84-.748zm11.387-5.45c-.074-.123-.27-.198-.563-.347-.295-.148-1.74-.857-2.012-.954-.27-.1-.466-.148-.66.147-.193.296-.758.954-.93 1.148-.17.194-.343.222-.635.074-.296-.148-1.248-.46-2.378-1.47-.88-.786-1.475-1.76-1.647-2.056-.17-.296-.018-.455.13-.603.134-.133.296-.347.443-.52.148-.174.197-.297.296-.495.1-.198.05-.37-.025-.52-.075-.147-.66-1.59-.904-2.176-.238-.57-.48-.49-.66-.49-.17-.01-.37-.012-.568-.012-.2 0-.52.074-.79.37-.27.296-1.04 1.017-1.04 2.48 0 1.464 1.066 2.875 1.213 3.074.148.198 2.1 3.2 5.08 4.487.71.306 1.263.49 1.694.63.712.226 1.36.194 1.872.118.572-.085 1.74-.71 1.987-1.395.246-.686.246-1.273.172-1.395z" />
                        </svg>
                    </a>

                    <!-- Call -->
                    <a :href="`tel:${PHONE_NUMBER}`"
                        class="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-white/85 hover:bg-white/10 transition">
                        Call
                    </a>
                </div>
            </form>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

/** State */
const name = ref('')
const email = ref('')
const title = ref('')
const message = ref('')

/** Config */
const TO_EMAIL = 'work@adibomar.com'
const WHATSAPP_NUMBER = '601161770407'   // intl format, no "+" or spaces
const PHONE_NUMBER = '+601161770407'     // tel: link friendly

/** Validation */
const isEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const isReady = computed(() => name.value && isEmail.value && title.value && message.value)

/** Counters & misc */
const wordCount = computed(() => (message.value.trim() ? message.value.trim().split(/\s+/).length : 0))
const timezoneNote = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Your time zone'

/** Hrefs (so links work with normal anchor UX) */
const subject = computed(() => `[Inquiry] ${title.value}`)

const emailHref = computed(() => {
    if (!isReady.value) return ''
    const body = `Name: ${name.value}\nEmail: ${email.value}\n\n${message.value}`
    return `mailto:${TO_EMAIL}?subject=${encodeURIComponent(subject.value)}&body=${encodeURIComponent(body)}`
})

const waHref = computed(() => {
    if (!isReady.value) return ''
    const text = `Hi Adib, I'm ${name.value}.\n\nProject: ${title.value}\n\n${message.value}`
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
})

/** Autosave */
const KEY = 'contact_draft_v1'
onMounted(() => {
    try {
        const raw = localStorage.getItem(KEY)
        if (raw) {
            const d = JSON.parse(raw)
            name.value = d.name || ''
            email.value = d.email || ''
            title.value = d.title || ''
            message.value = d.message || ''
        }
    } catch { }
})
watch([name, email, title, message], () => {
    localStorage.setItem(KEY, JSON.stringify({
        name: name.value, email: email.value, title: title.value, message: message.value
    }))
}, { deep: true })

/** Fallback submit (in case someone presses Enter on form) */
const sendEmail = () => {
    if (!isReady.value) return
    window.location.href = emailHref.value
}
</script>

<style scoped>
/* hide labels visually but keep for screen readers */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
</style>