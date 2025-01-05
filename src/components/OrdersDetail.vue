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
        <p><strong>Shoe Name:</strong> {{ order.shoeName }}</p>
        <p><strong>User:</strong> {{ order.user?.firstName || 'N/A' }} {{ order.user?.lastName || '' }}</p>
        <p><strong>Phone:</strong> {{ order.user?.phone || 'N/A' }}</p>
        <p><strong>Email:</strong> {{ order.user?.email || 'N/A' }}</p>
        <p><strong>Address:</strong> {{ order.user?.address || 'N/A' }}</p>
        <table class="order-table">
          <thead>
            <tr>
              <th>Colors</th>
              <th>Fabrics</th>
              <th>Initials</th>
              <th>Size</th>
              <th>Base Price</th>
              <th>Customization Fee</th>
              <th>Shipping Cost</th>
              <th>Total Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{{ order.shoeConfig?.colors?.join(', ') || 'N/A' }}</td>
              <td>{{ order.shoeConfig?.fabrics?.join(', ') || 'N/A' }}</td>
              <td>{{ order.shoeConfig?.initials || 'N/A' }}</td>
              <td>{{ order.shoeConfig?.size || 'N/A' }}</td>
              <td>{{ order.price?.basePrice || 'N/A' }}</td>
              <td>{{ order.price?.customizationFee || 'N/A' }}</td>
              <td>{{ order.price?.shippingCost || 'N/A' }}</td>
              <td>{{ order.price?.totalPrice || 'N/A' }}</td>
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
import axios from 'axios';

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
        const token = localStorage.getItem('token');
        if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get(`https://node-api-backend-v1.onrender.com/api/v1/orders/${this.$route.params.id}`);
          console.log('Order response:', response); // Log the entire response for debugging
          if (response.data) {
            this.order = response.data;
            console.log('Order:', this.order); // Log the order for debugging
          } else {
            this.error = 'Failed to retrieve order';
          }
        } else {
          this.error = 'No token found';
        }
      } catch (err) {
        console.error('Error fetching order details:', err); // Log the error for debugging
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          this.error = 'Failed to retrieve order';
        } else if (err.request) {
          console.error('Request data:', err.request);
          this.error = 'No response received from server';
        } else {
          console.error('Error message:', err.message);
          this.error = 'Error in setting up the request';
        }
      }
    },
    formatDate(dateString) {
      const options = { year: "numeric", month: "short", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    
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