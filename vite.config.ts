import { defineConfig } from 'vite'
import tsconfigPath from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react'

export default defineConfig({
  build: {
    outDir: 'build',
  },
  plugins: [
    react({
      babel: {
        plugins: ['babel-plugin-react-compiler'],
      },
    }),
    tsconfigPath(),
  ],
})
