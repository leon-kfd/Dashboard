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
      '@': resolve(__dirname, 'src')
    }
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
