<template>
    <button 
        :class="[
            'select-text w-full rounded-xs px-4 py-3 text-[14px] font-semibold transition-colors duration-150 cursor-pointer',
            type === 'secondary' ? 'border border-white/50 bg-transparent text-white hover:bg-white/10' : 'border border-white/0 bg-white text-black hover:bg-neutral-200'
        ]"
    >
        <slot />
    </button>
</template>

<script setup lang="ts">
defineProps({
    type: {
        type: String,
        default: 'primary'
    },
})
</script>