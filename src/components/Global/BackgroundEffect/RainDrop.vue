<template>
  <canvas class="bg-effect-canvas" ref="bgEffectCanvas"></canvas>
</template>

<script lang="ts" setup>
// 雨滴效果
// https://github.com/SardineFish/raindrop-fx
import Raindrop from 'raindrop-fx'
// import Raindrop from './RainDrop'
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useStore } from '@/store'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'

const bgEffectCanvas = ref()
const store = useStore()
const { t } = useI18n()

let raindropCtx: Raindrop
let raindropInitError = false
onMounted(async () => {
  bgEffectCanvas.value.width = window.innerWidth
  bgEffectCanvas.value.height = window.innerHeight
  const config:any = { canvas: bgEffectCanvas.value }
  if (document.querySelector('.global-bg-img') && store.realBackgroundURL) {
    config.background = store.realBackgroundURL
  }
  try {
    raindropCtx = new Raindrop(config)
    await raindropCtx.start()
    window.addEventListener('resize', onResize)
  } catch (e) {
    raindropInitError = true
    showError()
  }
})
onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})

function onResize() {
  if (raindropCtx) {
    const rect = bgEffectCanvas.value.getBoundingClientRect();
    raindropCtx.resize(rect.width, rect.height);
  }
}

let timer:number
function showError() {
  if (timer) clearTimeout(timer)
  timer = setTimeout(() => {
    ElNotification({
      title: t('错误'),
      type: 'error',
      message: t('雨滴特效实现失败, 请确保壁纸地址允许跨域')
    })
  }, 300)
}

watch(
  () => store.realBackgroundURL,
  async () => {
    if (raindropCtx) {
      if (document.querySelector('.global-bg-img') && store.realBackgroundURL) {
        try {
          await raindropCtx.setBackground(store.realBackgroundURL)
          if (raindropInitError) {
            await raindropCtx.start()
            raindropInitError = false
          }
        } catch (e) {
          showError()
        }
      }
    }
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
