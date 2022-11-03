<template>
  <div class="bg-effect-wrapper">
    <RainDrop v-if="effectActive === 1"/>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
const RainDrop = defineAsyncComponent(() => import('./BackgroundEffect/RainDrop.vue'))
const effectActive = ref(0)
</script>

<style lang="scss" scoped>
.bg-effect-wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
