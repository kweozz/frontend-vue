<!-- filepath: /c:/Users/ilian/OneDrive/Bureaublad/frontend-vue/src/components/OrdersDetail.vue -->
<template>
  <div class="order-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">
        <img src="/src/assets/logo-swear.png" alt="Logo">
      </div>
      <h2>Order Details</h2>
      <h2>ADMIN</h2>
    </nav>

    <!-- Order Details -->
    <div class="order-summary-container">
      <h1 class="text-2xl font-bold mb-4">Order Details</h1>
      <div v-if="order" class="p-4 bg-white rounded-lg shadow-md">
        <p><strong>ID:</strong> {{ order._id }}</p>
        <p><strong>Status:</strong> {{ order.status }}</p>
        <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
        <table class="order-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Colors</th>
              <th>Fabrics</th>
              <th>Initials</th>
              <th>Size</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in order.shoeConfig" :key="item.productId">
              <td>{{ item.productId }}</td>
              <td>{{ item.colors.join(', ') }}</td>
              <td>{{ item.fabrics.join(', ') }}</td>
              <td>{{ item.initials }}</td>
              <td>{{ item.size }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>{{ item.price * item.quantity }}</td>
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
        const response = await fetch(`/api/v1/orders/${this.$route.params.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (!response.ok) throw new Error(`Failed to fetch order: ${response.statusText}`);
        const result = await response.json();
        this.order = result.data.order;
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
body {
  display: flex;
  flex-direction: column;
  height: 100vh;
  margin: 0;
  overflow: hidden;
  font-family: Helvetica, sans-serif;
}

/* Navbar */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: white;
  border-bottom: 1px solid #ddd;
}
.navbar h2 {
  font-weight: 400;
}

h2 {
  font-size: 1.5em;
  margin: 0;
  letter-spacing: 0.1em;
}

.logo img {
  width: 100%;
}

.logo {
  width: 10%;
}

/* Order Page */
.order-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
}

.order-summary-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.order-table {
  width: 100%;
  border-collapse: collapse;
}

.order-table th,
.order-table td {
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-weight: 400;
  font-size: 1em;
  color: #5f5f5f;
  padding: 24px;
}

.order-table th {
  background-color: black;
  color: white;
  text-transform: uppercase;
}

.order-table td:hover {
  color: black;
  font-weight: 600;
  transition: cubic-bezier(0.165, 0.84, 0.44, 1);
}

.order-table tr:hover {
  background-color: #ddd;
}

/* Responsive Styling */
@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .logo {
    width: 25%;
  }

  .order-page {
    padding: 10px;
  }

  .order-table th, .order-table td {
    padding: 5px;
  }
}

@media (max-width: 480px) {
  .navbar h2 {
    font-size: 1rem;
  }

  .order-page {
    padding: 5px;
  }

  .order-table th, .order-table td {
    padding: 2px;
  }

  .order-table, .order-table thead, .order-table tbody, .order-table th, .order-table td, .order-table tr {
    display: block;
  }

  .order-table tr {
    margin-bottom: 15px;
  }

  .order-table td {
    text-align: right;
    padding-left: 50%;
    position: relative;
  }

  .order-table td::before {
    content: attr(data-label);
    position: absolute;
    left: 0;
    width: 50%;
    padding-left: 15px;
    font-weight: bold;
    text-align: left;
  }
}
</style>