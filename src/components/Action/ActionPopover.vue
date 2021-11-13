<template>
  <teleport to="body">
    <transition name="fadeOut">
      <div
        v-if="visible"
        ref="actionPopover"
        class="action-popover"
        :class="popoverCustomClass"
        :style="{
          width: rectInfo.width + 'px',
          height: rectInfo.height + 'px',
          top: rectInfo.top + 'px',
          left: rectInfo.left + 'px',
          opacity: rectInfo.race,
          overflow: rectInfo.race === 1 ? 'visible' : 'hidden'
        }">
          <slot></slot>
          <div v-if="isCenterDirection" class="close" @click="close">
            <i class="el-icon-close"></i>
          </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { getPopoverActivePointByDirection } from '@/utils/direction'
const props = defineProps({
  popoverCustomClass: {
    type: String
  }
})

const visible = ref(false)
const isCenterDirection = ref(false)

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
  left: 0,
  race: 0
})
const open = async (component: ComponentOptions, element: HTMLElement) => {
  setTimeout(() => {
    if (!component.actionSetting) return
    const { actionSetting } = component
    const { actionType, actionClickType, actionClickValue } = actionSetting
    if (actionType === 1 && actionClickType === 1) {
      const { w, h, direction } = actionClickValue
      const [endX, endY, fromX, fromY] = getPopoverActivePointByDirection(element, {
        width: w || 200,
        height: h || 200
      }, direction)
      rectInfo.value = {
        width: 0,
        height: 0,
        left: fromX,
        top: fromY,
        race: 0
      }
      visible.value = true
      setTimeout(() => {
        rectInfo.value = {
          width: w || 200,
          height: h || 200,
          left: endX,
          top: endY,
          race: 1
        }
      }, 10)

      isCenterDirection.value = direction === 0
    }
  })
}
const close = () => {
  visible.value = false
  isCenterDirection.value = false
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
  transition: all .4s ease-in-out;
}
.close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 22px;
  color: #929499;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;
  transition: transform .3s ease-in-out;
  &:hover {
    color: #a2a4a9;
    transform: rotate(-90deg);
  }
}
</style>
