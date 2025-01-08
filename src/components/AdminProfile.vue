<template>
  <div class="admin-profile-page">
    <!-- Navbar -->
    <nav class="navbar">
      <div class="logo">
        <img src="../assets/logo-swear.png" alt="Logo">
      </div>
      <h2>Admin Profile</h2>
      <div class="navbar-buttons">
        <button @click="goBack" class="back-button">Back</button>
        <button @click="confirmLogout" class="logout-button">Logout</button>
      </div>
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
        <div class="modal-buttons" v-if="action !== 'success'">
          <button @click="executeAction" class="confirm-button">Yes</button>
          <button @click="cancelAction" class="cancel-button">No</button>
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
      showErrorModal: false,
      modalMessage: '',
      errorMessage: '',
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
        if (!token) {
        this.$router.push('/'); // Redirect to login page if no token is found
        return;
        }
        else if (token) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await axios.get('https://node-api-backend-v1.onrender.com/api/v1/admin');
          console.log('Admin profile response:', response); // Log the entire response for debugging
          if (response.data && response.data.data && response.data.data.admins && response.data.data.admins[0]) {
            this.admin = response.data.data.admins[0]; // Access the admin profile data
            console.log('Admin profile:', this.admin); // Log the admin profile for debugging
          } else {
            this.errorMessage = 'Failed to retrieve admin profile. Please try again later or contact support.';
            this.showErrorModal = true;
          }
        } else {
          this.errorMessage = 'No token found';
          this.showErrorModal = true;
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err); // Log the error for debugging
        if (err.response) {
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          this.errorMessage = 'Failed to retrieve admin profile';
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
    confirmUpdate() {
      this.modalMessage = 'Are you sure you want to update your profile?';
      this.action = 'update';
      this.showModal = true;
    },
    confirmLogout() {
      this.modalMessage = 'Are you sure you want to log out?';
      this.action = 'logout';
      this.showModal = true;
    },
    async executeAction() {
      this.showModal = false;
      if (this.action === 'update') {
        await this.updateProfile();
      } else if (this.action === 'logout') {
        this.logout();
      }
    },
    cancelAction() {
      this.showModal = false;
    },
    async updateProfile() {
      try {
        // new passwords match?
      if (this.passwords.newPassword !== this.passwords.confirmNewPassword) {
        this.errorMessage = 'New passwords do not match';
        this.showErrorModal = true;
        return;
      }

      const adminId = this.admin._id; // Access the admin ID
      const response = await axios.put(`https://node-api-backend-v1.onrender.com/api/v1/admin/${adminId}`, {
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

      // old password check
      console.log('Update profile response:', response);
      if (response.data.error) {
        if (response.data.error === 'Old password is incorrect') {
          this.errorMessage = 'Old password is incorrect';
        } else {
          this.errorMessage = response.data.error;
        }
        this.showErrorModal = true;
        return;
      }

      this.modalMessage = 'Profile updated successfully';
      this.action = 'success';
      this.showModal = true;
      } catch (err) {
      console.error('Error updating profile:', err);
      this.errorMessage = err.message;
      this.showErrorModal = true;
      }
    },
    logout() {
      localStorage.removeItem('token');
      this.$router.push('/');
    },
    goBack() {
      this.$router.push('/orders');
    },
    closeModal() {
      this.showModal = false;
    },
    closeErrorModal() {
      this.showErrorModal = false;
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

.navbar-buttons {
  display: flex;
  gap: 10px;
}

.back-button, .logout-button {
  padding: 10px 20px;
  background-color: #000;
  color: #fff;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.back-button:hover, .logout-button:hover {
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
    max-width: auto;
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
    font-size: 0.6rem;
    text-align: center;
  }

  .logo {
    width: 15%;
  }

  .admin-profile-page {
    padding: 5px;
  }
}
</style>