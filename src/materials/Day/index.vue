<template>
  <div
    class="wrapper"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS
    }">
    {{ day }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onUnmounted, ref, computed, watch } from 'vue'
import { mapPosition } from '@/plugins/position-selector'
import dayjs from 'dayjs'
export default defineComponent({
  name: 'Clock',
  props: {
    componentSetting: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    function getDayjsText () {
      let text = ''
      let formatterText = props.componentSetting.formatter === '自定义' ? props.componentSetting.custom : props.componentSetting.formatter
      try {
        if (props.componentSetting.chineseWeekDay && formatterText.includes('dddd')) {
          // 强制转换星期为中文
          const chineseWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
          formatterText = formatterText.replace('dddd', () => {
            try {
              return chineseWeek[new Date().getDay()]
            } catch {
              return 'dddd'
            }
          })
        }
        text = dayjs().format(formatterText)
      } catch (e) {
        text = 'Dayjs格式化失败，请检查格式化文本'
        console.error(e)
      }
      return text
    }
    const day = ref(getDayjsText())

    let timer:number
    function init() {
      day.value = getDayjsText();
      timer = window.setInterval(() => {
        day.value = getDayjsText()
      }, props.componentSetting?.duration * 1000 || 5000)
    }

    init()
    watch(() => [
      props.componentSetting.duration,
      props.componentSetting.formatter,
      props.componentSetting.custom,
      props.componentSetting.chineseWeekDay
    ], () => {
      window.clearInterval(timer)
      init()
    })

    onUnmounted(() => {
      window.clearInterval(timer)
    })

    const positionCSS = computed(() => mapPosition(props.componentSetting.position))

    return {
      day,
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
