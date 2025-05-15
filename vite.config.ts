/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    strictPort: true,
    port: process.env.APP_PORT ? parseInt(process.env.APP_PORT, 10) : undefined,
    cors: {
      origin: ['https://e-commerce-frontend-kj3t.onrender.com']
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__test__/setupTests.ts'],
    coverage: {
      exclude: [
        'tailwind.config.js',
        '.prettierrc.cjs',
        'postcss.config.js',
        'src/App.tsx',
        'src/main.tsx',
        'src/components/dashBoard/Admin.tsx',
        'src/components/dashBoard/Table.tsx',
        'src/pages/AddCoupon.tsx',
        'src/pages/Coupons.tsx',
        'src/pages/EditCoupon.tsx',
        'src/pages/customer.tsx',
        'src/components/Cart/Cart.tsx',
        'src/components/Checkout/Checkout.tsx',
        'src/features/Checkout/checkoutSlice.ts',
        'src/components/bannerAds/bannerSection.tsx',
        'src/components/Checkout/Checkout.tsx',
        'src/components/dashBoard/EditProduct.tsx',
        'src/components/home/FeaturedSection.tsx',
        'src/components/home/BestSellerSection.tsx',
        'src/layout/HomeLayout.tsx',
        'src/layout/DashbordLayout.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['src/App.tsx'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          map: ['@react-jvectormap/core'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis',
      },
    },
  },
  esbuild: {
    legalComments: 'none',
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
});
