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
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://node-api-backend-v1.onrender.com/api/v1/admin/login', {
          username: this.username,
          password: this.password
        });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/orders');
      } catch (err) {
        this.error = 'Invalid username or password';
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
    color: #fff;
    border: none;
    cursor: pointer;
    border-radius: 4px;
}

button:hover {
    background-color: #00ff00;
    color: #000;
}

.error-message {
    color: red;
    margin-top: 10px;
}
</style>