// import { defineConfig } from 'vite';
// import react from '@vitejs/plugin-react';

// export default defineConfig({
//   plugins: [react()],
//   server: {
//     host: '0.0.0.0',
//     port: 5173,
//     strictPort: true,
//     watch: {
//       usePolling: true,
//     },
//     proxy: {
//       '/api': {
//         target: 'http://localhost:8000', 
//         changeOrigin: true,
//         rewrite: (path) => path.replace(/^\/api/, '/api'),
//       },
//     },
//     allowedHosts: ['auditlyai.com'], 
//   },
// });


import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    watch: {
      usePolling: true,
    },
    proxy: {
      '/api': {
        target: 'http://auditlyai.com:8000', // ✅ Updated for production
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
    allowedHosts: ['auditlyai.com'], // ✅ Allow this domain to access the dev server
  },
});
