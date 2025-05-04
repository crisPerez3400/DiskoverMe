import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // El puerto de tu backend Express
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '') // Esto elimina '/api' de la URL
      }
    }
  }
})
