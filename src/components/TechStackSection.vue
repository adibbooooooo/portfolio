<template>
    <div class="space-y-8">
        <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[40px] md:text-6xl">
            Tech <span class="text-neutral-400">Stack</span>
        </h2>

        <!-- one-line caption: explains pills + % once -->
        <p class="mt-1 text-[12.5px] text-white/60">
            <span class="font-mono">Level</span> (Core / Strong / Learning) ·
            <span class="font-mono">Recency</span> (Daily / Weekly / Rare) ·
            <span class="font-mono">% = confidence</span>
        </p>

        <div v-for="g in groups" :key="g">
            <h3 class="text-[13px] text-white/70 mb-3 mt-6 font-mono">
                {{ '<!-- ' + g + ' -->' }}
            </h3>

            <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <RouterLink v-for="s in STACK.filter(x => x.group === g)" :key="s.k" :to="tileHref(s.k)"
                    class="group stack-tile focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60">
                    <!-- low-opacity logo bg -->
                    <span class="stack-bg" aria-hidden="true" :style="bgStyle(s.k)"></span>
                    <!-- readability overlay -->
                    <span class="stack-overlay" aria-hidden="true"></span>

                    <div class="relative z-10 p-4 md:p-5">
                        <div class="flex items-center justify-between">
                            <h4 class="text-white normal-font text-[15px] font-medium">{{ s.label }}</h4>

                            <!-- confidence % badge -->
                            <span class="conf-badge" aria-label="Confidence">{{ s.confidence }}%</span>
                        </div>

                        <!-- logo (foreground) -->
                        <div
                            class="mt-4 h-[56px] w-[56px] rounded-lg grid place-items-center bg-white backdrop-blur transition-transform duration-500 group-hover:rotate-[2deg] group-hover:scale-[1.08]">
                            <img :src="tileIcon(s.k)" :alt="s.label" class="h-8 w-8 object-contain" draggable="false" />
                        </div>

                        <!-- simple meta pills (no tooltips) -->
                        <div class="mt-4 font-mono text-[12px] text-white/70 flex items-center gap-2">
                            <span class="pill">{{ s.level }}</span>
                            <span class="text-white/30">•</span>
                            <span class="pill">{{ s.recency }}</span>
                        </div>

                        <!-- confidence bar -->
                        <div class="mt-3 h-[3px] bg-white/10 rounded overflow-hidden" aria-hidden="true">
                            <div class="h-full bg-emerald-400 transition-all duration-500 group-hover:bg-emerald-300"
                                :style="{ width: (s.confidence ?? 80) + '%' }"></div>
                        </div>

                        <!-- short description -->
                        <div v-if="s.desc" class="mt-3 text-[12px] text-white/80">
                            {{ s.desc }}
                        </div>

                        <!-- hover CTA hint -->
                        <div v-if="!s?.hideDemo"
                            class="mt-3 font-mono text-[12px] text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            Open demo <i class="pi pi-arrow-up-right translate-y-[2px]" style="font-size: 12px;"></i>
                        </div>
                    </div>
                </RouterLink>
            </div>
        </div>

        <div class="stack-tile flex items-center justify-center py-8 text-white/70 text-[14px] font-mono cursor-default cursor-pointer"
            style="border-style: dashed;">
            I've also worked with dozens of other tools, frameworks and APIs + many more!
        </div>

        <div class="
                mt-10 rounded-[12px] border border-white/10 bg-gradient-to-b from-white/5 to-transparent 
                px-5 py-5 relative overflow-hidden group transition-all duration-300
                hover:border-emerald-400/30 hover:from-emerald-500/[0.06]
                flex flex-wrap items-center gap-4
            ">
            <p class="text-[13px] text-white/80 leading-relaxed relative z-10 md:flex-1">
                Can’t see the tech you’re looking for?
                <span class="text-emerald-400 font-semibold">I learn fast.</span>
                Give me a week and you’ll have a brand-new dev on it.
            </p>

            <a href="https://cal.com/adibomar/meeting" target="_blank" rel="noopener noreferrer"
                class="inline-flex items-center gap-2 font-mono text-[13px] text-white/90 border border-white/20 rounded px-3.5 py-2 hover:border-emerald-400/40 hover:bg-emerald-400/[0.07] transition-all duration-300 group/btn shrink-0">
                <span>Contact me</span>
                <i
                    class="pi pi-arrow-up-right text-[11px] text-emerald-400 transition-transform duration-300 group-hover/btn:translate-x-[2px] group-hover/btn:-translate-y-[2px]" />
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
const STACK = [
    // Frontend
    { k: 'vue', label: 'Vue.js', group: 'Frontend', level: 'Core', recency: 'Daily', confidence: 90, desc: 'Vue 2 & Vue 3 — web apps and dashboards' },
    { k: 'vite', label: 'Vite', group: 'Frontend', level: 'Core', recency: 'Daily', confidence: 86, desc: 'Dev server, build tooling, DX' },
    { k: 'tailwind', label: 'Tailwind', group: 'Frontend', level: 'Core', recency: 'Daily', confidence: 92, desc: 'Design system & web apps' },
    { k: 'threejs', label: 'Three.js', group: 'Frontend', level: 'Strong', recency: 'Weekly', confidence: 70, desc: '3D modelling & scenes in websites' },
    { k: 'angular', label: 'Angular', group: 'Frontend', level: 'Strong', recency: 'Rare', confidence: 85, desc: 'Web apps and dashboard', hideDemo: true },
    { k: 'bootstrap', label: 'Bootstrap', group: 'Frontend', level: 'Strong', recency: 'Rare', confidence: 82, desc: 'Legacy layouts and admin themes', hideDemo: true },
    { k: 'konva', label: 'Konva.js', group: 'Frontend', level: 'Learning', recency: 'Rare', confidence: 58, desc: 'Canvas tiles / game-style maps' },

    // Backend
    { k: 'laravel', label: 'Laravel', group: 'Backend', level: 'Core', recency: 'Daily', confidence: 96, desc: 'APIs, multi-tenant, Stripe, queues' },
    { k: 'codeigniter', label: 'CodeIgniter', group: 'Backend', level: 'Strong', recency: 'Weekly', confidence: 82, desc: 'Maintain & extend legacy apps' },
    { k: 'nodejs', label: 'Node.js', group: 'Backend', level: 'Strong', recency: 'Weekly', confidence: 80, desc: 'Bots • workers • microservices' },
    { k: 'mysql', label: 'MySQL', group: 'Backend', level: 'Strong', recency: 'Daily', confidence: 88, desc: 'Schema design • indexing • tuning' },
    { k: 'wordpress', label: 'WordPress', group: 'Backend', level: 'Strong', recency: 'Rare', confidence: 78, desc: 'Custom themes & plugins', hideDemo: true  },

    // Tools / Platforms
    { k: 'aws', label: 'AWS', group: 'Tools', level: 'Strong', recency: 'Weekly', confidence: 78, desc: 'Deploy to EC2/S3 • Secret manager', hideDemo: true },
    { k: 'stripe', label: 'Stripe', group: 'Tools', level: 'Core', recency: 'Weekly', confidence: 90, desc: 'Payments • Connect • payouts', hideDemo: true },
    { k: 'figma', label: 'Figma', group: 'Tools', level: 'Strong', recency: 'Weekly', confidence: 85, desc: 'Design + prototypes + handoff', hideDemo: true },
    { k: 'lottie', label: 'Lottie', group: 'Tools', level: 'Strong', recency: 'Weekly', confidence: 76, desc: 'Motion graphics integration' },
    { k: 'burp', label: 'Burp', group: 'Tools', level: 'Learning', recency: 'Rare', confidence: 55, desc: 'Security testing', hideDemo: true },
    { k: 'owasp zap', label: 'OWASP ZAP', group: 'Tools', level: 'Learning', recency: 'Rare', confidence: 55, desc: 'Security scanning', hideDemo: true },
];

const groups = ['Frontend', 'Backend', 'Tools'];
const tileHref = (k: string) => `/demo?tool=${encodeURIComponent(k)}`;
const tileIcon = (k: string) => `/stack/${k}.png`;

/** Low-opacity logo bg per tile */
const bgStyle = (k: string) =>
    `background-image:url(${tileIcon(k)});
    background-size: 70%;
    background-repeat: no-repeat;
    background-position: right -14px bottom -10px;`;
</script>

<style scoped>
/* card chrome */
.stack-tile {
    position: relative;
    overflow: hidden;
    border-radius: 10px;
    background: #141414;
    border: 1px solid rgba(255, 255, 255, .10);
    transition: border-color .2s ease, background-color .2s ease;
}

.stack-tile:hover {
    border-color: rgba(255, 255, 255, .18);
    background: rgba(255, 255, 255, .06);
}

/* % badge */
.conf-badge {
    font-family: ui-monospace, "IBM Plex Mono", monospace;
    font-size: 14px;
    color: #e5e7eb;
    padding: 2px 6px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .2);
    transition: background-color .2s ease, border-color .2s ease;
}

.group:hover .conf-badge {
    background: rgba(255, 255, 255, .10);
    border-color: rgba(255, 255, 255, .22);
}

/* low-opacity logo bg */
.stack-bg {
    position: absolute;
    inset: 0;
    opacity: .08;
    transition: opacity .25s ease;
    filter: grayscale(1);
}

.group:hover .stack-bg {
    opacity: .18;
}

/* overlay for readability */
.stack-overlay {
    position: absolute;
    inset: 0;
    background: transparent;
    transition: background-color .25s ease;
}

.group:hover .stack-overlay {
    background: rgba(0, 0, 0, .20);
}

/* simple pill */
.pill {
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, .15);
    background: rgba(255, 255, 255, .05);
    color: #e5e7eb;
}
</style>