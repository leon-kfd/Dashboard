<template>
  <div 
    class="wrapper" 
    :class="{
      center: componentSetting.isCenter
    }"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px'
    }">
    {{now}}
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref } from 'vue'
import setting from './setting'
export default defineComponent({
  name: 'Clock',
  props: {
    componentSetting: {
      type: Object,
      default: () => {
        return {
          ...setting.formData
        }
      }
    }
  },
  setup(props) {
    let timer:number
    const now = ref(getNowTime())

    function getNowTime () {
      const h = new Date().getHours()
      const m = new Date().getMinutes()
      return `${h}:${m < 10 ? '0' + m : m}`
    }

    const refreshDuration = props.componentSetting?.duration || 5000
    timer = window.setInterval(() => {
      now.value = getNowTime()
    }, refreshDuration)

    onUnmounted(() => {
      window.clearInterval(timer)
    })

    return {
      now
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
