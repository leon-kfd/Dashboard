<template>
  <div class="form-item">
    <label>{{label}}</label>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'FormItem',
  props: {
    label: {
      type: String,
      default: ''
    }
  }
})
</script>
<style lang="scss" scoped>
.form-item {
  margin-bottom: 10px;
  label {
    // border-left: 3px solid #88aaff;
    // padding-left: 4px;
    // font-size: 16px;
    margin-bottom: 5px;
    font-weight: bold;
  }
}
</style>
