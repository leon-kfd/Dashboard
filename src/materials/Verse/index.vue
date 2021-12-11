<template>
  <div
    class="wrapper"
    ref="verseElement"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS
    }">
    <span :style="componentSetting.clickActionType ? 'cursor: pointer' : ''" @click="handleClickAction">{{ verse }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { mapPosition } from '@/plugins/position-selector'
import { execCopy } from '@/utils'
import { ElNotification, NotifyPartial } from 'element-plus';
export default defineComponent({
  name: 'Verse',
  props: {
    componentSetting: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const verse = ref('')
    const verseElement = ref()

    async function getVerse () {
      try {
        const res = await fetch('https://v1.jinrishici.com/all.json')
        const { content } = await res.json()
        verse.value = content
      } catch {
        //
      }
    }

    let timer: number | null
    const refreshTimer = () => {
      const refreshDuration = (props.componentSetting.duration || 5) * 60 * 1000
      if (timer) {
        window.clearInterval(timer)
        timer = null
      }
      timer = window.setInterval(getVerse, refreshDuration)
    }
    watch(() => props.componentSetting.duration, () => refreshTimer(), { immediate: true })
    onMounted(() => getVerse())
    onUnmounted(() => timer && window.clearInterval(timer))

    const positionCSS = computed(() => mapPosition(props.componentSetting.position))

    watch(() => verse.value, () => {
      if (verseElement.value && verseElement.value.animate) {
        verseElement.value.animate({ opacity: [0, 1] }, 400)
      }
    })

    const handleClickAction = () => {
      if (props.componentSetting.clickActionType === 1) {
        getVerse()
        refreshTimer()
      } else if (props.componentSetting.clickActionType === 2) {
        window.open(`https://hanyu.baidu.com/s?wd=${encodeURIComponent(verse.value)}`)
      } else if (props.componentSetting.clickActionType === 3) {
        if (execCopy(verse.value)) {
          (ElNotification as NotifyPartial)({
            title: '提示',
            type: 'success',
            message: '复制成功'
          })
        }
      }
    }

    return {
      verse,
      positionCSS,
      verseElement,
      handleClickAction
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
