<template>
  <div
    v-if="componentSetting.customText"
    class="wrapper material-empty"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS
    }">
    {{componentSetting.customText}}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { mapPosition } from '@/plugins/position-selector'
export default defineComponent({
  name: 'Empty',
  props: {
    componentSetting: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const positionCSS = computed(() => mapPosition(props.componentSetting.position))
    return {
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
