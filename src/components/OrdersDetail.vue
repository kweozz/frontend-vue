<!-- filepath: /c:/Users/ilian/OneDrive/Bureaublad/frontend-vue/src/components/OrdersDetail.vue -->
<template>
    <div class="p-4 bg-gray-100 min-h-screen">
      <h1 class="text-2xl font-bold mb-4">Order Details</h1>
      <div v-if="order" class="p-4 bg-white rounded-lg shadow-md">
        <p><strong>ID:</strong> {{ order.id }}</p>
        <p><strong>Status:</strong> {{ order.status }}</p>
        <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
        <button @click="updateStatus" class="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Update Status</button>
      </div>
      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        order: null,
        error: null
      };
    },
    created() {
      this.fetchOrder();
    },
    methods: {
      async fetchOrder() {
        try {
          const response = await fetch(`https://example.com/api/orders/${this.$route.params.id}`);
          if (!response.ok) throw new Error("Failed to fetch order details");
          const data = await response.json();
          this.order = data.order;
        } catch (err) {
          this.error = err.message;
        }
      },
      formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
      async updateStatus() {
        try {
          const response = await fetch(`https://example.com/api/orders/${this.order.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: this.order.status }),
          });
          if (!response.ok) throw new Error("Failed to update status");
        } catch (err) {
          this.error = err.message;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>