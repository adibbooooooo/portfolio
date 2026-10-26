import { createRouter, createWebHistory } from 'vue-router'

import { trackPageView } from '@/lib/analytics'
import HomePage from '@/pages/HomePage.vue'
import WorkPage from '@/pages/WorkPage.vue'
import PersonalityPage from '@/pages/PersonalityPage.vue'
import ExperiencePage from '@/pages/ExperiencePage.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage, meta: { order: 0 } },
    { path: '/personality', name: 'personality', component: PersonalityPage, meta: { order: 1 } },
    { path: '/work', name: 'work', component: WorkPage, meta: { order: 2 } },
    {
        path: '/demo',
        redirect: (to) => ({
            path: '/work',
            query: {
                ...to.query,
                section: typeof to.query.section === 'string' ? to.query.section : 'demos',
            },
        }),
    },
    { path: '/experience', name: 'experience', component: ExperiencePage, meta: { order: 3 } },
  ],
})

router.afterEach((to) => {
    trackPageView(to.fullPath)
})

export default router