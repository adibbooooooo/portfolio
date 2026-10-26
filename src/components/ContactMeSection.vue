<template>
    <section>
        <p class="text-[12px] text-[#8F8F8F] mb-3">{{ "<!-- Get in touch -->" }}</p>

        <div class="w-full rounded-2xl border border-white/10 bg-[#141414] p-6 md:p-8">
            <h2 class="normal-font text-white font-extrabold leading-[1.05] text-[34px] md:text-5xl mb-6">
                Let’s Work <span class="text-neutral-400">Together</span>
            </h2>

            <ContactMeForm />
        </div>
    </section>
</template>

<script setup lang="ts">
import ContactMeForm from '@/components/ContactMeForm.vue'
</script>
