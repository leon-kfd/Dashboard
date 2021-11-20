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
    {{ verse }}
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { mapPosition } from '@/plugins/position-selector'
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

    const refreshDuration = (props.componentSetting?.duration || 5) * 60 * 1000
    let timer: number
    onMounted(() => {
      getVerse()
      timer = window.setInterval(getVerse, refreshDuration)
    })
    onUnmounted(() => {
      window.clearInterval(timer)
    })

    const positionCSS = computed(() => mapPosition(props.componentSetting.position))

    watch(() => verse.value, () => {
      if (verseElement.value && verseElement.value.animate) {
        verseElement.value.animate({ opacity: [0, 1] }, 400)
      }
    })

    return {
      verse,
      positionCSS,
      verseElement
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
