<template>
  <ActionPopover ref="popover" @opened="onOpened" @startClose="onClose">
    <div class="iframe-wrapper">
      <iframe v-if="isOpened && iframeURL" :src="iframeURL" frameborder="0" style="width: 100%;height: 100%"></iframe>
    </div>
  </ActionPopover>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ActionPopover from '@/components/Action/ActionPopover.vue'

const iframeURL = ref('')
const popover = ref()

const isOpened = ref(false)

const onOpened = () => isOpened.value = true
const onClose = () => {
  isOpened.value = false
  iframeURL.value = ''
}

const open = (target: string, element?: HTMLElement) => {
  iframeURL.value = target
  popover.value.defaultOpen({
    w: window.innerWidth * 0.75,
    h: window.innerHeight * 0.8,
    direction: 0
  }, element)
}
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.iframe-wrapper {
  width: 100%;
  height: 100%;
  background: #fff;
}
</style>
