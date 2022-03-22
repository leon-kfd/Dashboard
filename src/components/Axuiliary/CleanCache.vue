<template>
  <div class="wrapper">
    <p class="tips">{{$t('clearDataTips1')}}<b>{{$t('clearDataTips2')}}</b></p>
    <div class="button-wrapper">
      <button class="btn btn-danger" @click="show">{{$t('删除所有数据')}}</button>
    </div>
  </div>
  <easy-dialog
    v-model="dialogVisible"
    :title="$t('提示')"
    width="300px"
    height="200px"
  >
    <p class="warn-text">❗ {{$t('clearDataTips')}}</p>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button type="button" class="btn" @click="close">{{$t('取消')}}</button>
        <button type="button" class="btn btn-primary" @click="submit">{{$t('确认')}}</button>
      </div>
    </template>
  </easy-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
export default defineComponent({
  name: 'CleanCache',
  setup() {
    const dialogVisible = ref(false)
    const show = () => {
      dialogVisible.value = true
    }
    const close = () => {
      dialogVisible.value = false
    }
    const submit = () => {
      localStorage.removeItem('config')
      localStorage.removeItem('global')
      window.location.reload()
    }
    return {
      dialogVisible,
      show,
      close,
      submit
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
