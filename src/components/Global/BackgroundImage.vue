<template>
  <div
    class="bg-img-wrapper"
    :style="{
      background: !backgroundURL ? background : 'none'
    }"
  >
    <div v-if="videoURL" :class="['bg-media-wrapper', showBackgroundEffect && 'system-bg-effect']">
      <video
        class="bg-video"
        crossorigin="anonymous"
        :src="videoURL"
        autoplay
        muted
        loop
        playsinline
        disablePictureInPicture
        disableRemotePlayback
        :style="{
          filter: filter
        }"
        @error="handleVideoError"
      />
    </div>
    <div v-else-if="iframeURL" :class="['bg-media-wrapper', showBackgroundEffect && 'system-bg-effect']">
      <iframe 
        class="bg-iframe" 
        :src="iframeURL" 
        frameborder="0"
        :style="{
          width: '100%',
          height: '100%',
          pointerEvents: isLock ? 'all' : 'none'
        }"
      />
    </div>
    <div
      v-else-if="realBackgroundURL"
      :class="['bg-media-wrapper', showBackgroundEffect && 'system-bg-effect']"
    >
      <div class="bg-media-filter" :style="`width:100%;height:100%;filter:${filter}`">
        <img
          ref="bgDom"
          class="global-bg-img"
          :crossorigin="imgCrossorigin"
          :src="realBackgroundURL"
          style="width: 100%; height: 100%; object-fit: cover; opacity: 0"
          @load="handleImgLoad"
          @error="hanleImgError"
        >
      </div>
      <div class="icon-wrapper">
        <div v-if="showRefreshBtn && (backgroundURL.includes('randomPhoto') || backgroundURL.includes('localImg'))" class="icon-item" :title="$t('刷新壁纸')">
          <Icon
            name="refresh"
            class="btn-refresh"
            size="20"
            @click="refresh"
          />
        </div>
        <div v-if="showRefreshBtn && backgroundURL.includes('randomPhoto')" class="icon-item" :title="$t('喜欢')">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="20"
            height="20"
            :class="['btn-heart', hasLike && 'active']"
            :title="$t('喜欢')"
            @click="like"
          >
            <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z" />
            <path d="M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z" />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch, onMounted } from 'vue'
import { useStore } from '@/store'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import Icon from '../Tools/Icon.vue'
import { isSupportIndexDB, localImg, cacheBackgroundImg, setCacheBgImg } from '@/plugins/local-img'
import request from '@/utils/request'
const props = defineProps({
  background: {
    type: String
  },
  filter: {
    type: String
  }
})

const { t } = useI18n()
const store = useStore()

const time = ref(+new Date())
const getURL = (input: string) => {
  const reg = /url\(['"]?(.*?)['"]?\)/
  const match = input.match(reg)
  return match && match.length >= 2 ? match[1] : ''
}

const backgroundURL = computed(() => {
  if (props.background && props.background.includes('url')) {
    let url = getURL(props.background)
    if (url.includes('random') || url.includes('localImg')) {
      url += `${url.includes('?') ? '&' : '?'}t=${time.value}`
    }
    return url
  }
  return ''
})

let timer: ReturnType<typeof setInterval>
watch(
  () => props.background,
  (val) => {
    if (val && (val.includes('randomPhoto') || val.includes('localImg'))) {
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
    } else {
      if (timer) clearInterval(timer)
    }
  },
  {
    immediate: true
  }
)

const realBackgroundURL = computed(() => store.realBackgroundURL)

const imgCrossorigin = computed(() => {
  if(props.background && props.background.includes('randomPhoto')) return 'anonymous'
  return undefined
})

watch(
  () => backgroundURL.value,
  () => updateBackground()
)
let directToUnsplash = false // 是否直连到Unsplash获取随机图
const updateBackground = async () => {
  const val = backgroundURL.value
  if (val && val.includes('randomPhoto')) {
    try {
      let result
      if (val.includes('personal')) {
        // 从个人壁纸库随机一张
        const index = ~~(Math.random() * store.wallpaperCollectionList.length)
        result = store.wallpaperCollectionList[index]
        if (result === realBackgroundURL.value) {
          // 随机出的图片跟原本一致会导致onload不执行
          setTimeout(() => {
            if (bgDom.value.style) bgDom.value.style.filter = 'blur(0)'
          }, 500)
        }
      } else {
        let target = val
        if (import.meta.env.DEV) target = target.replace('https://kongfandong.cn', '') // For Dev Proxy
        // Unsplash优先使用直连获取
        if (target.includes('keyword=') && directToUnsplash) {
          try {
            const search = new URLSearchParams(target.split('?')[1])
            const keyword = search.get('keyword')
            const w = search.get('w')
            const h = search.get('h')
            const isMirror = search.get('type') === 'mirror'
            const directURL = `https://source.unsplash.com/random/${w}x${h}/?${keyword}`
            const res = await request({ url: directURL, method: 'head', return: 'response' })
            if (res.status === 404) throw new Error('404')
            result = isMirror ? res.url.replace('images.unsplash.com', 'dogefs.s3.ladydaily.com/~/source/unsplash') :res.url
          } catch {
            directToUnsplash = false // 当直连Unsplash失败时直接API接口
            const res = await request({ url: `${target}&json=1` })
            result = res.url
          }
        } else {
          const res = await request({ url: `${target}&json=1` })
          result = res.url
        }
      }
      store.updateState({ key: 'realBackgroundURL', value: result })
    } catch (e) {
      console.error(e)
      store.updateState({ key: 'realBackgroundURL', value: val })
    }
  } else if (val && val.includes('localImg')) {
    const imgList = await localImg.keys()
    const index = ~~(Math.random() * imgList.length)
    const result: string | null = await localImg.getItem(imgList[index])
    if (result) {
      if (result === realBackgroundURL.value) {
        setTimeout(() => {
          if (bgDom.value.style) bgDom.value.style.filter = 'blur(0)'
        }, 500)
      }
      store.updateState({ key: 'realBackgroundURL', value: result })
    } else {
      store.updateState({ key: 'realBackgroundURL', value: 'https://images.unsplash.com/photo-1612342222980-e549ae573834' })
    }
  } else {
    store.updateState({ key: 'realBackgroundURL', value: val })
  }
}

const videoURL = computed(() => {
  if (props.background && props.background.includes('url')) {
    const url = getURL(props.background)
    if (['.mp4', '.webm', '.flv', '.avi', 'video'].some(item => url.includes(item))) {
      return url
    }
  }
  return ''
})

const iframeURL = computed(() => {
  if (props.background && props.background.includes('url')) {
    const url = getURL(props.background)
    if (['.html', 'static.howdz.xyz', 'iframe='].some(item => url.includes(item))) {
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
    // Set cache background to indexDB when is in random photo mode
    if (backgroundURL.value && backgroundURL.value.includes('randomPhoto') && isSupportIndexDB) {
      setCacheBgImg(bgDom.value)
    }
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

let loadFirstError = false
const hanleImgError = async () => {
  if (loadFirstError) return
  if (isSupportIndexDB) {
    const localCacheImg = await cacheBackgroundImg.getItem('img')
    store.updateState({ key: 'realBackgroundURL', value: localCacheImg })
  }
  loadFirstError = true
}

const handleVideoError = () => {
  ElNotification({
    title: t('错误'),
    type: 'error',
    message: t('动态视频壁纸加载出错，请重试或更换视频源')
  })
}

const like = () => {
  let bgURL = realBackgroundURL.value
  if (bgURL.includes('ixid=')) {
    // unsplash随机图的ixid每次不一样，为识别为同一张图需去除
    bgURL = bgURL.replace(/&ixid=.+?&/, '&')
  }
  const index = store.wallpaperCollectionList.indexOf(bgURL)
  if (~index) {
    store.wallpaperCollectionList.splice(index, 1)
  } else {
    if (store.wallpaperCollectionList.length < 100) {
      store.wallpaperCollectionList.unshift(bgURL)
    } else {
      store.wallpaperCollectionList.pop()
      store.wallpaperCollectionList.unshift(bgURL)
    }
  }
}
const hasLike = computed(() => {
  let bgURL = realBackgroundURL.value
  if (bgURL.includes('ixid=')) {
    // unsplash随机图的ixid每次不一样，为识别为同一张图需去除
    bgURL = bgURL.replace(/&ixid=.+?&/, '&')
  }
  return ~store.wallpaperCollectionList.indexOf(bgURL)
})

const showBackgroundEffect = computed(() => store.showBackgroundEffect)
const showRefreshBtn = computed(() => store.showRefreshBtn)
const isLock = computed(() => store.isLock)

onMounted(async () => {
  let localCacheImg: string | null = ''
  if (props.background && props.background.includes('randomPhoto') && isSupportIndexDB) {
    localCacheImg = await cacheBackgroundImg.getItem('img')
  }
  if (localCacheImg) {
    store.updateState({ key: 'realBackgroundURL', value: localCacheImg })
    setTimeout(() => {
      updateBackground()
    }, 1000)
  } else {
    updateBackground()
  }
})

defineExpose({
  refresh
})
</script>
<style lang="scss" scoped>
.bg-img-wrapper {
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
.icon-wrapper {
  position: absolute;
  left: 12px;
  bottom: 12px;
  display: flex;
  align-items: center;
  font-size: 20px;
  z-index: 20;
  .icon-item {
    padding: 6px;
    border-radius: 4px;
    color: $color-white;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin: 0 4px;
    .btn-heart {
      path {
        stroke: currentColor;
        stroke-width: 2px;
        fill: transparent;
      }
      path:nth-child(2) {
        transform-origin: center;
        fill: transparent;
        transform: scale(0);
        transition: all .4s ease-in-out;
      }
      &.active {
        color: $color-danger;
        path:nth-child(1) {
          fill: transparent;
        }
        path:nth-child(2) {
          fill: currentColor;
          transform: scale(1);
        }
      }
    }
    &:hover {
      background: rgba(0,0,0,0.08);
    }
  }
}
</style>
