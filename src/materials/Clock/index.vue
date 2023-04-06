<template>
  <div
    class="wrapper material-clock"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS,
      ...textHollowStyle
    }">
    {{now}}
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref, computed, watch } from 'vue'
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

    let timer:number
    function init() {
      now.value = getNowTime()
      timer = window.setInterval(() => {
        now.value = getNowTime()
      }, props.componentSetting?.duration || 5000)
    }

    init()
    watch(() => props.componentSetting.duration, () => {
      window.clearInterval(timer)
      init()
    })

    onUnmounted(() => {
      window.clearInterval(timer)
    })

    const positionCSS = computed(() => mapPosition(props.componentSetting.position))
    const textHollowStyle = computed(() => props.componentSetting.textHollow ? {
      '-webkit-text-fill-color': props.componentSetting.textHollowBg,
      '-webkit-text-stroke': `${props.componentSetting.textHollowBorder}px ${props.componentSetting.textColor}`
    } : {})

    return {
      now,
      positionCSS,
      textHollowStyle
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
