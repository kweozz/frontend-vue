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
          <tr v-for="order in orders" :key="order._id">
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
      orders: []
    };
  },
  mounted() {
    axios.get('https://node-api-backend-v1.onrender.com/api/v1/orders/')
      .then(response => {
        console.log(response.data.data.orders);
        this.orders = response.data.data.orders;
      });
  },
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
.navbar h2{
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
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
  font-weight: 400;
}

.order-table th {
  background-color: black;
  color: white;
  text-transform: uppercase;
}

.order-table tr:hover {
  background-color: #00ff00;
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
}
</style>