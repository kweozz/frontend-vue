<template>
  <div class="login-page">
    <!-- Navbar -->
    <nav class="navbar padding">
      <div class="logo">
        <img src="/src/assets/logo-swear.png" alt="Logo">
      </div>
      <h2>Admin Login</h2>
    </nav>
    <h1 class="padding">Login to access the admin dashboard</h1>
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
      email: '',
      password: '',
      error: ''
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('https://node-api-backend-v1.onrender.com/api/v1/admin/login', {
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
          console.error('Response data:', err.response.data);
          console.error('Response status:', err.response.status);
          console.error('Response headers:', err.response.headers);
          this.error = 'Invalid username, email, or password';
        } else if (err.request) {
          console.error('Request data:', err.request);
          this.error = 'No response received from server';
        } else {
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
  width: 100%;
}

.navbar h2 {
  font-weight: 400;
}

h1 {
  text-transform: uppercase;
  font-weight: 400;
  font-size: 1.5em;
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
  border: 1px solid #ddd;
  width: 100%;
  max-width: 400px;
}

.padding {
  margin-bottom: 2%;
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
  width: 100%;
}

button:hover {
  background-color: #00ff00;
  color: #000;
}

.error-message {
  color: red;
  margin-top: 10px;
  text-align: center;
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

  .login-page {
    padding: 10px;
  }

  .login-form-container {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .navbar h2 {
    font-size: 1rem;
  }

  .login-page {
    padding: 5px;
  }

  .login-form-container {
    width: 100%;
  }
}
</style>