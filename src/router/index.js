import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import store from '@/store';

Vue.use(VueRouter);

const requireAuth = (to, from, next) => {
  if (!store.getters.SESSION_IS_LOGGED) {
    next({ name: 'home' });
  } else {
    next();
  }
};

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
  },
  {
    path: '/quiz/:address',
    name: 'quiz',
    props: true,
    component: () => import(/* webpackChunkName: "quiz" */ '@/views/Quiz.vue'),
  },
  {
    path: '/editor',
    name: 'editor',
    beforeEnter: requireAuth,
    component: () => import(/* webpackChunkName: "editor" */ '@/views/Editor.vue'),
  },
  {
    path: '/summary/:address',
    name: 'summary',
    props: true,
    beforeEnter: requireAuth,
    component: () => import(/* webpackChunkName: "summary" */'@/views/Summary.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
