import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Raise CSS/JS split threshold so small utility chunks inline
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined
          if (id.includes('react-router')) return 'router'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('swiper')) return 'swiper'
          if (id.includes('aos')) return 'aos'
          if (id.includes('axios') || id.includes('sonner')) return 'vendor'
          if (id.includes('react-dom') || id.includes('/react/')) return 'react'
          // Keep @iconify in its own chunk (loaded lazily by icon usage)
          if (id.includes('@iconify')) return 'iconify'
          return undefined
        },
      },
    },
  },
})
