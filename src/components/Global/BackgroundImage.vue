<template>
  <div
    class="wrapper"
    :style="{
      background: !backgroundURL ? background : 'none'
    }">
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
          'filter': filter
        }">
      </video>
    </div>
    <div v-if="backgroundURL" :class="['bg-media-wrapper', showBackgroundEffect && 'system-bg-effect']">
      <div :style="`width:100%;height:100%;filter:${filter}`">
        <img :src="backgroundURL" style="width: 100%;height: 100%;object-fit: cover;opacity: 0;" ref="bgDom" @load="handleImgLoad">
      </div>
      <i v-if="showRefreshBtn && backgroundURL.includes('randomPhoto')" class="el-icon-refresh btn-refresh" title="刷新背景图" @click="refresh"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { getFileType } from '@/utils'
import { ElNotification, NotifyPartial } from 'element-plus';
const props = defineProps({
  background: {
    type: String
  },
  filter: {
    type: String
  }
})

const t = ref(+new Date())
const getURL = (input: string) => {
  const reg = /url\(['"]?(.*?)['"]?\)/
  const match = input.match(reg)
  return match && match.length >= 2 ? match[1] : ''
}

const backgroundURL = computed(() => {
  if (props.background && props.background.includes('url')) {
    let url = getURL(props.background)
    url += `${url.includes('?') ? '&' : '?'}t=${t.value}`
    return url
  }
  return ''
})

let timer:any
watch(() => props.background, (val) => {
  if (val && val?.includes('randomPhoto')) {
    if (timer) clearInterval(timer)
    const url = getURL(val)
    const _url = new URL(url)
    const duration = ~~(_url.searchParams.get('duration') || 0)
    if (duration) {
      timer = setInterval(() => {
        refresh()
      }, duration * 1000)
    }
  }
}, {
  immediate: true
})

const videoURL = computed(() => {
  if (props.background && props.background.includes('url')) {
    const url = getURL(props.background)
    const fileType = getFileType(url)
    if (fileType && ['mp4', 'avi', 'wmv', 'mpg', 'mpeg', 'mov', 'ts', 'flv', 'webm'].includes(fileType)) {
      return url
    }
  }
  return ''
})

const bgDom = ref()
let leaveAnimation: Animation | null = null
const refresh = async () => {
  t.value = +new Date()
  if (bgDom.value) {
    if (!bgDom.value.animate) return
  }
  try {
    leaveAnimation = bgDom.value.animate([
      {
        filter: 'blur(20px)',
        tarnsform: 'scale(1,1)',
      },
      {
        filter: 'blur(60px)'
      },
    ], 400);
    if (leaveAnimation) {
      await leaveAnimation.finished
    }
    bgDom.value.style.filter = 'blur(60px)';
  } catch {
    // cancel
    console.log('cancel')
  }
}
const handleImgLoad = async () => {
  if (bgDom.value) {
    if (bgDom.value.style) bgDom.value.style.opacity = 1;
    if (!bgDom.value.animate) return
    if (leaveAnimation) leaveAnimation.cancel()
    const changeAnimation = bgDom.value.animate([
      {
        filter: 'blur(20px)',
        tarnsform: 'scale(1,1)'
      },
      {
        filter: 'blur(0)',
        tarnsform: 'scale(1)'
      },
    ], 400)
    await changeAnimation.finished
    if (bgDom.value.style) bgDom.value.style.filter = 'blur(0)';
  }
}

const store = useStore()
const handleVideoError = () => {
  (ElNotification as NotifyPartial)({
    title: '错误',
    type: 'error',
    message: '动态视频壁纸加载出错，请重试或更换视频源'
  })
  store.dispatch('resetGlobalBackground')
}

const showBackgroundEffect = computed(() => store.state.showBackgroundEffect)
const showRefreshBtn = computed(() => store.state.showRefreshBtn)

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
    transition: transform .3s ease-in-out, filter .3s ease-in-out;
    &.system-bg-effect {
      filter: blur(10px);
      transform: scale(1.08)
    }
  }
}
.bg-img {
  width: 100%;
  height: 100%;
  :deep {
    .el-image__inner {
      transform: scale(1.02);
      filter: var(--filter);
    }
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
  // background: linear-gradient(45deg, #515bec, #60dfd5, #8c60df, #f1a38b);
  // background: linear-gradient(45deg, #515bec, #f1a38b);
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
  color: $--color-white;
  cursor: pointer;
  &:hover {
    color: $--color-grey5;
  }
}
</style>
