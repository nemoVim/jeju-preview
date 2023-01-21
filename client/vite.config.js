import { defineConfig, resolveBaseUrl } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    rollupOptions: {
      input: {
        home: 'index.html',
        admin: 'admin.html',
      }
    }
  }
})
