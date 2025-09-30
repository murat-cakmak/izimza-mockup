import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Login from '@/views/Login.vue';
import Dashboard from '@/views/Dashboard.vue';
import DocumentSign from '@/views/DocumentSign.vue';

const routes: Array<RouteRecordRaw> = [
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/login', 
    name: 'Login', 
    component: Login,
    meta: { requiresGuest: true }
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  { 
    path: '/sign', 
    name: 'DocumentSign', 
    component: DocumentSign,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (!authStore.isAuthenticated && !authStore.user) {
    authStore.initializeAuth();
  }
  
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  
  if (requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (requiresGuest && authStore.isAuthenticated) {
    next('/dashboard');
  } else {
    next();
  }
});

export default router;
