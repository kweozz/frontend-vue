<template>
    <div class="login-page">
        <!-- Navbar -->
        <nav class="navbar">
            <div class="logo">
                <img src="/src/assets/logo-swear.png" alt="Logo">
            </div>
            <h2>Admin Login</h2>
        </nav>

        <!-- Login Form -->
        <div class="login-form-container">
            <form @submit.prevent="login">
                <div class="form-group">
                    <label for="username">Username</label>
                    <input type="text" id="username" v-model="username" required />
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" v-model="email" required />
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" v-model="password" required />
                </div>
                <button type="submit">Login</button>
                <p v-if="error" class="error-message">{{ error }}</p>
            </form>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'AdminLogin',
  data() {
    return {
      username: '',
      email: '', // Add email field here
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://node-api-backend-v1.onrender.com/api/v1/admin/login', { // Ensure the URL is correct
          username: this.username,
          email: this.email,
          password: this.password
        });
        console.log('Response:', response); // Log the entire response for debugging
        const token = response.data.data.token; // Access the token from the nested data object
        if (token) {
          localStorage.setItem('token', token);
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('Logged in successfully + token:', token);
          this.$router.push('/orders');
        } else {
          this.error = 'Failed to retrieve token';
        }
      } catch (err) {
        console.error('Login error:', err); // Log the error for debugging
        if (err.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          this.error = 'Invalid username, email, or password';
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

/* Login Page */
.login-page {
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 20px;
    align-items: center;
    justify-content: center;
}

.login-form-container {
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
}

.form-group input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

button {
    padding: 10px 20px;
    background-color: #000;
    color: #fff;    border: none;    cursor: pointer;    border-radius: 4px;}button:hover {    background-color: #00ff00;    color: #000;}.error-message {    color: red;    margin-top: 10px;}</style>