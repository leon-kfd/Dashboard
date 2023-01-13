<template>
  <div class="bg-effect-wrapper" :style="[1,2].includes(effectActive) ? 'backdrop-filter: brightness(0.85)': ''">
    <RainDrop v-if="effectActive === 1"/>
    <Snow v-if="effectActive === 2" />
    <Star v-if="effectActive === 3" />
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed } from 'vue'
import { useStore } from '@/store'
const RainDrop = defineAsyncComponent(() => import('./BackgroundEffect/RainDrop.vue'))
const Snow = defineAsyncComponent(() => import('./BackgroundEffect/Snow.vue'))
const Star = defineAsyncComponent(() => import('./BackgroundEffect/Star.vue'))
const store = useStore()
const effectActive = computed(() => store.backgroundEffectActive)
</script>

<style lang="scss" scoped>
.bg-effect-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  // backdrop-filter: brightness(0.85);
}
</style>
