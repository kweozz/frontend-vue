<template>
  <div class="order-page">
    <!-- Navbar    -->
    <nav class="navbar">
      <div class="logo">
        <img src="../assets/logo-swear.png" alt="Logo">
      </div>
      <h2>Order Details</h2>
      <button @click="goBack" class="back-button">Back to Orders</button>
    </nav>

    <!-- Order Details---->
    <div class="order-summary-container">
      <div v-if="order" class="order-summary">
        <div class="section">
          <h3 class="section-title">General Information</h3>
          <p><strong>ID:</strong> {{ order._id }}</p>
          <p class="status-title" ><strong>Status:</strong> 
            <select v-model="order.status" class="status-dropdown">
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </p>
          <p><strong>Date:</strong> {{ formatDate(order.date) }}</p>
          <p><strong>Shoe Name:</strong> <input type="text" v-model="order.shoeName" class="input-field" /></p>
        </div>

        <div class="section">
          <h3 class="section-title">User Information</h3>
          <p><strong>First Name:</strong> <input type="text" v-model="order.user.firstName" class="input-field" /></p>
          <p><strong>Last Name:</strong> <input type="text" v-model="order.user.lastName" class="input-field" /></p>
          <p><strong>Phone:</strong> <input type="text" v-model="order.user.phone" class="input-field" /></p>
          <p><strong>Email:</strong> <input type="email" v-model="order.user.email" class="input-field" /></p>
          <p><strong>Address:</strong> <input type="text" v-model="order.user.address" class="input-field" /></p>
        </div>

        <div class="section">
          <h3 class="section-title">Shoe Configuration</h3>
          <p><strong>Colors:</strong></p>
          <ul>
            <li v-for="(color, part) in order.shoeConfig.colors" :key="part">
              {{ partNameMapping[part] || part }}: {{ colorMapping[color] || color }}
              <span :style="{ border: '1px solid black', display: 'inline-block', width: '20px', height: '20px', backgroundColor: color, marginLeft: '10px' }"></span>
            </li>
          </ul>
          <p><strong>Fabrics:</strong></p>
          <ul>
            <li v-for="(fabric, part) in order.shoeConfig.fabrics" :key="part">
              {{ partNameMapping[part] || part }}: {{ fabricMapping[fabric] || fabric }}
            </li>
          </ul>
          <p><strong>Initials:</strong> <input type="text" v-model="order.shoeConfig.initials" class="input-field" /></p>
          <p><strong>Size:</strong> 
            <select v-model="order.shoeConfig.size" class="input-field">
              <option v-for="size in sizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </p>
        </div>
        <div class="section">
          <h3 class="section-title">Price Information</h3>
          <p><strong>Base Price:</strong> <input type="number" v-model="order.price.basePrice" class="input-field" /></p>
          <p><strong>Customization Fee:</strong> <input type="number" v-model="order.price.customizationFee" class="input-field" /></p>
          <p><strong>Shipping Cost:</strong> <input type="number" v-model="order.price.shippingCost" class="input-field" /></p>
          <p><strong>Total Price:</strong> {{ totalPrice }}</p>
        </div>

        <div class="button-group">
          <button @click="confirmUpdate" class="update-button">Update Order</button>
          <button @click="confirmDelete" class="delete-button">Delete Order</button>
        </div>
      </div>
      <p v-if="error" class="text-red-600 mt-4">{{ error }}</p>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <p>{{ modalMessage }}</p>
        <div class="modal-buttons">
          <button @click="executeAction" class="confirm-button">Yes</button>
          <button @click="cancelAction" class="cancel-button">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      order: null,
      error: null,
      showModal: false,
      modalMessage: '',
      action: null,
      partNameMapping: {
        inside: 'Inside',
        laces: 'Laces',
        outside_1: 'Outside 1',
        outside_2: 'Outside 2',
        outside_3: 'Outside 3',  
        sole_bottom: 'Sole Bottom',
        sole_top: 'Sole Top'

      },
      colorMapping: {
        '#fce4ec': 'Pink',
        '#f50057': 'Hot Pink',
        '#d50000': 'Red',
        '#ff5722': 'Orange',
        '#ffeb3b': 'Yellow',
        '#ffffff': 'White',
        '#8bc34a': 'Light Green',
        '#009688': 'Teal',
        '#03a9f4': 'Light Blue',
        '#673ab7': 'Purple',
        '#000000': 'Black'
      },
      fabricMapping: {
        none: 'None',
        leather: 'Leather'
        // Add more fabric mappings as needed
      },
      fabricTextures: {
        none: '',
        leather: '/path/to/leather-texture.jpg'
        // Add more fabric textures as needed
      },
      sizes: Array.from({ length: 11 }, (_, i) => i + 36) // Sizes from 36 to 46
    };
  },
  created() {
    this.fetchOrder();
  },
  computed: {
    totalPrice() {
      return (
        (this.order.price.basePrice || 0) +
        (this.order.price.customizationFee || 0) +
        (this.order.price.shippingCost || 0)
      );
    }
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
    confirmUpdate() {
      this.modalMessage = 'Are you sure you want to update this order?';
      this.action = 'update';
      this.showModal = true;
    },
    confirmDelete() {
      this.modalMessage = 'Are you sure you want to delete this order?';
      this.action = 'delete';
      this.showModal = true;
    },
    async executeAction() {
      this.showModal = false;
      if (this.action === 'update') {
        await this.updateOrder();
      } else if (this.action === 'delete') {
        await this.deleteOrder();
      }
    },
    cancelAction() {
      this.showModal = false;
    },
    async updateOrder() {
      try {
        const response = await axios.put(`https://node-api-backend-v1.onrender.com/api/v1/orders/${this.order._id}`, this.order, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status !== 200) throw new Error(`Failed to update order: ${response.statusText}`);
        alert('Order updated successfully');
      } catch (err) {
        console.error('Error updating order:', err);
        this.error = err.message;
      }
    },
    async deleteOrder() {
      try {
        const response = await axios.delete(`https://node-api-backend-v1.onrender.com/api/v1/orders/${this.order._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.status !== 200) throw new Error(`Failed to delete order: ${response.statusText}`);
        alert('Order deleted successfully');
        this.$router.push('/orders');
      } catch (err) {
        console.error('Error deleting order:', err);
        this.error = err.message;
      }
    },
    goBack() {
      this.$router.push('/orders');
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
blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
  margin: 2% 0;

}
.back-button {
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  margin-left: 20px;
}

.back-button:hover {
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
p strong {
 text-transform: uppercase;
}

.order-summary-container {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.section {
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.2em;
  font-weight: 400;
  text-transform: uppercase;
  margin-bottom: 10px;
  background-color: #000;
  color: white;
  padding: 1%;
  display: flex;
  justify-content: center;
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

.input-field {
  width: 100%;
  padding: 8px;
  margin: 4px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.status-dropdown {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button-group {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}

.update-button {
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.update-button:hover {
  background-color: #00ff00;
  color: #000;
}

.delete-button {
  padding: 10px 20px;
  background-color: #ff0000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.delete-button:hover {
  background-color: #ff4d4d;
  color: #000;
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
p.status-title{
  display: flex;
  flex-direction: column;
 
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