<template>
  <teleport to="body">
    <transition name="fadeIn" :css="!isLowPreformance">
      <div
        v-if="visible"
        :class="[
          'easy-dialog-wrapper',
          (!blur || isLowPreformance) && 'low-performance',
          customWrapperClass
        ]"
        @click.self="clickOutsideEvent"
      />
    </transition>
    <transition name="zoomIn" :css="!isLowPreformance">
      <div
        v-if="visible"
        :class="['easy-dialog-main', customClass]"
        :style="{
          width: rectInfo.width + 'px',
          height: rectInfo.height + 'px',
          top: rectInfo.top + 'px',
          left: rectInfo.left + 'px',
          transformOrigin: transformOriginStr
        }"
      >
        <div v-if="$slots.title || title" class="easy-dialog-title">
          <slot name="title">
            <div class="easy-dialog-static-title">
              {{ title }}
            </div>
          </slot>
        </div>
        <slot name="close">
          <div
            :class="['easy-dialog-close', !$slots.title && !title && 'outside-close']"
            @click.prevent="close(true)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
              <path
                fill="currentColor"
                d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z"
              />
            </svg>
          </div>
        </slot>
        <div class="easy-dialog-body">
          <slot></slot>
        </div>
        <div v-if="$slots.footer" class="easy-dialog-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
    <div class="easy-dialog-static" ref="staticRect" :style="{ width, height }" />
  </teleport>
</template>
<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useStore } from '@/store'
const props = defineProps({
  width: {
    type: String,
    default: '60vw'
  },
  height: {
    type: String,
    default: '70vh'
  },
  customWrapperClass: String,
  customClass: String,
  closeOnClickOutside: {
    type: Boolean,
    default: false
  },
  closeOnPressEscape: {
    type: Boolean,
    default: true
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  title: String,
  listenWindowSizeChange: {
    type: Boolean,
    default: true
  },
  debounceWait: {
    type: Number,
    default: 200
  },
  blur: {
    type: Boolean,
    default: true
  }
})
const emit = defineEmits(['close', 'update:modelValue'])

const visible = ref(false)
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      open()
    } else {
      close()
    }
  }
)

const store = useStore()
const isLowPreformance = computed(() => store.global.disabledDialogAnimation)

const transformOriginStr = ref('')

const staticRect = ref()
const clickOutsideEvent = () => {
  if (!props.closeOnClickOutside) return
  emit('update:modelValue', false)
}

const rectInfo = ref({
  width: 200,
  height: 200,
  top: 0,
  left: 0
})

let timerId: number | null = null
const isClicked = ref(false)
const mousePosition = ref({ x: 0, y: 0 })
const onMouseClick = (e: MouseEvent) => {
  if (!visible.value) {
    if (timerId !== null) window.clearTimeout(timerId)
    isClicked.value = true
    timerId = window.setTimeout(() => {
      isClicked.value = false
    }, 64)
    mousePosition.value = { x: e.clientX, y: e.clientY }
  }
}
const onKeyDown = (e: KeyboardEvent) => {
  if (props.closeOnPressEscape && e.key === 'Escape' && props.modelValue) {
    emit('update:modelValue', false)
  }
}

let timer: number | null = null
const resetSize = () => {
  if (visible.value) {
    if (timer) clearTimeout(timer as number)
    timer = setTimeout(() => open(), props.debounceWait)
  }
}

const open = async (needEmit = false) => {
  setTimeout(() => {
    if (!staticRect.value) return
    const { width, height } = (staticRect.value as HTMLElement).getBoundingClientRect()
    const fromX = (isClicked.value && mousePosition.value.x) || window.innerWidth / 2
    const fromY = (isClicked.value && mousePosition.value.y) || window.innerHeight / 2
    const endX = window.innerWidth / 2 - width / 2
    const endY = window.innerHeight / 2 - height / 2
    rectInfo.value = {
      width,
      height,
      left: endX,
      top: endY
    }
    transformOriginStr.value = `${fromX - endX}px ${fromY - endY}px`
    visible.value = true
    if (needEmit) emit('update:modelValue', true)
  })

  document.addEventListener('click', onMouseClick)
  document.addEventListener('keydown', onKeyDown)
  if (props.listenWindowSizeChange) window.addEventListener('resize', resetSize, true)
}

const close = (needEmit = false) => {
  visible.value = false
  if (needEmit) emit('update:modelValue', false)

  document.removeEventListener('click', onMouseClick)
  document.removeEventListener('keydown', onKeyDown)
  if (props.listenWindowSizeChange) window.removeEventListener('resize', resetSize, true)
  emit('close')
}
</script>

<style lang='scss' scoped>
.easy-dialog-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 2000;
  backdrop-filter: blur(10px);
  &.low-performance {
    backdrop-filter: none;
  }
}
.easy-dialog-main {
  position: fixed;
  min-width: 40px;
  min-height: 40px;
  z-index: 2000;
  transition: all 0.4s ease-in-out;
  background: #fff;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  .easy-dialog-title {
    .easy-dialog-static-title {
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      font-weight: bold;
      position: relative;
      padding-left: 20px;
      &:after {
        content: '';
        position: absolute;
        border-left: 4px solid $color-primary;
        height: 20px;
        top: 14px;
        left: 10px;
      }
    }
  }
  .easy-dialog-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    color: #b6b7b9;
    position: absolute;
    top: 8px;
    right: 4px;
    cursor: pointer;
    transition: transform 0.3s ease-in-out;
    &:hover {
      color: #8d8f94;
      background: #f5f5f5;
    }
    &.outside-close {
      top: 0;
      right: -32px;
      color: #c8c8c8;
      &:hover {
        color: #e9e9e9;
        background: none;
        transform: rotate(90deg);
      }
    }
  }
  .easy-dialog-body {
    height: 100%;
    flex: 1;
    overflow-y: auto;
    padding: 5px 10px;
    font-size: 16px;
  }
}
.easy-dialog-static {
  position: fixed;
  left: -9999px;
  top: -9999px;
  visibility: hidden;
}

.zoomIn-enter-active {
  animation: zoomInCustom 0.3s forwards cubic-bezier(0.075, 0.82, 0.165, 1);
}
.zoomIn-leave-active {
  animation: zoomInCustom 0.3s reverse forwards ease-in-out;
}
@keyframes zoomInCustom {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fadeIn-enter-active {
  animation: fadeInCustom 0.4s;
}
.fadeIn-leave-active {
  animation: fadeInCustom 0.4s reverse;
}
.fadeOut-leave-active {
  animation: fadeInCustom 0.4s reverse;
}
@keyframes fadeInCustom {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
