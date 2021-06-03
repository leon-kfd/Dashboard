<template>
  <button type="button" class="btn btn-small btn-primary" style="margin: 0;margin-right: 5px;" @click="handleOpenSelector">今日壁纸推荐</button>
  <animation-dialog
      ref="dialog"
      animationMode
      title="今日壁纸推荐"
      width="min(760px, 94vw)"
      height="min(480px, 80vh)"
      appendToBody
      :closeOnClickOutside="false"
      :listenWindowSizeChange="true"
      @beforeClose="close">
      <div class="wrapper" v-if="beginLoad">
        <div class="box">
          <div class="title-wrapper clear">
            <span class="title fl">必应壁纸</span>
          </div>
          <div class="text" v-if="bingLoading">Loading...</div>
          <div class="text" v-else-if="bingError">Something Error...</div>
          <div class="bing item-wrapper" v-else>
            <div class="item" v-for="item in bingList" :key="item.value" @click="handleSelect(item.url)">
              <div class="img-wrapper">
                <img v-if="item.url" :src="item.thumb" loading="lazy" />
              </div>
            </div>
            <div class="item-fake" v-for="item in 4" :key="item"></div>
          </div>
        </div>
        <div class="box">
          <div class="title-wrapper clear">
            <span class="title fl">Unsplash</span>
            <span class="date fr" v-if="unsplashDate">{{unsplashDate}}</span>
          </div>
          <div class="text" v-if="unsplashLoading">Loading...</div>
          <div class="text" v-else-if="unsplashError">Something Error...</div>
          <div class="unsplash item-wrapper" v-else>
            <div class="item" v-for="item in unsplashList" :key="item.value" @click="handleSelect(item.urls.raw)">
              <div class="img-wrapper">
                <img v-if="item.urls.thumb" :src="item.urls.thumb" loading="lazy" />
              </div>
            </div>
            <div class="item-fake" v-for="item in 4" :key="item"></div>
          </div>
        </div>
      </div>
    </animation-dialog>
</template>

<script lang="ts" setup>
import { ref, defineEmit, onMounted } from 'vue'
import AnimationDialog from '@howdyjs/animation-dialog'
import { apiURL } from '@/global'
const emit = defineEmit(['submit'])
const beginLoad = ref(false)
const dialog = ref()

const bingList = ref([])
const bingLoading = ref(false)
const bingError = ref(false)
const getBingList = async () => {
  try {
    bingLoading.value = true
    bingError.value = false
    const bingTarget = encodeURIComponent('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN')
    const res = await fetch(`${apiURL}/api/transfer?target=${bingTarget}&noHeaders=1`, {
      headers: {
        'content-type': 'application/json; charset=utf-8'
      }
    })
    const { images } = await res.json()
    if (images && images.length > 0) {
      bingList.value = images.map((item: any) => {
        const url = `https://cn.bing.com/${item.url}`
        const thumb = `https://cn.bing.com/${item.urlbase}_320x240.jpg&rf=LaDigue_1920x1080.jpg&pid=hp`
        return {
          url,
          thumb
        }
      })
    } else {
      throw new Error('Api server error')
    }
  } catch (e) {
    bingError.value = true
    console.error(e)
  } finally {
    bingLoading.value = false
  }
}

const unsplashList = ref([])
const unsplashDate = ref('')
const unsplashLoading = ref(false)
const unsplashError = ref(false)
const getUnsplashList = async () => {
  try {
    unsplashLoading.value = true
    unsplashError.value = false
    const res = await fetch(`${apiURL}/photos`)
    const { errCode, data } = await res.json()
    if (errCode === 200) {
      unsplashList.value = data.list
      unsplashDate.value = data.date
    } else {
      throw new Error('Api server error')
    }
  } catch (e) {
    unsplashError.value = true
    console.error(e)
  } finally {
    unsplashLoading.value = false
  }
}

const handleOpenSelector = () => {
  dialog.value.open()
  if (!beginLoad.value) beginLoad.value = true
  if (unsplashError.value || unsplashList.value.length === 0) getUnsplashList()
  if (bingError.value || bingList.value.length === 0) getBingList()
}
const close = () => {}
const handleSelect = (url: string) => {
  emit('submit', url)
  dialog.value.close()
}

</script>
<style lang="scss" scoped>
.wrapper {
  .box {
    margin-bottom: 16px;
    .text {
      font-size: 16px;
      color: #888;
      line-height: 28px;
    }
  }
}
.title-wrapper {
  .title {
    color: rgb(43, 43, 43);
    font-weight: bold;
    line-height: 22px;
    font-size: 18px;
    position: relative;
    margin-bottom: 5px;
    &:after {
      position: absolute;
      content: '';
      left: 0;
      width: 100%;
      bottom: 0;
      height: 8px;
      background: rgba($--color-warning, .2);
    }
  }
  .date {
    font-size: 14px;
    color: #999;
    line-height: 22px;
    font-weight: bold;
  }
}
.item-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  font-size: 16px;
  .item-fake {
    width: 12em;
    height: 0;
    margin: 0 .2em;
  }
  .item {
    width: 12em;
    height: 6.75em;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 10px 10px -5px rgb(0 0 0 / 4%);
    // border-radius: 8px;
    margin: .8em .2em ;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    cursor: pointer;
    transition: transform .4s ease-in-out;
    &:hover {
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 30%), 0 10px 10px -5px rgb(0 0 0 / 10%);
      .img-wrapper {
        img {
          transform: scale(1.05);
        }
      }
    }
    .img-wrapper {
      background: linear-gradient(45deg, rgb(211, 208, 253), rgb(208, 227, 253));
      position: relative;
      width: 12em;
      height: 6.75em;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform .4s ease-in-out;
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .item-wrapper {
    font-size: 12px;
  }
}
</style>
