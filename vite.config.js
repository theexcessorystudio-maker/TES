import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  css: {
    // Readable class names in dev (Component_class_hash), short hashes in production.
    modules: { generateScopedName: process.env.NODE_ENV === 'production' ? '[hash:base64:6]' : '[name]_[local]_[hash:base64:4]' },
  },
  build: {
    rollupOptions: {
      output: {
        // Long-lived vendor chunks: app deploys don't invalidate the browser's cached libraries.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
