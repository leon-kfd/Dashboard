<template>
  <el-alert
    v-if="$store.state.hiddenWarnLockTips"
    title="编辑完成后请点击锁定防止误操作!"
    type="warning"
    close-text="知道了"
    @close="close"
    style="margin-bottom: 8px;"></el-alert>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'WarnLock',
  setup() {
    const store = useStore()
    const close = () => {
      store.commit('updateHiddenWarnLockTips', '1')
    }
    return {
      close
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
