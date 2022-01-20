<template>
  <div class="wrapper">
    <p class="tips">所有配置后的数据会保存到浏览器中，你可以点击下方按钮清除所有数据并恢复为初始状态，但注意数据删除后是<b>不可恢复</b>的，请谨慎操作!</p>
    <div class="button-wrapper">
      <button class="btn btn-danger" @click="show">删除所有数据</button>
    </div>
  </div>
  <animation-dialog
    ref="dialog"
    animationMode
    title="提示"
    width="300px"
    height="160px"
    :closeOnClickOutside="false"
    appendToBody
    v-bind="dialogOptions"
  >
    <p class="warn-text">❗ 数据删除后不可恢复，是否继续?</p>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button type="button" class="btn" @click="close">取消</button>
        <button type="button" class="btn btn-primary" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import useDialogOption from '@/hooks/useDialogOption'
export default defineComponent({
  name: 'CleanCache',
  setup() {
    const dialog = ref()
    const show = () => dialog.value.open()
    const close = () => dialog.value.close()
    const submit = () => {
      localStorage.removeItem('config')
      localStorage.removeItem('global')
      window.location.reload()
    }
    const dialogOptions = useDialogOption(true)
    return {
      dialog,
      show,
      close,
      submit,
      dialogOptions
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 10px;
  .tips {
    color: #787882;
    font-size: 14px;
    b {
      color: #c66;
    }
  }
  .button-wrapper {
    .btn-danger {
      margin: 10px 0;
    }
  }
}
.warn-text {
  color: #5e5e64;
}
</style>
