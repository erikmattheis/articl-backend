import { createRouter, createWebHistory } from 'vue-router';

import HomePage from '@/pages/index.vue';
import CategoryPage from '@/pages/d/index.vue';
import RegisterPage from '@/pages/register.vue';
import VerifyEmailPage from '@/pages/verify-email.vue';
import LoginPage from '@/pages/login.vue';
import ForgotPassPage from '@/pages/forgot-pass.vue';
import ResetPasswordPage from '@/pages/reset-password.vue';
import NotFound from '@/pages/NotFound.vue';
import UserPage from '@/pages/users/index.vue';
import CreateCategoryPage from '@/pages/categories/index.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: 'HomePage',
      path: '/',
      component: HomePage,
    },
    {
      name: 'CategoryPage',
      path: '/d/:slug',
      component: CategoryPage,
    },
    {
      name: 'register',
      path: '/register',
      component: RegisterPage,
    },
    {
      name: 'verify-email',
      path: '/verify-email',
      component: VerifyEmailPage,
    },
    {
      name: 'login',
      path: '/login',
      component: LoginPage,
    },
    {
      name: 'send-verification-email',
      path: '/send-verification-email',
      component: ResetPasswordPage,
    },
    {
      name: 'forgot-pass',
      path: '/forgot-pass',
      component: ForgotPassPage,
    },
    {
      name: 'reset-password',
      path: '/reset-password',
      component: ResetPasswordPage,
    },
    {
      name: 'users',
      path: '/users',
      component: UserPage,
    }, {
      name: 'createCategoryPage',
      path: '/categories/:slug?',
      component: CreateCategoryPage,
    },

    { path: '/:notFound(.*)', component: NotFound },
  ],
});

export default router;
