<template>
  <div
    v-if="componentSetting.customText"
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
    {{componentSetting.customText}}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import setting from './setting'
export default defineComponent({
  name: 'Empty',
  props: {
    componentSetting: {
      type: Object,
      default: () => {
        return {
          ...setting.formData
        }
      }
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
