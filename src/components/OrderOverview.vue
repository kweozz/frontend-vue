<template>
    <div class="p-4">
      <h1 class="text-2xl font-bold">Orders</h1>
      <ul class="mt-4 space-y-2">
        <li v-for="order in orders" :key="order.id" class="p-4 bg-white rounded-lg shadow-md">
          <router-link :to="`/orders/${order.id}`" class="text-blue-600">{{ order.id }} - {{ order.status }}</router-link>
          <button @click="deleteOrder(order.id)" class="ml-4 text-red-600">Delete</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        orders: []
      };
    },
    created() {
      this.fetchOrders();
    },
    methods: {
      fetchOrders() {
        // Fetch orders from API
        this.orders = [
          { id: 1, status: 'Pending' },
          { id: 2, status: 'Shipped' }
        ];
      },
      deleteOrder(id) {
        // Delete order logic
        this.orders = this.orders.filter(order => order.id !== id);
      }
    }
  };
  </script>