import { createRouter, createWebHistory } from 'vue-router';
import OrderOverview from '../components/OrderOverview.vue';
import OrdersDetail from '../components/OrdersDetail.vue';
import AdminLogin from "../components/AdminLogin.vue";

const routes = [
  { path: "/login", component: AdminLogin }, // Admin Login Page
  { path: '/orders', component: OrderOverview },
  { path: '/orders/:id', component: OrdersDetail }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
