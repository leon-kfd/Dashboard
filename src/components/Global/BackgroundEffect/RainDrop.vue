<template>
  <canvas class="bg-effect-canvas" ref="bgEffectCanvas"></canvas>
</template>

<script lang="ts" setup>
// 雨滴效果
// https://github.com/SardineFish/raindrop-fx
// import Raindrop from 'raindrop-fx'
import Raindrop from './source/raindrop-fx'
import { nextTick, onUnmounted, ref, watch } from 'vue';
import { useStore } from '@/store'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'

const bgEffectCanvas = ref()
const store = useStore()
const { t } = useI18n()

let raindropCtx: any = null

const getImg = (src: string) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.src = src
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      const w = img.width
      const h = img.height
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.setAttribute('width', w + 'px');
      canvas.setAttribute('height', h + 'px');
      ctx.drawImage(img, 0, 0, w, h);

      if (store.global.backgroundFilter && store.global.backgroundFilter.includes('brightness')) {
        const regex = /brightness\((\d+(\.\d+)?)\)/
        const match = store.global.backgroundFilter.match(regex);
        if (match) {
          const brightness = parseFloat(match[1])
          if (brightness > 0 && brightness < 1) {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              data[i] *= brightness;
              data[i + 1] *= brightness;
              data[i + 2] *= brightness;
            }
            ctx.putImageData(imageData, 0, 0);
          }
        }
      }
      const base64 = canvas.toDataURL('image/png', 1);
      resolve(base64)
    }
    img.onerror = () => {
      reject(new Error('Load img error'))
    }
  })
}
onUnmounted(() => {
  raindropCtx?.destroy?.()
  window.removeEventListener('resize', onResize)
  if (timer) clearTimeout(timer)
})

function onResize() {
  if (raindropCtx) {
    const rect = bgEffectCanvas.value.getBoundingClientRect();
    raindropCtx.resize(rect.width, rect.height);
  }
}

let timer:number
watch(
  () => [store.realBackgroundURL, store.global.backgroundFilter],
  () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(async () => {
      let isStart = true
      if (!raindropCtx) {
        await nextTick()
        bgEffectCanvas.value.width = window.innerWidth
        bgEffectCanvas.value.height = window.innerHeight
        raindropCtx = new Raindrop({ canvas: bgEffectCanvas.value })
        isStart = false
      }
      if (document.querySelector('.global-bg-img') && store.realBackgroundURL) {
        try {
          const img = await getImg(store.realBackgroundURL)
          await raindropCtx.setBackground(img)
          if (!isStart) await raindropCtx.start()
        } catch (e) {
          ElNotification({
            title: t('错误'),
            type: 'error',
            message: t('雨滴特效实现失败, 请确保壁纸地址允许跨域')
          })
        }
      }
    }, 100)
  },
  {
    immediate: true
  }
)
</script>

<style lang="scss" scoped>
.bg-effect-canvas {
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
