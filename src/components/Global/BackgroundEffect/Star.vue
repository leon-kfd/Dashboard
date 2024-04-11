<template>
  <canvas ref="bgEffectCanvas" class="bg-effect-canvas" />
</template>

<script lang="ts" setup>
// 星空效果
// https://codepen.io/leon-kfd/pen/yLqbqzX
import { onMounted, onUnmounted, ref } from 'vue'
import StarEffect from './source/Star'
const bgEffectCanvas = ref<HTMLCanvasElement>()
let starControl: StarEffect
onMounted(() => {
  starControl = new StarEffect(bgEffectCanvas.value as HTMLCanvasElement)
  starControl.start()
})
onUnmounted(() => {
  starControl.destroy()
})
</script>

<style lang="scss" scoped>
.bg-effect-canvas {
  width: 100%;
  height: 100%;
  // pointer-events: none;
}
</style>
