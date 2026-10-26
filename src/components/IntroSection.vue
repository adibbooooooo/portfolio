<template>
    <h1 class="text-[50px] md:text-[82px] font-extrabold text-white normal-font">
        Versatile
    </h1>
    <h2 class="text-[30px] md:text-[62px] font-extrabold text-neutral-400 normal-font -translate-y-5">
        Software Engineer
    </h2>

    <p class="mt-6 max-w-3xl text-[12px] leading-6 text-[#8F8F8F]">
        {{ "<!-- My motto -->" }}
    </p>

    <p class="mt-1 leading-6 text-primary whitespace-pre-wrap min-h-[48px]">
        <span ref="typedEl"></span><span class="typing-caret" v-show="caretVisible">|</span>
    </p>

    <div class="hidden md:block h-[200px]"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useIntroSession } from '@/composables/useIntroSession'

const typedEl = ref<HTMLSpanElement | null>(null)
const caretVisible = ref(true)
const { introHeroComplete, markIntroHeroComplete } = useIntroSession()

const cps = 50

const fullHtml = `Passionate about <span class="mark" style="--d:0s">delivering quality</span> and <span class="mark" style="--d:0s">guiding ideas</span> from concept to completion. I believe great work starts with <span class="mark" style="--d:.12s">ownership</span>, <span class="mark" style="--d:.24s">clarity</span> and <span class="mark" style="--d:.36s">purpose</span>`

function showFinalMotto() {
    if (!typedEl.value) return
    typedEl.value.innerHTML = fullHtml
    caretVisible.value = false
    markIntroHeroComplete()
}

onMounted(() => {
    if (!typedEl.value) return

    if (introHeroComplete.value) {
        showFinalMotto()
        return
    }

    typedEl.value.innerHTML = ''

    let i = 0
    let last = performance.now()
    const msPerChar = 1000 / cps

    const step = (t: number) => {
        if (!typedEl.value) return

        const delta = t - last
        const add = Math.floor(delta / msPerChar)

        if (add > 0) {
            i = Math.min(fullHtml.length, i + add)
            typedEl.value.innerHTML = fullHtml.slice(0, i)
            last += add * msPerChar
        }

        if (i < fullHtml.length) {
            requestAnimationFrame(step)
        } else {
            showFinalMotto()
        }
    }

    setTimeout(() => requestAnimationFrame(step), 250)
})
</script>