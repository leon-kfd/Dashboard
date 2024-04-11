<template>
  <el-alert
    v-if="!hiddenWarnLockTips"
    :title="$t('warnLockTips')"
    type="warning"
    :close-text="$t('知道了')"
    style="margin-bottom: 8px"
    @close="close"
  />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useStore } from '@/store'
export default defineComponent({
  name: 'WarnLock',
  setup() {
    const store = useStore()
    const hiddenWarnLockTips = computed(() => store.hiddenWarnLockTips)
    const close = () => {
      store.updateState({ key: 'hiddenWarnLockTips', value: '1' })
    }
    return {
      hiddenWarnLockTips,
      close
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
