<template>
  <div
    class="wrapper"
    :style="{
      background: !backgroundURL ? background : 'none'
    }"
  >
    <div v-if="videoURL" :class="['bg-media-wrapper', showBackgroundEffect && 'system-bg-effect']">
      <video
        class="bg-video"
        :src="videoURL"
        autoplay
        muted
        loop
        playsinline
        disablePictureInPicture
        disableRemotePlayback
        @error="handleVideoError"
        :style="{
          filter: filter
        }"
      ></video>
    </div>
    <div
      v-else-if="realBackgroundURL"
      :class="['bg-media-wrapper', showBackgroundEffect && 'system-bg-effect']"
    >
      <div :style="`width:100%;height:100%;filter:${filter}`">
        <img
          class="global-bg-img"
          :src="realBackgroundURL"
          style="width: 100%; height: 100%; object-fit: cover; opacity: 0"
          ref="bgDom"
          @load="handleImgLoad"
        />
      </div>
      <Icon
        v-if="showRefreshBtn && backgroundURL.includes('randomPhoto')"
        name="refresh"
        class="btn-refresh"
        :title="$t('刷新背景图')"
        size="20"
        @click="refresh"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useStore } from '@/store'
import { getFileType } from '@/utils'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
const props = defineProps({
  background: {
    type: String
  },
  filter: {
    type: String
  }
})

const { t } = useI18n()

const time = ref(+new Date())
const getURL = (input: string) => {
  const reg = /url\(['"]?(.*?)['"]?\)/
  const match = input.match(reg)
  return match && match.length >= 2 ? match[1] : ''
}

const backgroundURL = computed(() => {
  if (props.background && props.background.includes('url')) {
    let url = getURL(props.background)
    url += `${url.includes('?') ? '&' : '?'}t=${time.value}`
    return url
  }
  return ''
})

let timer: any
watch(
  () => props.background,
  (val) => {
    if (val && val?.includes('randomPhoto')) {
      if (timer) clearInterval(timer)
      const url = getURL(val)
      const _url = new URL(url)
      const duration = ~~(_url.searchParams.get('duration') || 0)
      if (duration) {
        timer = setInterval(
          () => {
            refresh()
          },
          duration < 30 ? 30 * 1000 : duration * 1000
        )
      }
    }
  },
  {
    immediate: true
  }
)

const realBackgroundURL = ref(localStorage.getItem('cacheBackgroundURL') || '')
watch(
  () => backgroundURL.value,
  async (val) => {
    if (val && val?.includes('randomPhoto')) {
      try {
        let target = val
        if (import.meta.env.DEV) {
          target = target.replace('https://kongfandong.cn', '/api') // For Dev Proxy
        }
        const res = await fetch(`${target}&json=1`)
        const json = await res.json()
        realBackgroundURL.value = json.url
        localStorage.setItem('cacheBackgroundURL', json.url)
      } catch (e) {
        console.error(e)
        realBackgroundURL.value = val
        localStorage.removeItem('cacheBackgroundURL')
      }
    } else {
      realBackgroundURL.value = val
      localStorage.removeItem('cacheBackgroundURL')
    }
  },
  {
    immediate: true
  }
)

const videoURL = computed(() => {
  if (props.background && props.background.includes('url')) {
    const url = getURL(props.background)
    const fileType = getFileType(url)
    if (
      fileType &&
      ['mp4', 'avi', 'wmv', 'mpg', 'mpeg', 'mov', 'ts', 'flv', 'webm'].includes(fileType)
    ) {
      return url
    }
  }
  return ''
})

const bgDom = ref()
let leaveAnimation: Animation | null = null
const refresh = async () => {
  time.value = +new Date()
  if (bgDom.value) {
    if (!bgDom.value.animate) return
  }
  try {
    leaveAnimation = bgDom.value.animate(
      [
        {
          filter: 'blur(20px)',
          tarnsform: 'scale(1,1)'
        },
        {
          filter: 'blur(60px)'
        }
      ],
      400
    )
    if (leaveAnimation) {
      await leaveAnimation.finished
    }
    bgDom.value.style.filter = 'blur(60px)'
  } catch {
    // cancel
    console.log('cancel')
  }
}
const handleImgLoad = async () => {
  if (bgDom.value) {
    if (bgDom.value.style) bgDom.value.style.opacity = 1
    if (!bgDom.value.animate) return
    if (leaveAnimation) leaveAnimation.cancel()
    const changeAnimation = bgDom.value.animate(
      [
        {
          filter: 'blur(20px)',
          tarnsform: 'scale(1,1)'
        },
        {
          filter: 'blur(0)',
          tarnsform: 'scale(1)'
        }
      ],
      400
    )
    await changeAnimation.finished
    if (bgDom.value.style) bgDom.value.style.filter = 'blur(0)'
  }
}

const store = useStore()
const handleVideoError = () => {
  ElNotification({
    title: t('错误'),
    type: 'error',
    message: t('动态视频壁纸加载出错，请重试或更换视频源')
  })
  // store.resetGlobalBackground()
}

const showBackgroundEffect = computed(() => store.showBackgroundEffect)
const showRefreshBtn = computed(() => store.showRefreshBtn)

defineExpose({
  refresh
})
</script>
<style lang="scss" scoped>
.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: 0;
  overflow: hidden;
  .bg-media-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    transition: transform 0.3s ease-in-out, filter 0.3s ease-in-out;
    &.system-bg-effect {
      filter: blur(10px);
      transform: scale(1.08);
    }
  }
}
.bg-img {
  width: 100%;
  height: 100%;
  :deep(.el-image__inner) {
    transform: scale(1.02);
    filter: var(--filter);
  }
}
.bg-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.bg-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #12c2e9, #c471ed, #f64f59);
  background-size: 400% 400%;
  animation: bgmove 15s ease infinite;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: #e7e7e7;
  font-size: 14px;
  padding-bottom: 30px;
}
.btn-refresh {
  position: absolute;
  left: 16px;
  bottom: 16px;
  font-size: 20px;
  z-index: 20;
  color: $color-white;
  cursor: pointer;
  &:hover {
    color: $color-grey5;
  }
}
</style>
