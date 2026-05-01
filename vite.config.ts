import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import basicSsl from '@vitejs/plugin-basic-ssl'; // <--- 1. Добавляем импорт

export default defineConfig(({ mode }) => ({
  server: {
    host: "::", // Это позволяет заходить по IP
    port: 8080,
    https: {}, // <--- 2. Включаем режим HTTPS
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(), 
    basicSsl(), // <--- 3. Добавляем плагин в список
    mode === "development" && componentTagger()
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
