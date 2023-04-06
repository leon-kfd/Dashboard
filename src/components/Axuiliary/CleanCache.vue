<template>
  <div class="wrapper">
    <p class="tips">{{$t('clearDataTips1')}}<b>{{$t('clearDataTips2')}}</b></p>
    <div class="button-wrapper">
      <button class="btn btn-danger" @click="showConfirm">{{$t('删除所有数据')}}</button>
    </div>
  </div>
  <Confirm ref="confirmRef" />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { isSupportIndexDB, localImg, localThumbImg } from '@/plugins/local-img'
import { useI18n } from 'vue-i18n'
import Confirm from '@/components/Tools/Confirm.vue'

const { t } = useI18n()
const confirmRef = ref()

const showConfirm = async () => {
  try {
    await confirmRef.value.confirm(`❗ ${t('clearDataTips')}`, { height: 150 })
    localStorage.removeItem('config')
    localStorage.removeItem('global')
    if (isSupportIndexDB) {
      await localImg.clear()
      await localThumbImg.clear()
    }
    window.location.reload()
  } catch (e) {
    if (e) {
      console.error(e)
    }
  }
}
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
