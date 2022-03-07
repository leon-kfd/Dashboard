<template>
  <div v-if="!isMobile" class="color-picker-wrapper">
    <el-color-picker v-bind="$attrs"></el-color-picker>
    <label for="color" v-if="$attrs.modelValue">{{ $attrs.modelValue }}</label>
  </div>
  <el-input v-else v-bind="$attrs" placeholder="请输入合法的颜色值"></el-input>
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
    // text-transform: uppercase;
    margin-bottom: 0;
  }
}
</style>
