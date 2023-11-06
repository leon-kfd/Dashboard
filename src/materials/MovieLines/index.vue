<template>
  <div
    class="wrapper material-movielines"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS,
      borderRadius: element.borderRadius + 'px',
    }">
    <img
      class="bg"
      ref="movieBg"
      v-if="componentSetting.showPoster && !componentSetting.asBackground"
      v-show="isReady"
      :src="componentSetting.posterType === 2 ? wallpaperImg: img"
      :style="{ filter: componentSetting.posterFilter }"
      @load="imgLoad"/>
    <div
      v-if="componentSetting.useSpotlight"
      class="bg-effect-box"
      :style="bgEffectString"
    ></div>
    <blockquote
      class="blockquote"
      :style="{
        background: !componentSetting.showDecoration ? 'none': '',
        maxWidth: componentSetting.maxWidth ? componentSetting.maxWidth + 'px' : '',
        cursor: componentSetting.clickActionType ? 'pointer': 'default'
      }"
      @click="handleClickAction">
      <p class="lines" ref="linesText">{{lines}}</p>
      <p class="cite" v-show="componentSetting.showCite" ref="movieText">『 {{movie}} 』</p>
      <div class="quote-left" v-show="componentSetting.showDecoration">
        <svg viewBox="0 0 1024 1024">
          <path d="M928 512h-160v-128c0-70.6 57.4-128 128-128h16c26.6 0 48-21.4 48-48V112c0-26.6-21.4-48-48-48h-16c-176.8 0-320 143.2-320 320v480c0 53 43 96 96 96h256c53 0 96-43 96-96V608c0-53-43-96-96-96z m-576 0H192v-128c0-70.6 57.4-128 128-128h16c26.6 0 48-21.4 48-48V112c0-26.6-21.4-48-48-48h-16C143.2 64 0 207.2 0 384v480c0 53 43 96 96 96h256c53 0 96-43 96-96V608c0-53-43-96-96-96z"></path>
        </svg>
      </div>
      <div class="quote-right" v-show="componentSetting.showDecoration">
        <svg viewBox="0 0 1024 1024">
          <path d="M928 64H672c-53 0-96 43-96 96v256c0 53 43 96 96 96h160v128c0 70.6-57.4 128-128 128h-16c-26.6 0-48 21.4-48 48v96c0 26.6 21.4 48 48 48h16c176.8 0 320-143.2 320-320V160c0-53-43-96-96-96z m-576 0H96C43 64 0 107 0 160v256c0 53 43 96 96 96h160v128c0 70.6-57.4 128-128 128h-16c-26.6 0-48 21.4-48 48v96c0 26.6 21.4 48 48 48h16c176.8 0 320-143.2 320-320V160c0-53-43-96-96-96z"></path>
        </svg>
      </div>
    </blockquote>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { apiURL } from '@/global'
import { mapPosition } from '@/plugins/position-selector'
import { execCopy } from '@/utils'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'
const props = defineProps({
  componentSetting: {
    type: Object,
    required: true
  },
  element: {
    type: Object,
    required: true
  }
})

const { t } = useI18n()
const store = useStore()

const linesText = ref()
const movieText = ref()
const movieBg = ref()

const lines = ref('')
const movie = ref('')
const img = ref('')
const wallpaperImg = ref('')
const link = ref('')

const bgEffectString = ref('')

const isReady = ref(false)

const getData = async () => {
  try {
    const res = await fetch(`${apiURL}/api/movieLines`)
    const { name, img: _img, img1, img2, img3, img4, link: _link, quotes } = await res.json()
    lines.value = quotes
    movie.value = name
    img.value = _img.replace('s_ratio_poster', 'm') // middle size
    const randomImgArr = [img1, img1, img2, img3, img4].filter(Boolean)
    const randomImgIdx = ~~(Math.random() * randomImgArr.length)
    const randomImg = randomImgArr[randomImgIdx]
    if (window.innerWidth < 768) {
      wallpaperImg.value = randomImg.replace('original', 'w780')
    } else if (window.innerWidth < 1460) {
      wallpaperImg.value = randomImg.replace('original', 'w1280')
    } else {
      wallpaperImg.value = randomImg
    }

    if (props.componentSetting.asBackground) {
      store.updateState({ key: 'realBackgroundURL', value: wallpaperImg.value })
    }

    link.value = _link

    bgEffectString.value = `
      background-image: radial-gradient(
        ellipse at ${~~(Math.random() * 50) + 25}% ${~~(Math.random() * 50) + 25}%,
        rgba(0, 0, 0,.25),
        rgba(0, 04, 0,.75), 
        rgb(0, 0, 0));`
  } catch {
    //
  }
}

let timer: number | null
const refreshTimer = () => {
  const refreshDuration = (props.componentSetting.duration || 5) * 60 * 1000
  if (timer) {
    window.clearInterval(timer)
    timer = null
  }
  timer = window.setInterval(getData, refreshDuration)
}
watch(() => props.componentSetting.duration, () => refreshTimer(), { immediate: true })
watch(() => props.componentSetting.asBackground, (val) => {
  if (val && store.realBackgroundURL !== wallpaperImg.value) {
    store.resetGlobalBackground()
    store.updateGlobalKey({ key: 'backgroundFilter', value: props.componentSetting.posterFilter })
    store.updateState({ key: 'realBackgroundURL', value: wallpaperImg.value })
  }
}, { immediate: true })
watch(() => props.componentSetting.posterFilter, (val) => {
  if (val && store.global.backgroundFilter !== val) {
    store.updateGlobalKey({ key: 'backgroundFilter', value: props.componentSetting.posterFilter })
  }
})


onMounted(() => {
  getData()

  // const addMovieLineLoadingObserve = () => {
  //   const runAnimation = () => {
  //     const checkEl = document.querySelector('body .light__line')
  //     if (checkEl) checkEl.remove()
  //     const lightLine = document.createElement('div')
  //     lightLine.setAttribute('class', 'light__line')
  //     lightLine.style.cssText = `
  //       position: absolute;
  //       bottom: 2px;
  //       left: 0;
  //       right: 0;
  //       width: 0;
  //       height: 4px;
  //       border-radius: 2px;
  //       background: #0093df;
  //       border-bottom: 2px solid #0093df;
  //       box-shadow: 0 0 30px #0093df;
  //       transition: width 120s;
  //     `
  //     document.body?.appendChild(lightLine)
  //     setTimeout(() => {
  //       lightLine.style.width = `100%`;
  //     }, 200)
  //   }
  //   const obs = new MutationObserver(() => {
  //     runAnimation()
  //   })
  //   const blockquoteEl = document.querySelector('.material-movielines .blockquote')
  //   if (blockquoteEl) {
  //     obs.observe(blockquoteEl, { childList: true, characterData: true, subtree: true})
  //     runAnimation()
  //   }
  // }
  // setTimeout(() => {
  //   addMovieLineLoadingObserve()
  // }, 300)
})

onUnmounted(() => {
  if (props.componentSetting.asBackground) {
    store.updateState({ key: 'realBackgroundURL', value: '' })
  }
  timer && window.clearInterval(timer)
})

const positionCSS = computed(() => mapPosition(props.componentSetting.position))
const themeColor = computed(() => props.componentSetting.themeColor)

// fadeInEffect
watch(() => lines.value, () => {
  if (linesText.value && linesText.value.animate) {
    linesText.value.animate({ opacity: [0, 1] }, 400)
  }
  if (movieText.value && movieText.value.animate) {
    movieText.value.animate({ opacity: [0, 1] }, 400)
  }
})

const imgLoad = () => {
  isReady.value = true
  if (movieBg.value && movieBg.value.animate) {
    movieBg.value.animate({ opacity: [0, 1] }, 400)
  }
}

const handleClickAction = () => {
  if (!store.isLock) return
  if (props.componentSetting.clickActionType === 1) {
    getData()
    refreshTimer()
  } else if (props.componentSetting.clickActionType === 2) {
    window.open(link.value)
  } else if (props.componentSetting.clickActionType === 3) {
    if (execCopy(lines.value)) {
      ElNotification({
        title: t('提示'),
        type: 'success',
        message: t('复制成功')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  .blockquote {
    padding: 0.8em 1em;
    background:
      linear-gradient(to right, v-bind('themeColor') 4px, transparent 4px) 0 100%,
      linear-gradient(to left, v-bind('themeColor') 4px, transparent 4px) 100% 0,
      linear-gradient(to bottom, v-bind('themeColor') 4px, transparent 4px) 100% 0,
      linear-gradient(to top, v-bind('themeColor') 4px, transparent 4px) 0 100%;
    background-repeat: no-repeat;
    background-size: 1.4em 1.4em;
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
    margin: 1em 1.2em;
    .lines {
      text-align: left;
      line-height: 1.5;
      flex: 1;
    }
    .cite {
      text-align: right;
      margin-top: .6em;
      line-height: 1.5;
    }
    .quote-left,
    .quote-right {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        width: 1.4em;
        height: 1.4em;
        path {
          fill: v-bind('themeColor')
        }
      }
    }
    .quote-left {
      top: 0;
      left: 0;
      transform: translate(-50%, -50%);
    }
    .quote-right {
      bottom: 0;
      right: 0;
      transform: translate(50%, 50%);
    }
  }
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    object-fit: cover;
  }

  .bg-effect-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}
</style>
