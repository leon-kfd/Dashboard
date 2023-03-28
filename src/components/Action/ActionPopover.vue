<template>
  <teleport to="body">
    <transition name="zoomIn">
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
          transformOrigin: transformOriginStr,
          zIndex: zIndex
        }">
          <slot></slot>
          <div v-if="isCenterDirection" class="close" @click="close">
            <Icon name="close" />
          </div>
      </div>
    </transition>
  </teleport>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { getPopoverActivePointByDirection } from '@/utils/direction'
const props = defineProps({
  popoverCustomClass: {
    type: String
  },
  closeOnClickOutside: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: 2001
  },
})
const emit = defineEmits(['opend', 'closed'])

const visible = ref(false)
const isCenterDirection = ref(false)
const transformOriginStr = ref('')

// clickOutside
const actionPopover = ref()
onMounted(() => {
  document.addEventListener('click', clickOutsideEvent)
})
onUnmounted(() => {
  document.removeEventListener('click', clickOutsideEvent)
})
const clickOutsideEvent = (e: MouseEvent) => {
  if (!props.closeOnClickOutside) return
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
      const [endX, endY, fromX, fromY] = getPopoverActivePointByDirection(element, {
        width: w || 200,
        height: h || 200
      }, direction)
      rectInfo.value = {
        width: w || 200,
        height: h || 200,
        left: endX,
        top: endY
      }
      transformOriginStr.value = `${fromX - endX}px ${fromY - endY}px`
      visible.value = true
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

const defaultOpen = ({ w, h, direction }: any, element: HTMLElement) => {
  setTimeout(() => {
    const [endX, endY, fromX, fromY] = getPopoverActivePointByDirection(element, {
      width: w || 200,
      height: h || 200
    }, direction)
    rectInfo.value = {
      width: w || 200,
      height: h || 200,
      left: endX,
      top: endY
    }
    transformOriginStr.value = `${fromX - endX}px ${fromY - endY}px`
    visible.value = true
    isCenterDirection.value = direction === 0
  })
}

watch(() => visible.value, (val) => {
  if (val) {
    emit('opend')
  } else {
    emit('closed')
  }
})

defineExpose({
  open,
  close,
  toggle,
  defaultOpen
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
  z-index: 999;
  &:hover {
    color: #a2a4a9;
    transform: rotate(-90deg);
  }
}
</style>
