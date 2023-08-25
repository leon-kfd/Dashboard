<template>
  <div
    class="wrapper material-iframe"
    :style="{
      borderRadius: element.borderRadius + 'px'
    }">
    <iframe
      v-if="componentSetting.url && refreshFlag"
      :src="url"
      :style="{
        width: '100%',
        height: '100%',
        pointerEvents: isLock ? 'all' : 'none'
      }"
      frameborder="0"></iframe>
    <Unset v-else :tips="`💫${$t('IFrame路径丢失，请进行配置')}`" />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch } from 'vue'
import Unset from '@/components/Tools/Unset.vue'
import { useStore } from '@/store'
const props = defineProps({
  element: {
    type: Object,
    required: true
  },
  componentSetting: {
    type: Object,
    required: true
  }
})

const url = computed(() => {
  if (!(/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(props.componentSetting.url))) {
    return 'http://' + props.componentSetting.url
  }
  return props.componentSetting.url
})
const store = useStore()
const isLock = computed(() => store.isLock)

const refreshFlag = ref(false)
const refreshIframe = async () => {
  refreshFlag.value = false
  await nextTick()
  refreshFlag.value = true
}
let timer: number | null
const refreshTimer = () => {
  refreshFlag.value = true
  const refreshDuration = (props.componentSetting.duration || 0) * 60 * 1000
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
  if (!refreshDuration) return
  timer = window.setInterval(refreshIframe, refreshDuration)
}
watch(
  () => props.componentSetting.duration,
  () => refreshTimer(),
  { immediate: true }
)
</script>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}
</style>
