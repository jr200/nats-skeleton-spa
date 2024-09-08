import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteEnvs } from 'vite-envs'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteEnvs({
      declarationFile: '.env.template',
      computedEnv: () => ({
        APP_VERSION: process.env.npm_package_version,
        BUILD_TIME: Date.now(),
      }),
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    sourcemap: true,
  },
  server: {
    watch: {
      ignored: ['**/.history/**'],
    },
  },
})
