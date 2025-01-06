<template>
    <div class="admin-profile-page">
      <!-- Navbar -->
      <nav class="navbar">
        <div class="logo">
          <img src="/src/assets/logo-swear.png" alt="Logo">
        </div>
        <h2>Admin Profile</h2>
        <button @click="goBack" class="back-button">Back to Orders</button>
      </nav>
  
      <!-- Admin Profile Details -->
      <div class="profile-summary-container">
        <div v-if="admin" class="profile-summary">
          <div class="section">
            <h3 class="section-title">Profile Information</h3>
            <p><strong>Username:</strong> <input type="text" v-model="admin.username" class="input-field" /></p>
            <p><strong>Email:</strong> <input type="email" v-model="admin.email" class="input-field" /></p>
          </div>
  
          <div class="section">
            <h3 class="section-title">Change Password</h3>
            <p><strong>Old Password:</strong> <input type="password" v-model="passwords.oldPassword" class="input-field" /></p>
            <p><strong>New Password:</strong> <input type="password" v-model="passwords.newPassword" class="input-field" /></p>
            <p><strong>Confirm New Password:</strong> <input type="password" v-model="passwords.confirmNewPassword" class="input-field" /></p>
          </div>
  
          <div class="button-group">
            <button @click="confirmUpdate" class="update-button">Update Profile</button>
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
        admin: {
          username: '',
          email: ''
        },
        passwords: {
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        },
        error: null,
        showModal: false,
        modalMessage: '',
        action: null
      };
    },
    created() {
      this.fetchAdminProfile();
    },
    methods: {
      async fetchAdminProfile() {
        try {
          const token = localStorage.getItem('token');
          if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            const response = await axios.get('https://node-api-backend-v1.onrender.com/api/v1/admin');
            console.log('Admin profile response:', response); // Log the entire response for debugging
            if (response.data && response.data.data && response.data.data.admins && response.data.data.admins.length > 0) {
              this.admin = response.data.data.admins[0];
              console.log('Admin profile:', this.admin); // Log the admin profile for debugging
            } else {
              this.error = 'Failed to retrieve admin profile. Please try again later or contact support.';
            }
          } else {
            this.error = 'No token found';
          }
        } catch (err) {
          console.error('Error fetching admin profile:', err); // Log the error for debugging
          if (err.response) {
            console.error('Response data:', err.response.data);
            console.error('Response status:', err.response.status);
            console.error('Response headers:', err.response.headers);
            this.error = 'Failed to retrieve admin profile';
          } else if (err.request) {
            console.error('Request data:', err.request);
            this.error = 'No response received from server';
          } else {
            console.error('Error message:', err.message);
            this.error = 'Error in setting up the request';
          }
        }
      },
      confirmUpdate() {
        this.modalMessage = 'Are you sure you want to update your profile?';
        this.action = 'update';
        this.showModal = true;
      },
      async executeAction() {
        this.showModal = false;
        if (this.action === 'update') {
          await this.updateProfile();
        }
      },
      cancelAction() {
        this.showModal = false;
      },
      async updateProfile() {
        try {
          const response = await axios.put(`https://node-api-backend-v1.onrender.com/api/v1/admin/${this.admin._id}`, {
            username: this.admin.username,
            email: this.admin.email,
            oldPassword: this.passwords.oldPassword,
            newPassword: this.passwords.newPassword,
            confirmNewPassword: this.passwords.confirmNewPassword
          }, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          });
          if (response.status !== 200) throw new Error(`Failed to update profile: ${response.statusText}`);
          alert('Profile updated successfully');
        } catch (err) {
          console.error('Error updating profile:', err);
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
  
  .back-button {
    padding: 10px 20px;
    background-color: #000;
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 4px;
  }
  
  .back-button:hover {
    background-color: #00ff00;
    color: #000;
  }
  
  /* Profile Page */
  .admin-profile-page {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px;
  }
  
  .profile-summary-container {
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
  
  .input-field {
    width: 100%;
    padding: 8px;
    margin: 4px 0;
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
    .navbar {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .logo {
      width: 25%;
    }
  
    .admin-profile-page {
      padding: 10px;
    }
  }
  
  @media (max-width: 480px) {
    .navbar h2 {
      font-size: 1rem;
    }
  
    .admin-profile-page {
      padding: 5px;
    }
  }
  </style>