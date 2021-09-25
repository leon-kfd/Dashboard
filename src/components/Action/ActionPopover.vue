<template>
  <teleport to="body">
    <div
      v-if="visible"
      ref="actionPopover"
      class="action-popover"
      :class="popoverCustomClass"
      :style="{
        width: rectInfo.width + 'px',
        height: rectInfo.height + 'px',
        top: rectInfo.top + 'px',
        left: rectInfo.left + 'px'
      }">
      <slot></slot>
    </div>
  </teleport>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, Ref } from 'vue'
import { getPopoverActivePointByDirection } from '@/utils/direction'
const props = defineProps({
  popoverCustomClass: {
    type: String
  }
})

const visible = ref(false)

// clickOutside
const actionPopover = ref()
onMounted(() => {
  document.addEventListener('click', clickOutsideEvent)
})
onUnmounted(() => {
  document.removeEventListener('click', clickOutsideEvent)
})
const clickOutsideEvent = (e: MouseEvent) => {
  if (visible.value && !actionPopover.value.contains(e.target)) {
    visible.value = false
  }
}

const rectInfo = ref({
  width: 200,
  height: 200,
  top: 0,
  left: 0
})
const open = async (component: ComponentOptions, element: HTMLElement) => {
  setTimeout(() => {
    if (!component.actionSetting) return
    const { actionSetting } = component
    const { actionType, actionClickType, actionClickValue } = actionSetting
    if (actionType === 1 && actionClickType === 1) {
      const { w, h, direction } = actionClickValue
      const activePoint = getPopoverActivePointByDirection(element, {
        width: w || 200,
        height: h || 200
      }, direction)
      rectInfo.value = {
        width: w || 200,
        height: h || 200,
        left: activePoint[0],
        top: activePoint[1],
      }
      visible.value = true
    }
  })
}
const close = () => {
  visible.value = false
}
const toggle = (component: ComponentOptions, element: HTMLElement) => {
  if (visible.value) {
    close()
  } else {
    open(component, element)
  }
}

defineExpose({
  open,
  close,
  toggle
})
</script>
<style lang='scss' scoped>
.action-popover {
  position: fixed;
  top: 0;
  left: 0;
  min-width: 40px;
  min-height: 40px;
  z-index: 2001;
}
</style>
