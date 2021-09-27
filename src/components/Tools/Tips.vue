<template>
  <el-tooltip effect="dark" placement="bottom" v-bind="$attrs">
    <template #content>
      <span v-if="$attrs.content">{{$attrs.content}}</span>
      <slot v-else></slot>
    </template>
    <i class="tips el-icon-warning-outline"></i>
  </el-tooltip>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Tips'
})
</script>
<style lang="scss" scoped>
.tips {
  font-size: 18px;
  margin-left: 8px;
  cursor: pointer;
}
</style>
