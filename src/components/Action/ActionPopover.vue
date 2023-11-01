<template>
  <teleport to="body">
    <transition name="zoomIn" :css="!isLowPreformance">
      <div
        v-if="visible"
        ref="actionPopover"
        class="action-popover"
        :class="popoverCustomClass"
        :style="{
          width: `min(${rectInfo.width}px, 90vw)`,
          height: `min(${rectInfo.height}px, 90vh)`,
          top: `${rectInfo.top}px`,
          left: `${rectInfo.left}px`,
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
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { getPopoverActivePointByDirection } from '@/utils/direction'
import { useStore } from '@/store'
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
const emit = defineEmits(['opened', 'closed', 'startClose'])

const visible = ref(false)
const isCenterDirection = ref(false)
const transformOriginStr = ref('')

const store = useStore()
const isLowPreformance = computed(() => store.global.disabledDialogAnimation)

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

let timer: number | null = null
const resetPosition = () => {
  if (timer) clearTimeout(timer as number)
  timer = setTimeout(() => {
    const newTop = (window.innerHeight - rectInfo.value.height) / 2
    const newLeft = (window.innerWidth - rectInfo.value.width) / 2
    rectInfo.value.top = newTop
    rectInfo.value.left = newLeft
  }, 200)
}

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
      if (isCenterDirection.value) {
        window.addEventListener('resize', resetPosition, true)
      }
    }
  })
}
const close = () => {
  if (isCenterDirection.value) {
    window.removeEventListener('resize', resetPosition, true)
  }
  emit('startClose')
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

const defaultOpen = ({ w, h, direction }: any, element?: HTMLElement) => {
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
    if (isCenterDirection.value) {
      window.addEventListener('resize', resetPosition, true)
    }
  })
}

watch(() => visible.value, (val) => {
  if (val) {
    setTimeout(() => emit('opened'), 400)
  } else {
    setTimeout(() => emit('closed'), 400)
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
  color: #f4f4f4;
  position: absolute;
  top: 0;
  right: -40px;
  cursor: pointer;
  border-radius: 4px;
  filter: drop-shadow(0 0 1px #262626);
  z-index: 999;
  // transition: transform .3s ease-in-out;
  &:hover {
    background: rgba(255,255,255,0.1);
    // transform: rotate(-90deg);
  }
}
</style>
