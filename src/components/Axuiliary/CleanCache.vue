<template>
  <div class="wrapper">
    <p class="tips">{{$t('clearDataTips1')}}<b>{{$t('clearDataTips2')}}</b></p>
    <div class="button-wrapper">
      <button class="btn btn-danger" @click="show">{{$t('删除所有数据')}}</button>
    </div>
  </div>
  <animation-dialog
    ref="dialog"
    animationMode
    :title="$t('提示')"
    width="300px"
    height="200px"
    :closeOnClickOutside="false"
    appendToBody
    v-bind="dialogOptions"
  >
    <p class="warn-text">❗ {{$t('clearDataTips')}}</p>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button type="button" class="btn" @click="close">{{$t('取消')}}</button>
        <button type="button" class="btn btn-primary" @click="submit">{{$t('确认')}}</button>
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
