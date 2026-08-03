import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  server: {
    host: true,
    hmr: {
      clientPort: 5173,
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        newShapes: resolve(__dirname, 'new_shapes.html'),
        admin: resolve(__dirname, 'admin.html'),
        presentation: resolve(__dirname, 'presentation.html'),
        hagasha: resolve(__dirname, 'hagasha.html'),
        landing: resolve(__dirname, 'landing.html'),
      },
    },
  },
});
