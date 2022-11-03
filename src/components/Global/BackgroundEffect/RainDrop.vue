<template>
  <canvas class="bg-effect-canvas" ref="bgEffectCanvas"></canvas>
</template>

<script lang="ts" setup>
// 雨滴效果
// https://github.com/SardineFish/raindrop-fx
import Raindrop from 'raindrop-fx'
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { useStore } from '@/store'

const bgEffectCanvas = ref()
const store = useStore()

let raindropCtx: Raindrop
onMounted(() => {
  bgEffectCanvas.value.width = window.innerWidth
  bgEffectCanvas.value.height = window.innerHeight
  const config:any = { canvas: bgEffectCanvas.value }
  if (document.querySelector('.global-bg-img') && store.realBackgroundURL) {
    console.log('222', store.realBackgroundURL)
    config.background = store.realBackgroundURL
  }
  raindropCtx = new Raindrop(config)
  raindropCtx.start()
  window.addEventListener('resize', onResize)
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

watch(
  () => store.realBackgroundURL,
  () => {
    if (raindropCtx) {
      if (document.querySelector('.global-bg-img') && store.realBackgroundURL) {
        raindropCtx.setBackground(store.realBackgroundURL)
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
