import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
    strictPort: true,
    allowedHosts: true,
    fs: {
      allow: [
        path.resolve(__dirname, '..'),
        path.resolve(__dirname)
      ]
    }
  },
  esbuild: {
    loader: 'jsx',
    include: /\.[jt]sx?$/,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    react({
      include: /\.(js|jsx|ts|tsx)$/,
    }),
  ]
});
