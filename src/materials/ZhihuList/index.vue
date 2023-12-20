<template>
  <div
    class="wrapper material-zhihulist"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS
    }"
  >
    <div class="juejin">
      <div class="logo" v-if="componentSetting.showTitle !== false">
        <svg
          viewBox="0 0 64 30"
          fill="#0066FF"
          :style="{
            filter: `drop-shadow(${componentSetting.iconShadow})`,
            width: `${componentSetting.textFontSize * 4}px`,
            height: `${componentSetting.textFontSize * 1.875}px`,
            cursor: componentSetting.clickActionType ? 'pointer' : 'default'
          }"
          @click="handleClickAction"
        >
          <path
            d="M29.05 4.582H16.733V25.94h3.018l.403 2.572 4.081-2.572h4.815V4.582zm-5.207 18.69l-2.396 1.509-.235-1.508h-1.724V7.233h6.78v16.04h-2.425zM14.46 14.191H9.982c0-.471.033-.954.039-1.458v-5.5h5.106V5.935a1.352 1.352 0 0 0-.404-.957 1.378 1.378 0 0 0-.968-.396H5.783c.028-.088.056-.177.084-.255.274-.82 1.153-3.326 1.153-3.326a4.262 4.262 0 0 0-2.413.698c-.57.4-.912.682-1.371 1.946-.532 1.453-.997 2.856-1.31 3.693C1.444 8.674.28 11.025.28 11.025a5.85 5.85 0 0 0 2.52-.61c1.119-.593 1.679-1.502 2.054-2.883l.09-.3h2.334v5.5c0 .5-.045.982-.073 1.46h-4.12c-.71 0-1.39.278-1.893.775a2.638 2.638 0 0 0-.783 1.874h6.527a17.717 17.717 0 0 1-.778 3.649 16.796 16.796 0 0 1-3.012 5.273A33.104 33.104 0 0 1 0 28.74s3.13 1.175 5.425-.954c1.388-1.292 2.631-3.814 3.23-5.727a28.09 28.09 0 0 0 1.12-5.229h5.967v-1.37a1.254 1.254 0 0 0-.373-.899 1.279 1.279 0 0 0-.909-.37z"
          ></path>
          <path
            d="M11.27 19.675l-2.312 1.491 5.038 7.458a6.905 6.905 0 0 0 .672-2.218 3.15 3.15 0 0 0-.28-2.168l-3.118-4.563zM51.449 15.195V5.842c4.181-.205 7.988-.405 9.438-.483l.851-.05c.387-.399.885-2.395.689-3.021-.073-.25-.213-.666-.638-.555a33.279 33.279 0 0 1-4.277.727c-2.766.321-3.97.404-7.804.682-6.718.487-12.709.72-12.709.72a2.518 2.518 0 0 0 .788 1.834 2.567 2.567 0 0 0 1.883.706c2.278-.095 5.598-.25 8.996-.41v9.203h-12.78c0 .703.281 1.377.783 1.874a2.69 2.69 0 0 0 1.892.777h10.105v7.075c0 .887-.464 1.192-1.231 1.214h-3.92a4.15 4.15 0 0 0 .837 1.544 4.2 4.2 0 0 0 1.403 1.067 6.215 6.215 0 0 0 2.71.277c1.36-.066 2.967-.826 2.967-3.57v-7.607h11.28c.342 0 .67-.135.91-.374.242-.239.378-.563.378-.902v-1.375H51.449z"
          ></path>
          <path
            d="M42.614 8.873a2.304 2.304 0 0 0-1.508-.926 2.334 2.334 0 0 0-1.727.405l-.376.272 4.255 5.85 2.24-1.62-2.884-3.98zM57.35 8.68l-3.125 4.097 2.24 1.663 4.517-5.927-.375-.277a2.32 2.32 0 0 0-1.722-.452 2.327 2.327 0 0 0-1.536.896z"
          ></path>
        </svg>
      </div>
      <div class="loading" v-if="loading">Loading...</div>
      <div class="error" v-else-if="error">Something error!</div>
      <div class="list" v-else>
        <div class="list-item" v-for="item in list" :key="item.title">
          <div class="title">
            <a 
              :href="item.link" 
              target="_blank" 
              :style="!isLock ? 'pointer-events: none' : ''"
              :title="item.title"
            >{{item.title}}</a>
          </div>
          <div class="like">🔥{{ item.hot }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed, onUnmounted, watch } from 'vue'
import { apiURL } from '@/global'
import { useStore } from '@/store'
import { mapPosition } from '@/plugins/position-selector'
const props = defineProps({
  componentSetting: {
    type: Object,
    required: true
  }
})
const store = useStore()
const isLock = computed(() => store.isLock)

const list = ref<any[]>([])
const loading = ref(false)
const error = ref(false)
const getList = async () => {
  try {
    loading.value = true
    error.value = false
    const res = await fetch(`${apiURL}/api/zhihuList?limit=${props.componentSetting.limit || 10}`)
    const { list: _list } = await res.json()
    list.value = _list.map((item: any) => {
      return {
        title: item.title,
        link: item.link,
        hot: item.hot.replace('万热度', 'w')
      }
    })
  } catch (e) {
    error.value = true
    console.error(e)
  } finally {
    loading.value = false
  }
}

let timer: number
function init() {
  getList()
  if (timer) window.clearInterval(timer)
  timer = window.setInterval(() => {
    getList()
  }, props.componentSetting.duration * 60 * 1000)
}
onMounted(() => init())
onUnmounted(() => window.clearInterval(timer))
watch(
  () => [props.componentSetting.duration, props.componentSetting.limit],
  () => init()
)

const positionCSS = computed(() => mapPosition(props.componentSetting.position))

const handleClickAction = () => {
  if (props.componentSetting.clickActionType === 1) {
    init()
  } else if (props.componentSetting.clickActionType === 2) {
    window.open('https://www.zhihu.com/')
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .juejin {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .logo {
      margin-bottom: 0.5em;
      img {
        width: 4em;
        height: auto;
      }
    }
    .list {
      flex: 1;
      overflow-y: auto;
      .list-item {
        display: flex;
        align-items: center;
        font-size: 1em;
        line-height: 1.5;
        .title {
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          a {
            color: inherit;
            text-decoration: none;
          }
        }
        .like {
          margin-left: 0.4em;
          padding-right: 0.2em;
        }
      }
    }
  }
}
</style>
