import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  },
  server: {
    host: '0.0.0.0',
    port: 8080,
    https: {
      key: fs.readFileSync('./cert.key'),
      cert: fs.readFileSync('./cert.crt'),
    }
  }
})