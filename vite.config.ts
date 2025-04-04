import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // base: "/geilo-ski-map",
  // base: "./",
  // base: process.env.NODE_ENV === 'production' ? '/geilo-ski-map/' : '/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
