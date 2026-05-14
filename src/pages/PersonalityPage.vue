<template>
    <EditorScaffold class="h-full">
        <section class="pb-12 fade-left">
            <header class="pt-8">
                <h1 class="normal-font text-white font-extrabold leading-[1.05] text-[34px] md:text-5xl mb-2">
                    My <span class="text-neutral-400">Personality</span>
                </h1>
                <p class="text-white/60 text-[12px] max-w-2xl">
                    {{ '<!-- Decisive operator lens: how I fit teams, ship impact, and collaborate — plus the full handbook -->' }}
                </p>
                <p class="mt-3 text-sm text-white/75 max-w-2xl leading-relaxed">
                    Relentless catalyst energy: clarity, ownership, and creative execution under pressure — with the receipts
                    below if you want every assessment chapter in full.
                </p>
            </header>

            <div class="mt-6 flex flex-wrap items-center gap-2 gap-y-3">
                <div class="inline-flex rounded-lg border border-white/15 bg-white/[0.04] p-0.5" role="tablist"
                    aria-label="Personality view">
                    <button id="tab-fit" type="button" role="tab" :aria-selected="view === 'fit'" aria-controls="panel-fit"
                        @click="setView('fit')"
                        class="px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer"
                        :class="view === 'fit'
                            ? 'bg-emerald-400/15 text-emerald-200 shadow-sm ring-1 ring-emerald-400/35'
                            : 'text-white/75 hover:text-white hover:bg-white/5'">
                        my.fit
                    </button>
                    <button id="tab-handbook" type="button" role="tab" :aria-selected="view === 'handbook'"
                        aria-controls="panel-handbook" @click="setView('handbook')"
                        class="px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer"
                        :class="view === 'handbook'
                            ? 'bg-emerald-400/15 text-emerald-200 shadow-sm ring-1 ring-emerald-400/35'
                            : 'text-white/75 hover:text-white hover:bg-white/5'">
                        my.handbook
                    </button>
                </div>
            </div>

            <!-- my.fit -->
            <div id="panel-fit" v-show="view === 'fit'" role="tabpanel" aria-labelledby="tab-fit" class="mt-8 space-y-8">
                <article v-for="s in fitSections" :key="s.id"
                    class="rounded-xl border border-white/10 bg-[#141414] px-4 py-5 md:px-6 md:py-6">
                    <h2 class="text-lg md:text-xl font-semibold text-white mb-2">{{ s.title }}</h2>
                    <p class="text-[14px] text-white/75 leading-relaxed">{{ s.lead }}</p>
                    <ul class="mt-3 list-disc list-inside text-[14px] text-white/80 leading-7 space-y-1.5">
                        <li v-for="(b, i) in s.bullets" :key="i">{{ b }}</li>
                    </ul>
                </article>
            </div>

            <!-- my.handbook -->
            <div id="panel-handbook" v-show="view === 'handbook'" role="tabpanel" aria-labelledby="tab-handbook"
                class="mt-8 space-y-3">
                <p class="text-sm text-white/65 mb-4 max-w-3xl leading-relaxed">
                    Full text exports from my Crystal Personality Handbook and ISTP cognitive guide (PDFs). Formatting
                    follows the source files; open a section to read.
                </p>

                <details v-for="ch in crystalChapters" :key="ch.id" class="handbook-details">
                    <summary>{{ ch.title }}</summary>
                    <div class="handbook-body">{{ ch.body }}</div>
                </details>

                <h2 class="text-lg font-semibold text-white pt-6 pb-2">ISTP — cognitive guide (full export)</h2>

                <details v-for="ch in istpChunks" :key="ch.id" class="handbook-details">
                    <summary>{{ ch.title }}</summary>
                    <div class="handbook-body">{{ ch.body }}</div>
                </details>

                <p class="text-[12px] text-white/45 pt-6 max-w-3xl leading-relaxed border-t border-white/10 mt-6">
                    Content synthesized from my personal Crystal handbook (Crystal Knows) and an ISTP cognitive typing
                    guide. Frameworks and assessments belong to their respective publishers; this page is for context
                    only.
                </p>
            </div>
        </section>
    </EditorScaffold>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import EditorScaffold from '@/components/EditorScaffold.vue'
import { fitSections } from '@/data/personalityFit'
import { parseCrystalHandbook, parseIstpHandbook } from '@/lib/personalityHandbook'

type InnerView = 'fit' | 'handbook'

const route = useRoute()
const router = useRouter()

const crystalChapters = computed(() => parseCrystalHandbook())
const istpChunks = computed(() => parseIstpHandbook())

const view = ref<InnerView>('fit')

function isInnerView(v: unknown): v is InnerView {
    return v === 'fit' || v === 'handbook'
}

function setView(v: InnerView) {
    view.value = v
    void router.replace({ path: '/personality', query: { view: v } })
}

watch(
    () => route.query.view,
    (q) => {
        if (isInnerView(q)) view.value = q
        else view.value = 'fit'
    },
    { immediate: true }
)

onMounted(() => {
    if (route.path === '/personality' && !isInnerView(route.query.view)) {
        void router.replace({ path: '/personality', query: { view: 'fit' } })
    }
})
</script>

<style scoped>
.handbook-details {
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #141414;
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
}

.handbook-details[open] {
    border-color: rgba(16, 185, 129, 0.25);
}

.handbook-details summary {
    cursor: pointer;
    font-weight: 600;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.92);
    list-style-position: outside;
}

.handbook-details summary:hover {
    color: rgb(167 243 208);
}

.handbook-body {
    margin-top: 0.75rem;
    font-size: 0.8125rem;
    line-height: 1.65;
    color: rgba(255, 255, 255, 0.78);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}
</style>
