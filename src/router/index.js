import Vue from 'vue';
import VueRouter from 'vue-router';
// import fp from '@/mixins/fp';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const publicPages = ['/', '/complete'];
//   // eslint-disable-next-line
//   const privatePages = ['/dashboard'];
//   const authRequired = !publicPages.includes(to.path);
//   const notfound = !privatePages.includes(to.path);
//   // const loggedIn = localStorage.getItem('user');
//   const loggedIn = true;
//   // fp.methods.fpGenerator();
//   // trying to access a restricted page + not logged in
//   // redirect to login page
//   if (notfound && authRequired) {
//     // console.clear();
//     next('/404');
//   }
//   if ((to.path === '/login' || to.path === '/' || to.path === '') && loggedIn) {
//     next('/');
//   }
//   if (authRequired && !loggedIn) {
//     next('/');
//   } else {
//     next();
//   }
// });

export default router;
