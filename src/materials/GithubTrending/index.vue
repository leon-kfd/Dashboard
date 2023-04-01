<template>
  <div
    class="wrapper material-githubtrending"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS,
      '--grey1': grey1,
      '--grey2': grey2,
      '--grey3': grey3
    }"
  >
    <div class="github">
      <div
        v-if="componentSetting.showTitle !== false"
        class="logo"
        :style="{ cursor: componentSetting.clickActionType ? 'pointer' : 'default' }"
        @click="handleClickAction"
      >
        <svg
          viewBox="0 0 1024 1024"
          :style="{
            filter: `drop-shadow(${componentSetting.iconShadow})`
          }"
        >
          <path
            :fill="componentSetting.textColor"
            d="M512 42.666667A464.64 464.64 0 0 0 42.666667 502.186667 460.373333 460.373333 0 0 0 363.52 938.666667c23.466667 4.266667 32-9.813333 32-22.186667v-78.08c-130.56 27.733333-158.293333-61.44-158.293333-61.44a122.026667 122.026667 0 0 0-52.053334-67.413333c-42.666667-28.16 3.413333-27.733333 3.413334-27.733334a98.56 98.56 0 0 1 71.68 47.36 101.12 101.12 0 0 0 136.533333 37.973334 99.413333 99.413333 0 0 1 29.866667-61.44c-104.106667-11.52-213.333333-50.773333-213.333334-226.986667a177.066667 177.066667 0 0 1 47.36-124.16 161.28 161.28 0 0 1 4.693334-121.173333s39.68-12.373333 128 46.933333a455.68 455.68 0 0 1 234.666666 0c89.6-59.306667 128-46.933333 128-46.933333a161.28 161.28 0 0 1 4.693334 121.173333A177.066667 177.066667 0 0 1 810.666667 477.866667c0 176.64-110.08 215.466667-213.333334 226.986666a106.666667 106.666667 0 0 1 32 85.333334v125.866666c0 14.933333 8.533333 26.88 32 22.186667A460.8 460.8 0 0 0 981.333333 502.186667 464.64 464.64 0 0 0 512 42.666667"
          ></path>
        </svg>
        <div class="logo-text">Github Trending</div>
      </div>
      <div class="loading" v-if="loading">Loading...</div>
      <div class="error" v-else-if="error">Something error!</div>
      <div class="list" v-else>
        <div
          class="list-item"
          v-for="item in list"
          :key="item.id"
          :style="!isLock ? 'pointer-events: none' : ''"
          @click="turn(item)"
        >
          <div class="title">{{ item.title }}</div>
          <div class="desc" v-if="item.description">{{ item.description }}</div>
          <div class="today-star" v-if="item.todayStar">{{ item.todayStar }}</div>
          <div class="footer">
            <div class="language item" v-if="item.language">
              <div class="language-circle" :style="`background: ${item.color}`"></div>
              {{ item.language }}
            </div>
            <div class="total-star item" v-if="item.totalStar">
              <svg
                aria-label="star"
                :width="componentSetting.textFontSize * 0.7"
                :height="componentSetting.textFontSize * 0.8"
                viewBox="0 0 14 16"
                version="1.1"
                role="img"
              >
                <path
                  fill-rule="evenodd"
                  d="M14 6l-4.9-.64L7 1 4.9 5.36 0 6l3.6 3.26L2.67 14 7 11.67 11.33 14l-.93-4.74L14 6z"
                ></path>
              </svg>
              {{ item.totalStar }}
            </div>
            <div class="forked item" v-if="item.forked">
              <svg
                aria-label="repo-forked"
                :width="componentSetting.textFontSize * 0.64"
                :height="componentSetting.textFontSize * 0.8"
                viewBox="0 0 10 16"
                version="1.1"
                role="img"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 1a1.993 1.993 0 0 0-1 3.72V6L5 8 3 6V4.72A1.993 1.993 0 0 0 2 1a1.993 1.993 0 0 0-1 3.72V6.5l3 3v1.78A1.993 1.993 0 0 0 5 15a1.993 1.993 0 0 0 1-3.72V9.5l3-3V4.72A1.993 1.993 0 0 0 8 1zM2 4.2C1.34 4.2.8 3.65.8 3c0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3 10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2zm3-10c-.66 0-1.2-.55-1.2-1.2 0-.65.55-1.2 1.2-1.2.65 0 1.2.55 1.2 1.2 0 .65-.55 1.2-1.2 1.2z"
                ></path>
              </svg>
              {{ item.forked }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { mapPosition } from '@/plugins/position-selector'
import { getColorBrightness } from '@/utils/color'
import { useStore } from '@/store'
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
const isDark = computed(
  () => getColorBrightness(props.componentSetting.textColor || '#262626') < 150
)
const grey1 = computed(() => (isDark.value ? '#666' : '#ccc'))
const grey2 = computed(() => (isDark.value ? '#777' : '#bbb'))
const grey3 = computed(() => (isDark.value ? '#888' : '#aaa'))
const getList = async () => {
  try {
    loading.value = true
    error.value = false
    const res = await fetch('https://www.unpkg.com/@wcj/github-rank/dist/trending-daily.json')
    // const res = await fetch(
    //   'https://cdn.jsdelivr.net/npm/@wcj/github-rank/dist/trending-daily.json'
    // )
    const data = await res.json()
    if (data) {
      const _list = data.slice(0, props.componentSetting.limit).map((item: any) => {
        const {
          rank: id,
          full_name: title,
          language,
          color,
          description,
          forked,
          stargazers_count: totalStar,
          todayStar,
          html_url: link
        } = item
        return {
          id,
          title,
          language,
          color,
          description,
          forked,
          todayStar,
          totalStar,
          link
        }
      })
      list.value = _list
    } else {
      throw new Error('Api server error')
    }
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

const turn = (item: any) => {
  window.open(item.link)
}

const handleClickAction = () => {
  if (props.componentSetting.clickActionType === 1) {
    init()
  } else if (props.componentSetting.clickActionType === 2) {
    window.open('https://github.com/')
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .github {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .logo {
      display: flex;
      align-items: center;
      margin-bottom: 0.4em;
      svg {
        width: 2em;
        height: auto;
      }
      .logo-text {
        font-size: 1.2em;
        font-weight: 500;
        margin-left: 0.4em;
      }
    }
    .list {
      flex: 1;
      overflow-y: auto;
      .list-item {
        padding: 0.6em 0.4em;
        line-height: 1.2;
        border-radius: 4px;
        &:hover {
          background: rgba(128, 128, 128, 0.2);
          cursor: pointer;
        }
        .title {
          font-size: 1.2em;
          font-weight: 500;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 0.4em;
        }
        .desc {
          font-size: 1em;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
          text-shadow: none;
          margin-bottom: 0.4em;
          color: var(--grey1);
        }
        .today-star {
          font-size: 0.8em;
          color: var(--grey3);
          text-shadow: none;
          margin-bottom: 0.4em;
        }
        .footer {
          display: flex;
          font-size: 0.8em;
          text-shadow: none;
          color: var(--grey2);
          .item {
            display: inline-flex;
            align-items: center;
            svg,
            .language-circle {
              margin-right: 0.2em;
              path {
                fill: var(--grey2);
              }
            }
          }
          .language {
            margin-right: 1em;
            .language-circle {
              width: 0.8em;
              height: 0.8em;
              border-radius: 50%;
              background: var(--grey2);
            }
          }
          .total-star {
            margin-right: 1em;
          }
        }
      }
    }
  }
}
</style>
