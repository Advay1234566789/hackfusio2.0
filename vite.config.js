// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Deduplicate Three.js: ensure only one instance is used
      'three': path.resolve(__dirname, 'node_modules/three'),
    },
  },
});
