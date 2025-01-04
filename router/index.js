import { createRouter, createWebHistory } from 'vue-router'; // Added missing imports
import OrderOverview from '../src/components/OrderOverview.vue';
import OrdersDetail from '../src/components/OrdersDetail.vue';


const routes = [
  { path: '/', redirect: '/orders' },
  { path: '/orders', component: OrderOverview },
  { path: '/orders/:id', component: OrdersDetail }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;