<template>
  <div class="wrapper">
    {{text}}
  </div>
  <!-- <Unset /> -->
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Unset from '@/components/Unset.vue'
export default defineComponent({
  name: 'Empty',
  components: {
    Unset
  },
  props: {
    text: {
      type: String,
      default: ''
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  padding: 20px;
  display: grid;
  place-items: center;
  position: relative;
}
</style>
