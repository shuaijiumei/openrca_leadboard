import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'development' ? '/' : '/openrca_leadboard/',
  plugins: [react()],
  server: {
    allowedHosts: ['connection-mom-agencies-shoot.trycloudflare.com'],
  },
}))
