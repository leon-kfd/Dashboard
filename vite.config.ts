import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import styleImport from 'vite-plugin-style-import'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    vue()
    // styleImport({
    //   libs: [
    //     {
    //       libraryName: 'element-plus',
    //       resolveStyle: (name) => {
    //         return `element-plus/lib/theme-chalk/${name}.css`;
    //       },
    //       resolveComponent: (name) => {
    //         return `element-plus/lib/${name}`;
    //       },
    //     }
    //   ]
    // })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'element-plus': ['element-plus']
        }
      }
    }
  }
})
