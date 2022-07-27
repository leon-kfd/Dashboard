<template>
  <button type="button" class="btn btn-small btn-primary" style="margin: 0;margin-right: 5px;" @click="handleOpenSelector">{{$t('今日壁纸推荐')}}</button>
  <easy-dialog
    v-model="dialogVisible"
    :title="$t('今日壁纸推荐')"
    width="min(760px, 94vw)"
    height="min(560px, 80vh)">
    <div class="wrapper" v-if="beginLoad">
      <div class="tab-title-wrapper">
        <div :class="['title', tabIndex === 1 && 'active']" @click="tabIndex = 1">{{$t('必应壁纸')}}</div>
        <div :class="['title', tabIndex === 3 && 'active']" @click="tabIndex = 3">{{$t('360壁纸')}}</div>
        <div :class="['title', tabIndex === 2 && 'active']" @click="tabIndex = 2">UNSPLAH</div>
      </div>
      <div class="tab-container" v-show="tabIndex === 1">
        <div class="text" v-if="loading">Loading...</div>
        <div class="text" v-else-if="error">Something Error...</div>
        <div class="item-wrapper" v-else>
          <div class="item" v-for="item in bingList" :key="item.url" @click="handleSelect(item.url)">
            <div class="img-wrapper">
              <img v-if="item.url" :src="item.thumb" loading="lazy" />
            </div>
          </div>
          <div class="item-fake" v-for="item in 4" :key="item"></div>
        </div>
      </div>
      <div class="tab-container" v-show="tabIndex === 2">
        <div class="text" v-if="loading">Loading...</div>
        <div class="text" v-else-if="error">Something Error...</div>
        <div class="item-wrapper" v-else>
          <div class="item" v-for="item in unsplashList" :key="item.url" @click="handleSelect(item.url)">
            <div class="img-wrapper">
              <img v-if="item.url" :src="item.thumb" loading="lazy" />
            </div>
          </div>
          <div class="item-fake" v-for="item in 4" :key="item"></div>
        </div>
      </div>
      <div class="sub-tab-container" v-show="tabIndex === 3">
        <div
          :class="['sub-tab-title', p360CatalogActive === item.value && 'active']"
          v-for="item in p360Catalog"
          :key="item.value"
          @click="p360CatalogActive = item.value"
        >{{$t(item.label)}}
        </div>
      </div>
      <div class="tab-container" v-show="tabIndex === 3">
        <div class="item-wrapper">
          <div class="item" v-for="item in p360List" :key="item.url" @click="handleSelect(item.url)">
            <div class="img-wrapper">
              <img v-if="item.url" :src="item.thumb" loading="lazy" />
            </div>
          </div>
          <div class="item-fake" v-for="item in 4" :key="item"></div>
        </div>
        <div class="load-more">
          <button class="btn btn-warning" :loading="loading" @click="loadP360More">{{ loading ? 'LOADING...': 'LOAD MORE' }}</button>
        </div>
      </div>
    </div>
  </easy-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { apiURL } from '@/global'
type ListItem = {
  thumb: string;
  url: string
}
const emit = defineEmits(['submit'])
const beginLoad = ref(false)
const dialogVisible = ref(false)

const tabIndex = ref(1)
const loading = ref(false)
const error = ref(false)
const bingList = ref<ListItem[]>([])
const unsplashList = ref<ListItem[]>([])
const p360List = ref<ListItem[]>([])
const page = ref(1)

const p360Catalog = [
  { label: '风景', value: 9 },
  { label: '4K', value: 36 },
  { label: '清新', value: 15 },
  { label: '萌宠', value: 14 },
  { label: '游戏', value: 5 },
  { label: '汽车', value: 12 },
  { label: '时尚', value: 10 },
  { label: '体育', value: 16 }
]
const p360CatalogActive = ref(9)

const getBingList = async () => {
  try {
    loading.value = true
    error.value = false
    const bingTarget = encodeURIComponent('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=8&mkt=zh-CN')
    const firstPage = await fetch(`${apiURL}/api/transfer?target=${bingTarget}&noHeaders=1`, { headers: { 'content-type': 'application/json; charset=utf-8' } })
    const { images: firstPageList } = await firstPage.json()
    const bingTargetNext = encodeURIComponent('https://cn.bing.com/HPImageArchive.aspx?format=js&idx=8&n=8&mkt=zh-CN')
    const secondPage = await fetch(`${apiURL}/api/transfer?target=${bingTargetNext}&noHeaders=1`, { headers: { 'content-type': 'application/json; charset=utf-8' } })
    const { images: secondPageList } = await secondPage.json()
    secondPageList.shift()
    const images = [...firstPageList, ...secondPageList]
    bingList.value = images.map((item: any) => {
      const url = `https://cn.bing.com/${item.url}`
      const thumb = `https://cn.bing.com/${item.urlbase}_320x240.jpg&rf=LaDigue_1920x1080.jpg&pid=hp`
      return {
        url,
        thumb
      }
    })
  } catch (e) {
    error.value = true
    console.error(e)
  } finally {
    loading.value = false
  }
}

const getUnsplashList = async () => {
  try {
    loading.value = true
    error.value = false
    const res = await fetch(`${apiURL}/photos?pageSize=18`)
    const { errCode, data } = await res.json()
    if (errCode === 200) {
      unsplashList.value = data.list.map((item: any) => {
        return {
          url: item.urls.raw,
          thumb: item.urls.thumb
        }
      })
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

const getP360List = async (resetPage = false) => {
  if (resetPage) {
    p360List.value = []
    page.value = 1
  }
  try {
    loading.value = true
    error.value = false
    const res = await fetch(`${apiURL}/api/360img?cid=${p360CatalogActive.value}&page=${page.value}&pageSize=18`)
    const { errno, data } = await res.json()
    if (errno === 0) {
      p360List.value = [
        ...p360List.value,
        ...data.list.map((item: any) => {
          return {
            url: item.url.replace('http', 'https'),
            thumb: `${item.url.replace('http', 'https')}?x-oss-process=image/resize,w_300/quality,q_90`
          }
        })
      ]
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

const handleOpenSelector = () => {
  dialogVisible.value = true
  if (!beginLoad.value) beginLoad.value = true
}

watch(() => [beginLoad.value, tabIndex.value, p360CatalogActive.value], () => {
  if (tabIndex.value === 1) {
    if (!bingList.value || bingList.value.length === 0) getBingList()
  } else if (tabIndex.value === 2) {
    if (!unsplashList.value || unsplashList.value.length === 0) getUnsplashList()
  } else if (tabIndex.value === 3) {
    getP360List(true)
  }
})

const loadP360More = () => {
  page.value++
  getP360List()
}

const handleSelect = (url: string) => {
  emit('submit', url)
  dialogVisible.value = false
}
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100%;
  flex-direction: column;
  display: flex;
  user-select: none;
  .text {
    font-size: 16px;
    color: #888;
    line-height: 28px;
  }
  .tab-title-wrapper {
    display: flex;
    .title {
      margin-right: 20px;
      font-size: 18px;
      color: rgb(43, 43, 43);
      font-weight: bold;
      line-height: 22px;
      font-size: 18px;
      position: relative;
      margin-bottom: 5px;
      cursor: pointer;
      &:after {
        position: absolute;
        content: '';
        left: 0;
        width: 100%;
        bottom: 0;
        height: 8px;
        background: rgba($color-warning, .2);
        transform: scale(0);
        transition: transform .3s ease-in-out;
      }
      &.active:after {
        transform: scale(1);
      }
    }
  }
  .sub-tab-container {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    margin: 8px 0;
    .sub-tab-title {
      font-size: 14px;
      position: relative;
      cursor: pointer;
      &:hover,
      &.active {
        color: $color-primary;
      }
      &:not(:last-child){
        margin-right: 6px;
        padding-right: 6px;
        &:after {
          content: '';
          position: absolute;
          right: 0;
          top: 2px;
          height: calc(100% - 4px);
          border-right: 1px solid #eee;
        }
      }
    }
  }
  .tab-container {
    height: 100%;
    flex: 1;
    overflow-y: auto;
  }

  .load-more {
    text-align: center;
    margin: 18px 0;
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
