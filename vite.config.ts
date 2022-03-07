import { defineConfig } from 'vite'
import { resolve } from 'path'
import Vue from '@vitejs/plugin-vue'
import VueJSX from '@vitejs/plugin-vue-jsx'
import Markdown from 'vite-plugin-md'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.VITE_APP_BUILD_MODE === 'crx' ? './' : '/Dashboard/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    }
  },
  optimizeDeps: {
    include: [
      'vue',
      'pinia',
      'pinia-plugin-persistedstate',
      'vue-grid-layout',
      'element-plus',
      'vuedraggable',
      '@howdyjs/to-control',
      '@howdyjs/mouse-menu',
      'dayjs'
    ]
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: '@use "@/assets/element-variables" as *;'
      }
    }
  },
  plugins: [
    // viteCommonjs(),
    Vue({
      include: [/\.vue$/, /\.md$/]
    }),
    VueJSX(),
    Markdown()
  ],
  build: {
    outDir: process.env.VITE_APP_BUILD_MODE === 'crx' ? 'crx' : 'dist'
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://kongfandong.cn',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, '')
      }
    }
  }
})
