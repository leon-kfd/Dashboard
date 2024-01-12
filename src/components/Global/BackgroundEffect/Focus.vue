<template>
  <div 
    v-if="realBackgroundURL" 
    class="effect-focus-wrapper"
    :style="{
      filter: backgroundFilter,
      background: `url(${realBackgroundURL}) no-repeat center/cover`,
      maskImage: `radial-gradient(
        circle 50vmin at ${pointX}px ${pointY}px,
        black 20vmin,
        transparent
      )`
    }"
  >
  </div>
</template>

<script setup lang="ts">
// https://codepen.io/wakana-k/pen/KKJgQXa?editors=0110
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from '@/store'

const store = useStore()

const pointX = ref(50)
const pointY = ref(50)
const realBackgroundURL = computed(() => store.realBackgroundURL)
const backgroundFilter = computed(() => store.global.backgroundFilter)

const onMouseMove = (e: MouseEvent) => {
  if (e.clientX < 10 || e.clientX > window.innerWidth - 10 || e.clientY < 10 || e.clientY > window.innerHeight - 10) {
    pointX.value = -999
    pointY.value = -999
  } else {
    pointX.value = e.clientX
    pointY.value = e.clientY
  }
}

const onMouseLeave = () => {
  pointX.value = -999
  pointY.value = -999
}

onMounted(() => {
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseleave', onMouseLeave)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', onMouseMove)
  document.removeEventListener('mouseleave', onMouseLeave)
})

watch(() => realBackgroundURL.value, () => {
  const bgImgDom = document.querySelector('.bg-media-wrapper .bg-media-filter') as HTMLImageElement
  if (bgImgDom) {
    const { filter } = window.getComputedStyle(bgImgDom)
    if (filter.includes('brightness')) {
      bgImgDom.style.filter = `${filter} blur(0.7vmax)`
    } else {
      bgImgDom.style.filter = 'blur(0.7vmax)'
    }
  }
})

</script>

<style lang="scss" scoped>
.effect-focus-wrapper {
  width: 100%;
  height: 100%;
}
</style>
