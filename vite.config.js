import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@mui/icons-material'))  return 'mui-icons';
          if (id.includes('@mui/material') || id.includes('@emotion')) return 'mui-core';
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-')) return 'charts';
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('node_modules/react/')) return 'react-vendor';
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
