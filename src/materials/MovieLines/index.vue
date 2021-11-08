<template>
  <div
    class="wrapper"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS
    }">
    <blockquote class="blockquote" :style="!props.componentSetting.showDecoration && 'background: none'">
      <p class="lines">{{lines}}</p>
      <p class="cite" v-show="props.componentSetting.showCite">『 {{movie}} 』</p>
      <div class="quote-left" v-show="props.componentSetting.showDecoration">
        <svg viewBox="0 0 1024 1024">
          <path d="M928 512h-160v-128c0-70.6 57.4-128 128-128h16c26.6 0 48-21.4 48-48V112c0-26.6-21.4-48-48-48h-16c-176.8 0-320 143.2-320 320v480c0 53 43 96 96 96h256c53 0 96-43 96-96V608c0-53-43-96-96-96z m-576 0H192v-128c0-70.6 57.4-128 128-128h16c26.6 0 48-21.4 48-48V112c0-26.6-21.4-48-48-48h-16C143.2 64 0 207.2 0 384v480c0 53 43 96 96 96h256c53 0 96-43 96-96V608c0-53-43-96-96-96z"></path>
        </svg>
      </div>
      <div class="quote-right" v-show="props.componentSetting.showDecoration">
        <svg viewBox="0 0 1024 1024">
          <path d="M928 64H672c-53 0-96 43-96 96v256c0 53 43 96 96 96h160v128c0 70.6-57.4 128-128 128h-16c-26.6 0-48 21.4-48 48v96c0 26.6 21.4 48 48 48h16c176.8 0 320-143.2 320-320V160c0-53-43-96-96-96z m-576 0H96C43 64 0 107 0 160v256c0 53 43 96 96 96h160v128c0 70.6-57.4 128-128 128h-16c-26.6 0-48 21.4-48 48v96c0 26.6 21.4 48 48 48h16c176.8 0 320-143.2 320-320V160c0-53-43-96-96-96z"></path>
        </svg>
      </div>
    </blockquote>
    <img class="bg" v-if="props.componentSetting.showPoster" :src="poster" :style="{ filter: props.componentSetting.posterFilter }">
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { apiURL } from '@/global'
import { mapPosition } from '@/plugins/position-selector'
const props = defineProps({
  componentSetting: {
    type: Object,
    required: true
  }
})

const lines = ref('')
const movie = ref('')
const poster = ref('')
const link = ref('')

const getData = async () => {
  try {
    const res = await fetch(`${apiURL}/api/movieLines`)
    const { name, img, link: _link, quotes } = await res.json()
    lines.value = quotes
    movie.value = name
    poster.value = img.replace('s_ratio_poster', 'm') // middle size
    link.value = _link
  } catch {
    //
  }
}

const refreshDuration = (props.componentSetting?.duration || 5) * 60 * 1000

let timer: number
onMounted(() => {
  getData()
  timer = window.setInterval(getData, refreshDuration)
})
onUnmounted(() => {
  window.clearInterval(timer)
})

const positionCSS = computed(() => mapPosition(props.componentSetting.position))
const themeColor = computed(() => props.componentSetting.themeColor)
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
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
    z-index: -1;
  }
}
</style>
