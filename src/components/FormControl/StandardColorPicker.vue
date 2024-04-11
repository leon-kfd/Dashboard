<template>
  <div v-if="!isMobile" class="color-picker-wrapper">
    <el-color-picker v-bind="$attrs" />
    <label v-if="$attrs.modelValue" for="color">{{ $attrs.modelValue }}</label>
  </div>
  <el-input v-else v-bind="$attrs" :placeholder="$t('colorPlaceholder')" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
export default defineComponent({
  name: 'StandardColorPicker',
  setup() {
    const store = useStore()
    const isMobile = computed(() => store.isMobile)
    return {
      isMobile
    }
  }
})
</script>
<style scoped lang="scss">
.color-picker-wrapper {
  display: flex;
  align-items: center;
  label {
    font-weight: bold;
    padding-left: 10px;
    margin-bottom: 0;
  }
}
</style>
