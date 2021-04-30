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
    <div class="juejin">
      <div class="logo">
        <img
          :src="logo"
          alt="Juejin"
          :style="{
            filter: `drop-shadow(${componentSetting.iconShadow})`
          }">
      </div>
      <div class="loading" v-if="loading">Loading...</div>
      <div class="error" v-else-if="error">Somethine error!</div>
      <div class="list" v-else>
        <div class="list-item" v-for="item in list" :key="item.id">
          <div class="title">
            <a
              :href="`https://juejin.cn/post/${item.id}`"
              target="_blank"
              :style="!$store.state.isLock && 'pointer-events: none'">{{item.title}}</a>
          </div>
          <div class="like">👍{{item.like}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, onUnmounted, watch } from 'vue'
import { apiURL } from '@/global'
import { ajaxPost } from '@/utils'
import { mapPosition } from '@/plugins/position-selector'
export default defineComponent({
  name: 'JueJin',
  props: {
    componentSetting: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const logo = 'https://sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/logo.a7995ad.svg'
    const list = ref([])
    const loading = ref(false)
    const error = ref(false)
    const getList = async () => {
      try {
        loading.value = true
        error.value = false
        const { data, err_no } = await ajaxPost(`${apiURL}/api/transfer`, {
          target: 'https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed',
          client_type: 2680,
          cursor: '0',
          id_type: 2,
          limit: props.componentSetting.limit || 10,
          sort_type: 200
        })
        if (err_no === 0) {
          const _list = data.map((item:any) => {
            const article = item?.item_info?.article_info
            const id = article?.article_id
            const title = article?.title
            const like = article?.digg_count
            const view = article?.view_count
            return {
              id, title, like, view
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

    let timer:number
    function init() {
      getList()
      if (timer) window.clearInterval(timer)
      timer = window.setInterval(() => {
        getList()
      }, props.componentSetting.duration * 60 * 1000)
    }
    onMounted(() => init())
    onUnmounted(() => window.clearInterval(timer))
    watch(() => [props.componentSetting.duration, props.componentSetting.limit], () => init())

    const positionCSS = computed(() => mapPosition(props.componentSetting.position))

    return {
      logo,
      list,
      positionCSS,
      loading,
      error
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  .juejin {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .logo {
      margin-bottom: .5em;
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
          margin-left: .4em;
          padding-right: .2em;
        }
      }
    }
  }
}
</style>
