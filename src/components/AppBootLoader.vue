<template>
    <div class="boot-loader" role="status" aria-live="polite" aria-busy="true">
        <p class="boot-loader__site">adibomar.com</p>
        <p class="boot-loader__status">Loading</p>
        <div class="boot-loader__track" aria-hidden="true">
            <div class="boot-loader__fill" :style="{ transform: `scaleX(${progress})` }" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    progress: number
}>()
</script>

<style scoped>
.boot-loader {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    background: #181818;
    color: #b1b1b1;
    font-family: 'IBM Plex Mono', monospace;
}

.boot-loader__site {
    margin: 0;
    font-size: 13px;
    letter-spacing: 0.04em;
    color: #fafafa;
}

.boot-loader__status {
    margin: 0;
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 0.14em;
    color: rgba(255, 255, 255, 0.45);
}

.boot-loader__track {
    width: min(220px, 72vw);
    height: 2px;
    margin-top: 0.35rem;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
}

.boot-loader__fill {
    height: 100%;
    width: 100%;
    transform-origin: left center;
    border-radius: inherit;
    background: #10b981;
    transition: transform 0.18s ease-out;
}
</style>
