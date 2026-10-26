<template>
    <!-- Desktop layout -->
    <div class="hidden md:grid w-full grid-cols-[300px_minmax(0,1fr)] h-dvh overflow-hidden">
        <!-- Left rail -->
        <div class="border-r border-seperator bg-[#181818]">
            <aside class="h-dvh flex flex-col pt-1">
                <div class="flex items-center gap-3 p-4 border-b border-seperator fade-left">
                    <img src="/avatar.jpeg" alt="Avatar" class="h-[90px] w-[90px] rounded object-cover select-none"
                        draggable="false" />
                    <div>
                        <div class="text-4 font-semibold leading-tight text-white">Adib Omar</div>
                        <div class="text-[12px] tracking-wide text-primary pt-2">
                            Versatile Software Engineer
                        </div>
                    </div>
                </div>

                <!-- bio -->
                <FadeInLeft>
                    <div class="p-4 text-[14px] leading-6 text-primary">
                        I’m a versatile software engineer driven by curiosity and purpose. I believe in
                        building systems that last and always work like it’s my own company.
                    </div>
                </FadeInLeft>

                <!-- info list -->
                <ul class="p-4 space-y-2.5 text-[14px] text-primary border-t border-seperator fade-left">
                    <li class="flex items-center gap-3">
                        <i class="pi pi-briefcase"></i>{{ ' ' + yearsOfExperience }}+ years of experience
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="pi pi-map-marker"></i>Kuala Lumpur, Malaysia
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="pi pi-language"></i>Malay, English
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="pi pi-envelope"></i>
                        <a :href="emailHref" class="contact-link" aria-label="Email Adib">
                            work@adibomar.com
                        </a>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="pi pi-phone"></i>
                        <a :href="phoneHref" class="contact-link" aria-label="Call Adib">
                            +60 11 6177 0407
                        </a>
                    </li>
                    <li class="flex items-center gap-3">
                        <i class="pi pi-linkedin"></i>
                        <a
                            href="https://www.linkedin.com/in/adibomar/"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="contact-link">
                            linkedin.com/in/adibomar
                        </a>
                    </li>
                </ul>

                <!-- Bottom actions -->
                <div class="mt-auto border-t border-seperator p-5 fade-left flex flex-col gap-3">
                    <div class="grid grid-cols-[1fr_36px]">
                        <button
                            class="cursor-pointer rounded-l border border-seperator bg-[#222] px-3.5 py-2.5 text-[13px] font-semibold text-white hover:bg-[#272727]"
                            @click="openDownloadModal">
                            Download CV
                        </button>
                        <button
                            class="cursor-pointer rounded-r border border-seperator bg-[#222] text-emerald-300 hover:bg-[#272727]"
                            @click="openDownloadModal" aria-label="Download">
                            <i class="pi pi-download"></i>
                        </button>
                    </div>

                    <a href="https://cal.com/adibomar/meeting" target="_blank" rel="noopener noreferrer">
                        <VariantButton>Schedule a call</VariantButton>
                    </a>
                </div>
            </aside>
        </div>

        <!-- Right side -->
        <div class="relative flex flex-col min-h-0">
            <!-- top tabs -->
            <div
                class="absolute left-0 right-0 top-0 h-[30px] z-40 border-b border-seperator bg-[#181818] backdrop-blur text-[13px] pl-2 pr-5">
                <div class="mx-auto flex h-full items-center justify-between">
                    <nav ref="navEl" class="relative hidden md:flex text-neutral-300 select-none">
                        <!-- Home -->
                        <RouterLink to="/" custom v-slot="{ href, navigate, isActive }">
                            <a :href="href" @click="navigate" class="code-tab"
                                :class="isActive ? 'text-white' : 'hover:text-white'"
                                :ref="el => registerTab(el, '/')">my.info</a>
                        </RouterLink>

                        <!-- Personality -->
                        <RouterLink to="/personality" custom v-slot="{ href, navigate, isActive }">
                            <a :href="href" @click="navigate" class="code-tab"
                                :class="isActive ? 'text-white' : 'hover:text-white'"
                                :ref="el => registerTab(el, '/personality')">my.personality</a>
                        </RouterLink>

                        <!-- Work -->
                        <RouterLink to="/work" custom v-slot="{ href, navigate, isActive }">
                            <a :href="href" @click="navigate" class="code-tab"
                                :class="isActive ? 'text-white' : 'hover:text-white'"
                                :ref="el => registerTab(el, '/work')">work.showcase</a>
                        </RouterLink>

                        <!-- Experience -->
                        <RouterLink to="/experience" custom v-slot="{ href, navigate, isActive }">
                            <a :href="href" @click="navigate" class="code-tab"
                                :class="isActive ? 'text-white' : 'hover:text-white'"
                                :ref="el => registerTab(el, '/experience')">work.experience</a>
                        </RouterLink>

                        <!-- sliding underline -->
                        <span class="tab-underline absolute bottom-0 h-[2px] bg-emerald-500 pointer-events-none"
                            :style="indicatorStyle" />
                    </nav>

                    <FadeInLeft>
                        <div class="flex items-center gap-4">
                            <button
                                type="button"
                                class="rounded-md bg-emerald-500/15 px-2 py-0.5 text-emerald-300 ring-1 ring-emerald-400/30 cursor-pointer transition hover:bg-emerald-500/25 hover:ring-emerald-400/50"
                                @click="openContactModal">
                                ● Open for Collaboration
                            </button>
                            <span class="hidden text-neutral-400 sm:inline">
                                Kuala Lumpur, Malaysia • My time: {{ timeKL }}
                            </span>
                        </div>
                    </FadeInLeft>
                </div>
            </div>

            <!-- page content -->
            <div class="pt-[30px] flex-1 min-h-0 overflow-hidden">
                <div class="h-full min-h-0">
                    <slot />
                </div>
            </div>
        </div>
    </div>

    <!-- Mobile layout -->
    <div class="md:hidden flex h-dvh flex-col bg-[#121212]">
        <!-- top bar -->
        <header class="flex items-center justify-between px-3 py-2 border-b border-seperator bg-[#181818]">
            <div class="flex items-center gap-2">
                <img src="/avatar.jpeg" alt="Avatar" class="h-8 w-8 rounded object-cover select-none"
                    draggable="false" />
                <span class="text-white/90 text-[13px] font-semibold">Adib Omar</span>
            </div>

            <button
                class="inline-flex items-center justify-center h-8 w-8 rounded bg-white/5 text-white/80 hover:bg-white/10"
                @click="openNav" aria-label="Open menu">
                <i class="pi pi-bars text-[14px]"></i>
            </button>
        </header>

        <!-- content -->
        <main class="flex-1 overflow-y-auto no-scrollbar">
            <slot />
        </main>

        <!-- floating action row -->
        <footer class="px-3 py-2 border-t border-seperator bg-[#181818]">
            <div class="flex items-center justify-between">
                <button
                    type="button"
                    class="rounded-md bg-emerald-500/15 px-2 py-0.5 text-emerald-300 ring-1 ring-emerald-400/30 cursor-pointer text-[12px] transition hover:bg-emerald-500/25"
                    @click="openContactModal">
                    ● Open for Collaboration
                </button>
                <span class="text-neutral-400 text-[12px]">{{ timeKL }}</span>
            </div>
        </footer>

        <!-- mobile sheet -->
        <transition name="navsheet">
            <div v-if="navOpen" class="fixed inset-0 z-50" @keydown.esc="closeNav" role="dialog" aria-modal="true">
                <!-- dim -->
                <div class="absolute inset-0 bg-black/60" @click="closeNav"></div>

                <!-- card (animated) -->
                <div class="absolute right-3 left-3 top-3 sheet-card">
                    <div class="flex items-center justify-between px-4 py-3 border-b border-seperator">
                        <div class="text-white font-semibold">Navigation</div>
                        <button
                            class="inline-flex h-8 w-8 items-center justify-center rounded bg-white/5 text-white/80 hover:bg-white/10"
                            @click="closeNav" aria-label="Close">
                            <i class="pi pi-times text-[13px]"></i>
                        </button>
                    </div>

                    <!-- staggered list -->
                    <div class="p-3 space-y-1"><!-- my.info -->
                        <RouterLink to="/" custom v-slot="{ href, navigate, isActive }">
                            <a :href="href" @click.prevent="navigate(); closeNav()"
                                :class="[navLinkClass, isActive ? 'bg-white/10 text-white' : '']">
                                my.info
                            </a>
                        </RouterLink>

                        <!-- my.personality -->
                        <RouterLink to="/personality" custom v-slot="{ href, navigate, isActive }">
                            <a :href="href" @click.prevent="navigate(); closeNav()"
                                :class="[navLinkClass, isActive ? 'bg-white/10 text-white' : '']">
                                my.personality
                            </a>
                        </RouterLink>

                        <!-- work.showcase -->
                        <RouterLink to="/work" custom v-slot="{ href, navigate, isActive }">
                            <a :href="href" @click.prevent="navigate(); closeNav()"
                                :class="[navLinkClass, isActive ? 'bg-white/10 text-white' : '']">
                                work.showcase
                            </a>
                        </RouterLink>

                        <!-- work.experience -->
                        <RouterLink to="/experience" custom v-slot="{ href, navigate, isActive }">
                            <a :href="href" @click.prevent="navigate(); closeNav()"
                                :class="[navLinkClass, isActive ? 'bg-white/10 text-white' : '']">
                                work.experience
                            </a>
                        </RouterLink>

                        <div class="my-2 h-px bg-white/10 nav-item" style="--i:3"></div>

                        <div class="px-3 py-2 text-[12px] text-neutral-400 nav-item" style="--i:4">
                            Kuala Lumpur • {{ timeKL }}
                        </div>

                        <div class="px-3 pb-3 nav-item" style="--i:5">
                            <a href="https://cal.com/adibomar/meeting" target="_blank" rel="noopener noreferrer"
                                class="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-400/10 px-3 py-1.5 text-emerald-200 hover:bg-emerald-400/15"
                                @click="closeNav">
                                Contact me <i class="pi pi-arrow-up-right text-[11px]"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>

    <!-- Download CV modal -->
    <transition name="navfade">
        <div v-if="showDownloadModal" class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 px-4"
            @click.self="closeDownloadModal">
            <div class="w-full max-w-md rounded-xl border border-white/15 bg-[#181818] p-5 shadow-xl">
                <div class="flex items-start justify-between gap-3">
                    <div>
                        <h2 class="text-white text-[16px] font-semibold">
                            Choose your CV format
                        </h2>
                        <p class="text-[13px] text-white/60 mt-1">
                            Download an ATS-friendly version for screening tools, or the visual
                            resume that’s easier for humans to read.
                        </p>
                    </div>
                    <button
                        class="inline-flex p-2 items-center justify-center rounded bg-white/5 text-white/70 hover:bg-white/10 cursor-pointer"
                        @click="closeDownloadModal" aria-label="Close"
                    >
                        <i class="pi pi-times text-[12px]" />
                    </button>
                </div>

                <div class="mt-4 space-y-3">
                    <button type="button" class="btn w-full" @click.stop="downloadCv('ats')">
                        Download ATS-friendly CV
                    </button>

                    <button type="button" class="btn ghost w-full" @click.stop="downloadCv('normal')">
                        Download visual CV
                    </button>
                </div>

                <p class="mt-4 text-[12px] text-white/50">
                    Auto-downloading visual CV in
                    <span class="text-emerald-300 font-semibold">{{ countdown }}</span>
                    s unless you choose a format.
                </p>
            </div>
        </div>
    </transition>

    <ContactModal />
    <AskAdibModal />
    <AskAdibFab />
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import FadeInLeft from '@/components/FadeInLeft.vue'
import VariantButton from '@/components/VariantButton.vue'
import ContactModal from '@/components/ContactModal.vue'
import AskAdibModal from '@/components/ask/AskAdibModal.vue'
import AskAdibFab from '@/components/ask/AskAdibFab.vue'
import { useContactModal } from '@/composables/useContactModal'

const { openContactModal } = useContactModal()

/* ---------- Desktop: experience years ---------- */
const yearsOfExperience = computed(() => {
    const start = new Date(2020, 1) // Feb = 1
    const now = new Date()
    const diff = now.getFullYear() - start.getFullYear()
    const hasPassedMonth =
        now.getMonth() > start.getMonth() ||
        (now.getMonth() === start.getMonth() && now.getDate() >= start.getDate())
    return hasPassedMonth ? diff : diff - 1
})

const emailHref =
    "mailto:work@adibomar.com?subject=Let's%20Work%20Together&body=Hi%20Adib,%0D%0A%0D%0AI%20found%20your%20portfolio%20and%20would%20love%20to%20discuss%20a%20project%20or%20collaboration.%0D%0A%0D%0ARegards,%0D%0A[Your%20Name]"
const phoneHref = 'tel:+601161770407'

/* ---------- KL clock ---------- */
const now = ref(new Date())
let timer: number | undefined
onMounted(() => {
    timer = window.setInterval(() => (now.value = new Date()), 1000)
    window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
    if (timer) clearInterval(timer)
    window.removeEventListener('resize', onResize)
    stopCountdown()
})

const timeKL = computed(() =>
    new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kuala_Lumpur',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    }).format(now.value)
)

/* ---------- Desktop: tab underline ---------- */
const route = useRoute()
const navEl = ref<HTMLElement | null>(null)
const tabMap = reactive(new Map<string, HTMLElement>())
const registerTab = (el: any, path: string) => {
    const htmlEl = el as HTMLElement | null
    if (htmlEl) tabMap.set(path, htmlEl)
}

const indicatorStyle = ref<Record<string, string>>({ transform: 'translateX(0px)', width: '0px' })

const updateIndicator = () => {
    const nav = navEl.value
    const el = tabMap.get(route.path) ?? tabMap.get('/')
    if (!nav || !el) return
    const navRect = nav.getBoundingClientRect()
    const rect = el.getBoundingClientRect()
    const left = rect.left - navRect.left
    indicatorStyle.value = { transform: `translateX(${left}px)`, width: `${rect.width}px` }
}
watch(() => route.path, async () => { await nextTick(); updateIndicator() }, { immediate: true })
const onResize = () => updateIndicator()

/* ---------- Mobile: sheet nav ---------- */
const navOpen = ref(false)
const openNav = () => { navOpen.value = true }
const closeNav = () => { navOpen.value = false }

// base class for mobile nav item
const navLinkClass =
    'block rounded px-3 py-2 text-[14px] text-white/90 hover:bg-white/[.06] transition-colors'

defineEmits(['hire'])

// ---------- Download CV modal + countdown ----------
const showDownloadModal = ref(false)
const countdown = ref(10)
const userInteracted = ref(false)
let countdownTimer: ReturnType<typeof setInterval> | null = null

function startCountdown() {
    stopCountdown()
    countdown.value = 10
    countdownTimer = setInterval(() => {
        countdown.value -= 1
        if (countdown.value <= 0) {
            // auto-download visual CV if user didn't click anything
            if (showDownloadModal.value && !userInteracted.value) {
                downloadCv('normal')
            }
            stopCountdown()
        }
    }, 1000)
}

function stopCountdown() {
    if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
    }
}

function openDownloadModal() {
    userInteracted.value = false
    showDownloadModal.value = true
    startCountdown()
}

function closeDownloadModal() {
    showDownloadModal.value = false
    stopCountdown()
}

function downloadCv(type: 'ats' | 'normal') {
    userInteracted.value = true
    stopCountdown()

    // close the modal once user chooses
    showDownloadModal.value = false

    const link = document.createElement('a')
    link.href =
        type === 'ats'
            ? '/pdf/Adib Omar - ATS.pdf'
            : '/pdf/Adib Omar - Resume.pdf'
    // optional: nice download filenames
    link.download = type === 'ats' ? 'Adib Omar - ATS CV.pdf' : 'Adib Omar - Resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* top tabs look */
.code-tab {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 0 12px;
    height: 30px;
    border-right: 1px solid rgba(255, 255, 255, 0.08);
    cursor: pointer;
}

/* ===== Mobile sheet premium animation ===== */
.sheet-card {
    border: 1px solid rgba(255, 255, 255, .1);
    background: #181818;
    border-radius: 12px;
    box-shadow:
        0 20px 50px rgba(0, 0, 0, .45),
        0 0 0 1px rgba(255, 255, 255, .02) inset;
    overflow: hidden;
}

/* Vue transition for the whole sheet */
.navsheet-enter-active,
.navsheet-leave-active {
    transition:
        opacity .18s ease,
        transform .24s cubic-bezier(.2, .8, .2, 1);
}

.navsheet-enter-from,
.navsheet-leave-to {
    opacity: 0;
}

.navsheet-enter-from .sheet-card,
.navsheet-leave-to .sheet-card {
    transform: translateY(-6px) scale(.985);
}

.navsheet-enter-to .sheet-card,
.navsheet-leave-from .sheet-card {
    transform: translateY(0) scale(1);
}

/* Staggered children inside the sheet */
.nav-item {
    opacity: 0;
    transform: translateY(6px);
    animation: navItemIn .28s cubic-bezier(.2, .8, .2, 1) forwards;
    animation-delay: calc(var(--i, 0) * 40ms);
}

@keyframes navItemIn {
    to {
        opacity: 1;
        transform: none;
    }
}

/* Active look for a mobile menu item (Telegram-ish pill) */
.is-active {
    background: rgba(16, 185, 129, .12);
    color: #d1fae5;
    border: 1px solid rgba(16, 185, 129, .35);
    border-radius: 10px;
}

/* simple fade for any legacy mobile overlay you kept */
.navfade-enter-active,
.navfade-leave-active {
    transition: opacity 0.15s ease;
}

.navfade-enter-from,
.navfade-leave-to {
    opacity: 0;
}



/* buttons (same system you use elsewhere) */
.btn {
    border: 1px solid rgba(255, 255, 255, 0.15);
    background: rgba(255, 255, 255, 0.05);
    color: #e5e7eb;
    font-size: 12px;
    border-radius: 8px;
    padding: 6px 10px;
    cursor: pointer;
    transition: all .2s ease;
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

.contact-link {
    cursor: pointer;
    transition: color 0.15s ease;
}

.contact-link:hover {
    color: #34d399;
}
</style>