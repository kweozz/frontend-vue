<template>
  <div class="order-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">
        <img src="/src/assets/logo-swear.png" alt="Logo">
      </div>
      <h2>Order Overview</h2>
      <h2>ADMIN</h2>
    </nav>

    <!-- Filter Section -->
    <div class="filter-section">
      <input type="text" v-model="filter.orderNumber" placeholder="Filter by Order Number" />
      <input type="text" v-model="filter.customerName" placeholder="Filter by Customer Name" />
      <select v-model="filter.orderStatus">
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
      </select>
      <button @click="applyFilter">Apply Filter</button>
    </div>

    <!-- Order Overview -->
    <div class="order-summary-container">
      <table class="order-table">
        <thead>
          <tr>
            <th>Order Number</th>
            <th>Customer Name</th>
            <th>Order Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in filteredOrders" :key="order._id" @click="goToOrderDetail(order._id)">
            <td>{{ order._id }}</td>
            <td>{{ order.user?.firstName || 'N/A' }} {{ order.user?.lastName || '' }}</td>
            <td>{{ order.status || 'N/A' }}</td> <!-- Handle missing status field -->
          </tr>
        </tbody>
      </table>
      <p v-if="filteredOrders.length === 0">No orders found</p> <!-- Add a message when no orders are found -->
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'OrderOverview',
  data() {
    return {
      orders: [],
      filter: {
        orderNumber: '',
        customerName: '',
        orderStatus: ''
      },
      error: ''
    };
  },
  computed: {
    filteredOrders() {
      const filtered = this.orders.filter(order => {
        const matchesOrderNumber = order._id.includes(this.filter.orderNumber);
        const matchesCustomerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.toLowerCase().includes(this.filter.customerName.toLowerCase());
        const matchesOrderStatus = this.filter.orderStatus ? order.status === this.filter.orderStatus : true;
        return matchesOrderNumber && matchesCustomerName && matchesOrderStatus;
      });
      console.log('Filtered Orders:', filtered); // Log the filtered orders for debugging
      return filtered;
    }
  },
  async created() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('https://node-api-backend-v1.onrender.com/api/v1/orders');
        console.log('Orders response:', response); // Log the entire response for debugging
        if (response.data && response.data.data && response.data.data.orders) {
          this.orders = response.data.data.orders;
          console.log('Orders:', this.orders); // Log the orders for debugging
        } else {
          this.error = 'Failed to retrieve orders';
        }
      } else {
        this.error = 'No token found';
      }
    } catch (err) {
      console.error('Error fetching orders:', err); // Log the error for debugging
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Response data:', err.response.data);
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        this.error = 'Failed to retrieve orders';
      } else if (err.request) {
        // The request was made but no response was received
        console.error('Request data:', err.request);
        this.error = 'No response received from server';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', err.message);
        this.error = 'Error in setting up the request';
      }
    }
  },
  methods: {
    goToOrderDetail(orderId) {
      this.$router.push(`/orders/${orderId}`);
    }
  }
});
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

/* Filter Section */
.filter-section {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.filter-section input,
.filter-section select {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filter-section button {
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.filter-section button:hover {
  background-color: #00ff00;
  color: #000;
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

  .filter-section {
    flex-direction: column;
    gap: 5px;
  }

  .filter-section input,
  .filter-section select,
  .filter-section button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .navbar h2 {
    font-size: 1rem;
  }

  .filter-section input,
  .filter-section select,
  .filter-section button {
    width: 100%;
    margin-bottom: 10px;
  }

  .filter-section {
    flex-direction: column;
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