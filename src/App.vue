<script setup lang="ts">
import { computed, onMounted } from 'vue'
import MainLayout from '@/layout/MainLayout.vue'
import AppBootLoader from '@/components/AppBootLoader.vue'
import { useAppBoot } from '@/composables/useAppBoot'

defineOptions({ name: 'App' })

const { isAppReady, bootProgress, runAppBoot } = useAppBoot()

const loaderProgress = computed(() => bootProgress.value)

onMounted(() => {
    void runAppBoot()
})
</script>

<template>
    <AppBootLoader v-if="!isAppReady" :progress="loaderProgress" />
    <MainLayout v-else>
        <RouterView v-slot="{ Component }">
            <KeepAlive include="HomePage">
                <component :is="Component" />
            </KeepAlive>
        </RouterView>
    </MainLayout>
</template>