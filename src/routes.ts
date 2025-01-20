import { createRouter, createWebHistory } from 'vue-router';

const page = () => import('./TestPage.vue');

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: page,
    },
  ],
});

export default router;
