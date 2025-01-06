import { createRouter, createWebHistory } from 'vue-router';
import OrderOverview from '../components/OrderOverview.vue';
import OrdersDetail from '../components/OrdersDetail.vue';
import AdminLogin from "../components/AdminLogin.vue";
import AdminProfile from "../components/AdminProfile.vue";

const routes = [
  { path: "/", component: AdminLogin }, // Admin Login Page
  { path: '/orders', component: OrderOverview },
  { path: '/orders/:id', component: OrdersDetail },
  { path: '/admin-profile', component: AdminProfile }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;