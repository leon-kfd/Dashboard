<template>
  <div class="radio-group">
    <input type="radio" name="background_mode" id="r_background_mode_1" :value="1" v-model="mode">
    <label for="r_background_mode_1">透明</label>
  </div>
  <div class="radio-group">
    <input type="radio" name="background_mode" id="r_background_mode_2" :value="2" v-model="mode">
    <label for="r_background_mode_2">纯色</label>
  </div>
  <div class="radio-group">
    <input type="radio" name="background_mode" id="r_background_mode_3" :value="3" v-model="mode">
    <label for="r_background_mode_3">渐变</label>
  </div>
  <div class="radio-group">
    <input type="radio" name="background_mode" id="r_background_mode_4" :value="4" v-model="mode">
    <label for="r_background_mode_4">图片</label>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'BackgroundSelector',
  setup () {
    const mode = ref(1)
    const onChange = (e:any) => {
      console.log(e);
    }
    return {
      mode,
      onChange
    }
  }
})
</script>
<style lang="scss" scoped>
.radio-group {
  display: inline-flex;
  margin-right: 10px;
  label {
    cursor: pointer;
    padding-left: 3px;
  }
}
</style>
