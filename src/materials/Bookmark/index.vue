<template>
  <div
    class="wrapper"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      padding: componentSetting.padding + 'px'
    }">
    {{componentSetting.customText}}
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  componentSetting: {
    type: Object,
    required: true
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
