<template>
  <div class="bg-effect-wrapper">
    <RainDrop v-if="effectActive === 1"/>
  </div>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, computed } from 'vue'
import { useStore } from '@/store'
const RainDrop = defineAsyncComponent(() => import('./BackgroundEffect/RainDrop.vue'))
const store = useStore()
const effectActive = computed(() => store.backgroundEffectActive)
</script>

<style lang="scss" scoped>
.bg-effect-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
