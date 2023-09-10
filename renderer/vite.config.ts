import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        // svgr options
      }
    })
  ],
  esbuild: {
    keepNames: true,
    minifyIdentifiers: false
  },
  define: {
    VERSION: JSON.stringify(pkg.version)
  },
  build: {
    outDir: 'build'
  }
});
