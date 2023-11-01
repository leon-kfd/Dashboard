<template>
  <div
    class="wrapper material-iframe"
    ref="iframeWrapper"
    :style="{
      borderRadius: element.borderRadius + 'px'
    }">
    <template v-if="!needUseCache">
      <iframe
        v-if="componentSetting.url && refreshFlag"
        ref="iframe"
        :src="url"
        :style="{
          width: '100%',
          height: '100%',
          pointerEvents: isLock ? 'all' : 'none'
        }"
        frameborder="0"></iframe>
      <Unset v-else :tips="`💫${$t('IFrame路径丢失，请进行配置')}`" />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, watch, onBeforeUnmount, onMounted } from 'vue'
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
const isLowPreformance = computed(() => store.global.disabledDialogAnimation)

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


// Iframe Cache, 将Iframe Dom移到body中用以后续打开后复用
const needUseCache = ref(false)
const iframe = ref()
const iframeWrapper = ref<HTMLElement>()

onMounted(() => {
  if (window.iframeCache && window.iframeCache.has(props.componentSetting.url)) {
    if(iframeWrapper.value) iframeWrapper.value.style.background = '#fff'
    needUseCache.value = true
    const cacheIframe = window.iframeCache.get(props.componentSetting.url)
    const dialogDelay = isLowPreformance.value ? 10 : 410
    setTimeout(() => {
      if (iframeWrapper.value) {
        const { top, left, width, height } = iframeWrapper.value.getBoundingClientRect()
        cacheIframe.style.cssText = `position: fixed;top:${top}px;left:${left}px;width:${width}px;height:${height}px;pointer-events: all;z-index: 10001;display: block;`
      }
    }, dialogDelay)
  }
})

onBeforeUnmount(() => {
  if (!window.iframeCache) {
    window.iframeCache = new Map()
  }
  if (!window.iframeCache.has(props.componentSetting.url) && props.componentSetting.useCache) {
    window.iframeCache.set(props.componentSetting.url, iframe.value)
    iframe.value.style.display = 'none'
    document.body.appendChild(iframe.value)
  }
  if (needUseCache.value) {
    if(iframeWrapper.value) iframeWrapper.value.style.background = '#fff'
    const cacheIframe = window.iframeCache.get(props.componentSetting.url)
    cacheIframe.style.display = 'none'
  }
})
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
