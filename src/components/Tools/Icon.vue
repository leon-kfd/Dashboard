<template>
  <svg
    xmlns='http://www.w3.org/2000/svg'
    :viewBox="viewBox"
    :fill="fill"
    :height="size"
    :width="size">
    <path :d="icon" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import IconMap from '@/constanst/icon'
const props = defineProps({
  name: {
    type: String,
    default: 'unknown'
  },
  viewBox: {
    type: String,
    default: '0 0 24 24',
  },
  size: {
    type: [String, Number],
    default: 24,
  },
  fill: {
    type: String,
    default: 'currentColor',
  }
})
const icon = computed(() => {
  return IconMap[props.name]
})
</script>
