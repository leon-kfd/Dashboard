<template>
  <div class="unset-wrapper">
    {{ tips || '🔨Wait for setting' }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'Unset',
  props: {
    tips: {
      type: String
    }
  }
})
</script>
<style lang="scss" scoped>
.unset-wrapper {
  @include flex-center;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0,0,0,.48);
  flex-direction: column;
  z-index: 2;
  color: #fff;
  padding: 8px;
  font-size: 14px;
}
</style>
