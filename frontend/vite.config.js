import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Frontend stays HTTP; backend is HTTPS at https://localhost:5000
    // If you ever need to proxy:
    // proxy: { '/api': 'https://localhost:5000' }
  }
});
