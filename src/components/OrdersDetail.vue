<!-- filepath: /c:/Users/ilian/OneDrive/Bureaublad/frontend-vue/src/components/OrdersDetail.vue -->
<template>
    <div class="flex flex-col h-screen bg-gray-100">
      <div class="top-bar bg-green-500 text-center py-2 text-black text-xs font-light">
        Top Bar Content
      </div>
      <div class="navbar flex items-center justify-between p-4 bg-white border-b border-gray-300">
        <div class="logo w-1/5">
          <img src="/src/assets/logo-swear.png" alt="Logo" class="w-full">
        </div>
        <h2 class="text-lg font-medium tracking-wider">Order Details</h2>
        <div class="nav-icons flex items-center gap-4">
          <a href="#" class="icon relative text-black text-lg">Icon</a>
          <div class="btn">
            <button class="bg-black text-white py-2 px-4">Button</button>
          </div>
        </div>
      </div>
      <div class="flex-1 p-4 overflow-auto">
        <h1 class="text-2xl font-bold mb-4">Order Details</h1>
        <div v-if="order" class="p-4 bg-white rounded-lg shadow-md">
          <p><strong>ID:</strong> {{ order._id }}</p>
          <p><strong>Status:</strong> {{ order.status }}</p>
          <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
          <table class="min-w-full bg-white">
            <thead>
              <tr>
                <th class="py-2">Product ID</th>
                <th class="py-2">Colors</th>
                <th class="py-2">Fabrics</th>
                <th class="py-2">Initials</th>
                <th class="py-2">Size</th>
                <th class="py-2">Price</th>
                <th class="py-2">Quantity</th>
                <th class="py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.shoeConfig" :key="item.productId">
                <td class="py-2">{{ item.productId }}</td>
                <td class="py-2">{{ item.colors.join(', ') }}</td>
                <td class="py-2">{{ item.fabrics.join(', ') }}</td>
                <td class="py-2">{{ item.initials }}</td>
                <td class="py-2">{{ item.size }}</td>
                <td class="py-2">{{ item.price }}</td>
                <td class="py-2">{{ item.quantity }}</td>
                <td class="py-2">{{ item.price * item.quantity }}</td>
              </tr>
            </tbody>
          </table>
          <button @click="updateStatus" class="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">Update Status</button>
        </div>
        <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
      </div>
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
          const response = await fetch('/api/v1/orders');
          if (!response.ok) throw new Error(`Failed to fetch orders: ${response.statusText}`);
          const result = await response.json();
          console.log(result); // Log the response to see its structure
          console.log(this.$route.params.id); // Log the route parameter ID
          // For testing, log all orders
          console.log(result.data.orders);
          // Adjust this line based on the actual structure of the response
          this.order = result.data.orders.find(order => order._id === parseInt(this.$route.params.id));
          console.log(this.order); // Log the found order
          if (!this.order) throw new Error('Order not found');
        } catch (err) {
          console.error('Error fetching order details:', err);
          this.error = err.message;
        }
      },
      formatDate(dateString) {
        const options = { year: "numeric", month: "short", day: "numeric" };
        return new Date(dateString).toLocaleDateString(undefined, options);
      },
      async updateStatus() {
        try {
          const response = await fetch(`/api/v1/orders/${this.order._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ status: this.order.status }),
          });
          if (!response.ok) throw new Error(`Failed to update status: ${response.statusText}`);
        } catch (err) {
          console.error('Error updating status:', err);
          this.error = err.message;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>