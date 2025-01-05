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
          <tr v-for="order in filteredOrders" :key="order._id">
            <td>{{ order._id }}</td>
            <td>{{ order.user.firstName }} {{ order.user.lastName }}</td>
            <td>{{ order.status }}</td>
          </tr>
        </tbody>
      </table>
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
      }
    };
  },
  computed: {
    filteredOrders() {
      return this.orders.filter(order => {
        const matchesOrderNumber = order._id.includes(this.filter.orderNumber);
        const matchesCustomerName = `${order.user.firstName} ${order.user.lastName}`.toLowerCase().includes(this.filter.customerName.toLowerCase());
        const matchesOrderStatus = this.filter.orderStatus ? order.status === this.filter.orderStatus : true;
        return matchesOrderNumber && matchesCustomerName && matchesOrderStatus;
      });
    }
  },
  mounted() {
    axios.get('https://node-api-backend-v1.onrender.com/api/v1/orders/')
      .then(response => {
        console.log(response.data.data.orders);
        this.orders = response.data.data.orders;
      });
  },
  methods: {
    applyFilter() {
      // This method is intentionally left empty as the filtering is handled by the computed property
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