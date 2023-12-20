<template>
  <div
    class="wrapper material-weibolist"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS
    }"
  >
    <div class="weibo">
      <div
        v-if="componentSetting.showTitle !== false"
        class="logo"
        :style="{ cursor: componentSetting.clickActionType ? 'pointer' : 'default' }"
        @click="handleClickAction"
      >
        <img
          :src="logo"
          alt="Weibo"
          :style="{ filter: `drop-shadow(${componentSetting.iconShadow})` }"
        />
        <div class="logo-text">微博热搜</div>
      </div>
      <div class="loading" v-if="loading">Loading...</div>
      <div class="error" v-else-if="error">Something error!</div>
      <div class="list" v-else>
        <div class="list-item" v-for="item in list" :key="item.id">
          <div class="num" style="width: 24px; height: 24px">
            <img v-if="item.num" :src="item.num" style="width: 100%; height: 100%" />
          </div>
          <div class="title">
            <a 
              :href="item.link" 
              target="_blank" 
              :style="!isLock ? 'pointer-events: none' : ''"
              :title="item.title"
            >{{item.title}}</a>
          </div>
          <div class="count" v-if="item.count">{{ item.count }}w</div>
          <div class="icon" style="width: 24px; height: 24px">
            <img v-if="item.icon" :src="item.icon" style="width: 100%; height: 100%" />
          </div>
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
const logo = 'https://h5.sinaimg.cn/m/weibo-lite/img/pwalogo.417d1674.svg'
const list = ref<any[]>([])
const loading = ref(false)
const error = ref(false)
const getList = async () => {
  try {
    loading.value = true
    error.value = false
    const res = await fetch(`${apiURL}/api/weiboList?limit=${props.componentSetting.limit || 10}`)
    const { list: _list } = await res.json()
    list.value = _list.map((item: any) => {
      return {
        num: item.pic,
        id: item.desc,
        title: item.desc,
        icon: item.icon,
        link: item.scheme,
        count: ~~(item.desc_extr / 10000)
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
    window.open('https://weibo.com/')
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .weibo {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .logo {
      margin-bottom: 0.5em;
      display: flex;
      align-items: center;
      img {
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
        .count {
          font-size: 0.8em;
          color: #99a;
          margin: 0 0.2em;
          text-shadow: none;
        }
      }
    }
  }
}
</style>
