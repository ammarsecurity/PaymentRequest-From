import { createRouter, createWebHistory } from 'vue-router';
import { axiosInstance } from '@/api/axiosInstance';
import i18n from '@/locales/i18n';

/* ----------------------- Routes ----------------------- */
import TestView from '@/views/TestView.vue';
import LoginView from '@/views/LoginView.vue';
import NotFoundView from '@/views/NotFoundView.vue';

// Dashboard

import DashboardUsersView from '@/views/dashboard/DashboardUsersView.vue';
import DashboardRequestView from '@/views/dashboard/DashboardRequestView.vue';
import DashboardSubUserRequestView from '@/views/dashboard/DashboardSubUserRequestView.vue';
import DashboardHome from '@/views/dashboard/DashboardHome.vue';
import DashboardRequestReportsView from '@/views/dashboard/DashboardRequestReportsView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: {
        name: 'login',
      },
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },

    // Dashboard
    {
      path: '/dashboard',
      redirect: {
        name: 'dashboard-users',
      },
    },

    {
      path: '/dashboard/users',
      name: 'dashboard-users',
      component: DashboardUsersView,
    },

    {
      path: '/dashboard/home',
      name: 'dashboard-home',
      component: DashboardHome,
    },
    {
      path: '/dashboard/requestreports',
      name: 'dashboard-requestreports',
      component: DashboardRequestReportsView,
    },
    {
      path: '/dashboard/supusersrequest',
      name: 'dashboard-supusersrequest',
      component: DashboardSubUserRequestView,
    },

    {
      path: '/dashboard/request',
      name: 'dashboard-request',
      component: DashboardRequestView,
    },
    {
      path: '/test',
      name: 'test',
      component: TestView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: NotFoundView,
    },
  ],
});

router.beforeEach((to, from, next) => {
  // axiosInstance
  //   .get('Settings')
  //   .then(({ data }) => {
  //     window.document.title =
  //       to.meta && to.meta.title ? to.meta.title : data.data.siteName;
  //   })
  //   .catch((error) => {});
  let token = localStorage.getItem('token');
  if (token && to.name == 'login') {
    next({ name: 'dashboard-request' });
  }
  if (!token && to.name.includes('dashboard')) {
    next({ name: 'login' });
  }
  if (to.name.includes('dashboard')) {
    i18n.global.locale = 'ar';
  }
  return next();
});
export default router;
