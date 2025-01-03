import { createRouter, createWebHistory } from 'vue-router';
import OrderOverview from '../src/components/OrderOverview.vue';
import OrderDetail from '../src/components/OrdersDetail.vue';

const routes = [
  { path: '/', redirect: '/orders' },
  { path: '/orders', component: OrderOverview },
  { path: '/orders/:id', component: OrderDetail }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;