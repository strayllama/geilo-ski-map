import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // base: "./", // Or "/repository-name/" if it's not a custom domain
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
