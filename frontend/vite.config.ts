import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Allow access from external IPs
    port: 5173,       // Set port
    strictPort: true,
    cors: true,       // Enable CORS
  }
});
