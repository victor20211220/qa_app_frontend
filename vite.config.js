import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/external': {
        target: 'https://youmentorme-m6lzj4bpgzcgmgw8.builder-preview.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/external/, ''),
      },
    },
  },
});

