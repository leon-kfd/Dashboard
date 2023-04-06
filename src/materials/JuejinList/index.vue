<template>
  <div
    class="wrapper material-juejinlist"
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
        <img
          :src="logo"
          :style="{
            filter: `drop-shadow(${componentSetting.iconShadow})`,
            cursor: componentSetting.clickActionType ? 'pointer' : 'default'
          }"
          alt="Juejin"
          @click="handleClickAction"
        />
      </div>
      <div class="loading" v-if="loading">Loading...</div>
      <div class="error" v-else-if="error">Something error!</div>
      <div class="list" v-else>
        <div class="list-item" v-for="item in list" :key="item.id">
          <div class="title">
            <a
              :href="`https://juejin.cn/post/${item.id}`"
              target="_blank"
              :style="!isLock ? 'pointer-events: none' : ''"
              >{{ item.title }}</a
            >
          </div>
          <div class="like">👍{{ item.like }}</div>
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

const logo = 'https://sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/logo.a7995ad.svg'
const list = ref<any[]>([])
const loading = ref(false)
const error = ref(false)
const getList = async () => {
  try {
    loading.value = true
    error.value = false
    const res = await fetch(`${apiURL}/api/juejinList?limit=${props.componentSetting.limit || 10}`)
    const { list: _list } = await res.json()
    list.value = _list.map((item: any) => {
      return {
        id: item.article_id,
        title: item.title,
        like: item.digg_count,
        view: item.view_count
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
    window.open('https://juejin.cn/')
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
