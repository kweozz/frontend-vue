import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'https://node-api-backend-v1.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
