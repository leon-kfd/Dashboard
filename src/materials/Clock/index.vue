<template>
  <div
    class="wrapper"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      ...positionCSS
    }">
    {{now}}
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref, computed } from 'vue'
import { mapPosition } from '@/plugins/position-selector'
export default defineComponent({
  name: 'Clock',
  props: {
    componentSetting: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const now = ref(getNowTime())

    function getNowTime () {
      const h = new Date().getHours()
      const m = new Date().getMinutes()
      return `${h}:${m < 10 ? '0' + m : m}`
    }

    const refreshDuration = props.componentSetting?.duration || 5000
    const timer = window.setInterval(() => {
      now.value = getNowTime()
    }, refreshDuration)

    onUnmounted(() => {
      window.clearInterval(timer)
    })

    const positionCSS = computed(() => mapPosition(props.componentSetting.position))

    return {
      now,
      positionCSS
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}
</style>
