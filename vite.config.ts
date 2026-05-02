import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // Оставляем host и port, если тебе удобно тестировать локально на 8080
    host: '0.0.0.0',
    port: 8080,
    // Удаляем блок https полностью, так как Vercel сам дает SSL
  },
})