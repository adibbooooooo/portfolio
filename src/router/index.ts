import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/pages/HomePage.vue'
import WorkPage from '@/pages/WorkPage.vue'
import PersonalityPage from '@/pages/PersonalityPage.vue'
import ExperiencePage from '@/pages/ExperiencePage.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage, meta: { order: 0 } },
    { path: '/demo', name: 'demo', component: WorkPage, meta: { order: 1 } },
    { path: '/personality', name: 'personality', component: PersonalityPage, meta: { order: 2 } },
    { path: '/experience', name: 'experience', component: ExperiencePage, meta: { order: 3 } },
  ],
})