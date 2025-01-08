<template>
  <div class="order-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">
        <img src="../assets/logo-swear.png" alt="Logo">
      </div>
      <h2>Order Overview</h2>
      <i class="fas fa-user-circle profile-icon" @click="goToAdminProfile"></i>
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
      <select v-model="filter.dateRange">
        <option value="">All Dates</option>
        <option value="today">Today</option>
        <option value="lastWeek">Last Week</option>
        <option value="lastMonth">Last Month</option>
      </select>
      <button @click="toggleSelectAllOrders">{{ selectedOrders.length ? 'Deselect All' : 'Select All' }}</button>
      <button v-if="selectedOrders.length" @click="confirmDeleteSelected">Delete Selected</button>
    </div>

    <!-- Live Order Count -->
    <div class="live-order-count">
      <h3>Live Order Count: {{ orders.length }}</h3>
    </div>

    <!-- Order Overview -->
    <div class="order-summary-container">
      <div class="table-container">
        <table class="order-table">
          <thead>
            <tr>
              <th>Select</th>
              <th>Order Number</th>
              <th>Customer Name</th>
              <th>Order Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in sortedFilteredOrders" :key="order._id">
              <td><input type="checkbox" v-model="selectedOrders" :value="order._id" /></td>
              <td>{{ order._id }}</td>
              <td>{{ order.user?.firstName || 'N/A' }} {{ order.user?.lastName || '' }}</td>
              <td>{{ order.status || 'N/A' }}</td>
              <td>{{ formatDate(order.date) }}</td>
              <td>
                <i class="fas fa-edit edit-icon" @click="goToOrderDetail(order._id)"></i>
                <i class="fas fa-trash delete-icon" @click="confirmDelete(order._id)"></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p v-if="sortedFilteredOrders.length === 0">No orders found</p>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <div class="modal-buttons" v-if="action !== 'success'">
          <button @click="executeDelete" class="confirm-button">Yes</button>
          <button @click="cancelDelete" class="cancel-button">No</button>
        </div>
        <div v-else>
          <button @click="closeModal" class="confirm-button">OK</button>
        </div>
      </div>
    </div>

    <!-- Error Notification Modal -->
    <div v-if="showErrorModal" class="modal">
      <div class="modal-content">
        <p>{{ errorMessage }}</p>
        <button @click="closeErrorModal" class="confirm-button">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';
import { io } from 'socket.io-client';

export default defineComponent({
  name: 'OrderOverview',
  data() {
    return {
      orders: [],
      filter: {
        orderNumber: '',
        customerName: '',
        orderStatus: '',
        dateRange: ''
      },
      selectedOrders: [],
      error: '',
      showModal: false,
      showErrorModal: false,
      modalMessage: '',
      errorMessage: '',
      orderIdToDelete: null,
      action: null,
      socket: null
    };
  },
  computed: {
    filteredOrders() {
      const filtered = this.orders.filter(order => {
        const matchesOrderNumber = order._id.includes(this.filter.orderNumber);
        const matchesCustomerName = `${order.user?.firstName || ''} ${order.user?.lastName || ''}`.toLowerCase().includes(this.filter.customerName.toLowerCase());
        const matchesOrderStatus = this.filter.orderStatus ? order.status === this.filter.orderStatus : true;
        const matchesDateRange = this.filter.dateRange ? this.filterByDateRange(order.date) : true;
        return matchesOrderNumber && matchesCustomerName && matchesOrderStatus && matchesDateRange;
      });
      console.log('Filtered Orders:', filtered); // Log the filtered orders for debugging
      return filtered;
    },
    sortedFilteredOrders() {
      return this.filteredOrders.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
  },
  async created() {
    this.initializeSocket();
    await this.fetchOrders();
  },
  methods: {
    initializeSocket() {
      this.socket = io('wss://node-api-backend-v1.onrender.com');

      this.socket.on('connect', () => {
        console.log('Connected to server');
      });

      this.socket.on('newOrder', (order) => {
        console.log('New order:', order);
        this.orders.unshift(order);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from server');
      });

      this.socket.on('error', (error) => {
        console.error('Socket error:', error);
      });
    },
    async fetchOrders() {
      const token = localStorage.getItem('token');
      if (!token) {
        this.$router.push('/'); // Redirect to login page if no token is found
        return;
      }
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('https://node-api-backend-v1.onrender.com/api/v1/orders');
        console.log('Orders response:', response); // Log the entire response for debugging
        if (response.data && response.data.data && response.data.data.orders) {
          this.orders = response.data.data.orders; // Access the orders data
          console.log('Orders:', this.orders); // Log the orders for debugging
        } else {
          this.errorMessage = 'Failed to retrieve orders';
          this.showErrorModal = true;
        }
      } catch (err) {
        console.error('Error fetching orders:', err); // Log the error for debugging
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          this.errorMessage = 'Failed to retrieve orders';
        } else if (err.request) {
          console.error('Request data:', err.request);
          this.errorMessage = 'No response received from server';
        } else {
          console.error('Error message:', err.message);
          this.errorMessage = 'Error in setting up the request';
        }
        this.showErrorModal = true;
      }
    },
    goToOrderDetail(orderId) {
      this.$router.push(`/orders/${orderId}`);
    },
    goToAdminProfile() {
      this.$router.push('/admin-profile');
    },
    confirmDelete(orderId) {
      this.modalMessage = 'Are you sure you want to delete this order?';
      this.orderIdToDelete = orderId;
      this.action = 'delete';
      this.showModal = true;
    },
    confirmDeleteSelected() {
      this.modalMessage = 'Are you sure you want to delete the selected orders?';
      this.orderIdToDelete = null;
      this.action = 'deleteSelected';
      this.showModal = true;
    },
    async executeDelete() {
      this.showModal = false;
      if (this.action === 'delete') {
        await this.deleteOrder(this.orderIdToDelete);
      } else if (this.action === 'deleteSelected') {
        await this.deleteSelectedOrders();
      }
    },
    async deleteOrder(orderId) {
      try {
        const response = await axios.delete(`https://node-api-backend-v1.onrender.com/api/v1/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status !== 200) throw new Error(`Failed to delete order: ${response.statusText}`);
        this.modalMessage = 'Order deleted successfully';
        this.action = 'success';
        this.showModal = true;
        this.orders = this.orders.filter(order => order._id !== orderId);
      } catch (err) {
        console.error('Error deleting order:', err);
        this.errorMessage = err.message;
        this.showErrorModal = true;
      }
    },
    async deleteSelectedOrders() {
      try {
        const promises = this.selectedOrders.map(orderId => axios.delete(`https://node-api-backend-v1.onrender.com/api/v1/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }));
        await Promise.all(promises);
        this.modalMessage = 'Selected orders deleted successfully';
        this.action = 'success';
        this.showModal = true;
        this.orders = this.orders.filter(order => !this.selectedOrders.includes(order._id));
        this.selectedOrders = [];
      } catch (err) {
        console.error('Error deleting selected orders:', err);
        this.errorMessage = err.message;
        this.showErrorModal = true;
      }
    },
    cancelDelete() {
      this.showModal = false;
      this.orderIdToDelete = null;
    },
    toggleSelectAllOrders() {
      if (this.selectedOrders.length) {
        this.selectedOrders = [];
      } else {
        this.selectedOrders = this.filteredOrders.map(order => order._id);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    filterByDateRange(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      switch (this.filter.dateRange) {
        case 'lastMonth':
          const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
          return date >= startOfLastMonth && date <= endOfLastMonth;
        case 'lastWeek':
          const startOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
          const endOfLastWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
          return date >= startOfLastWeek && date <= endOfLastWeek;
        case 'today':
          return date.toDateString() === now.toDateString();
        default:
          return true;
      }
    },
    closeModal() {
      this.showModal = false;
    },
    closeErrorModal() {
      this.showErrorModal = false;
    }
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
});
</script>

<style scoped>
@import '@fortawesome/fontawesome-free/css/all.css';

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

.profile-icon {
  font-size: 1.5em;
  cursor: pointer;
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

/* Live Order Count */
.live-order-count {
  margin: 20px 0;
  text-align: center;
}

.live-order-count h3 {
  font-size: 1.5em;
  color: #333;
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

.table-container {
  overflow-x: auto;
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

.order-table tr:hover {
  background-color: #ddd;
}

.edit-icon, .delete-icon {
  cursor: pointer;
  margin-right: 10px;
}

.edit-icon:hover {
  color: #00ff00;
}

.delete-icon:hover {
  color: #ff0000;
}

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.modal-buttons {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.confirm-button {
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.confirm-button:hover {
  background-color: #00ff00;
  color: #000;
}

.cancel-button {
  padding: 10px 20px;
  background-color: #ff0000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.cancel-button:hover {
  background-color: #ff4d4d;
  color: #000;
}

/* Responsive Styling */
@media (max-width: 768px) {

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
    text-align: left;
    padding-left: 15px;
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

  .order-table th {
    display: none;
  }
}

.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 8px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
</style>