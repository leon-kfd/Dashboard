<template>
  <div class="setting-btn" @click="handleOpenSetting">Setting</div>
  <animation-dialog ref="dialog" :animationMode="true" title="添加组件" width="400px">
    <form action="#">
      <FormItem label="Size">
        <div class="form-control">
          <input type="number" class="input-number" v-model="formData.sizeWidth" @blur="checkSize('sizeWidth')">
          <svg class="divider" viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M755.2 832L512 588.8 268.8 832 192 755.2 435.2 512 192 268.8 268.8 192 512 435.2 755.2 192 832 268.8 588.8 512l243.2 243.2-76.8 76.8z" fill="#292929"></path>
          </svg>
          <input type="number" class="input-number" v-model="formData.sizeHeight" @blur="checkSize('sizeHeight')">
        </div>
      </FormItem>
      <FormItem label="Background">
        <BackgroundSelector />
      </FormItem>
    </form>
  </animation-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import AnimationDialog from '@howdyjs/animation-dialog'
import FormItem from  './FormItem.vue'
import BackgroundSelector from './BackgroundSelector.vue'
export default defineComponent({
  name: 'Setting',
  components: {
    AnimationDialog,
    FormItem,
    BackgroundSelector
  },
  setup() {
    const dialog = ref()
    const handleOpenSetting = () => {
      dialog.value.open()
    }
    const formData = reactive({
      sizeWidth: 4,
      sizeHeight: 4
    })
    const checkSize = (key: 'sizeWidth' | 'sizeHeight') => {
      if (!(formData[key] > 0 && formData[key] <= 24)) {
        formData[key] = 4
      }
    }
    return {
      dialog,
      handleOpenSetting,
      formData,
      checkSize
    }
  }
})
</script>
<style lang="scss" scoped>
.setting-btn {
  position: fixed;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
}
.form-control {
  display: flex;
  align-items: center;
  .input-number {
    font-weight: bold;
    width: 40px;
    text-align: center;
  }
  .divider {
    margin: 0 10px
  }
}
</style>
