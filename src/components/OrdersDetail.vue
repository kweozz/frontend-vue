<template>
    <div class="order-detail-container">
      <h1>Order Details</h1>
      <div v-if="order" class="order-detail">
        <p><strong>Order ID:</strong> {{ order.id }}</p>
        <p><strong>Created:</strong> {{ formatDate(order.createdAt) }}</p>
        <p><strong>Customer:</strong> {{ order.customerName }}</p>
        <p><strong>Total Price:</strong> {{ order.totalPrice }}</p>
        <p><strong>Status:</strong></p>
        <select v-model="order.status" @change="updateStatus">
          <option value="Pending">Pending</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <h2>Items</h2>
        <ul>
          <li v-for="item in order.items" :key="item.id">
            {{ item.name }} - {{ item.quantity }} x ${{ item.price }}
          </li>
        </ul>
        <button @click="goBack">Back to Orders</button>
      </div>
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        order: null,
        error: null,
      };
    },
    async created() {
      try {
        const orderId = this.$route.params.id;
        const response = await fetch(`https://example.com/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        if (!response.ok) throw new Error("Failed to fetch order details");
        const data = await response.json();
        this.order = data.order;
      } catch (err) {
        this.error = err.message;
      }
    },
    methods: {
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
      },
      goBack() {
        this.$router.push("/orders");
      },
    },
  };
  </script>
  
  <style scoped>
  .order-detail-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
  
  h1, h2 {
    text-align: center;
  }
  
  .order-detail p {
    margin: 10px 0;
  }
  
  select {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
  }
  
  ul {
    list-style: none;
    padding: 0;
  }
  
  li {
    padding: 10px;
    background: #f9f9f9;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px;
    background: #000;
    color: #fff;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background: #00ff00;
    color: #000;
  }
  
  .error {
    color: red;
    text-align: center;
  }
  </style>