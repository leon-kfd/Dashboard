<template>
  <button type="button" class="btn btn-small btn-primary" style="margin: 0;margin-right: 5px;" @click="handleOpenSelector">{{$t('动态壁纸推荐')}}</button>
  <easy-dialog
    v-model="dialogVisible"
    :title="$t('动态壁纸推荐')"
    width="min(760px, 94vw)"
    height="min(480px, 80vh)">
    <div class="tips">{{$t('recommendVideoTips')}}</div>
    <div class="video-content" v-if="beginLoad">
      <div class="title">Basic</div>
      <div class="video-wrapper">
        <div class="video" v-for="item in basicVideoList" :key="item.img" @click="handleSelect(item, 'static')">
          <div class="img-wrapper">
            <img v-if="item.img" :src="item.img" loading="lazy" />
          </div>
        </div>
        <div class="video-fake" v-for="item in 4" :key="item"></div>
      </div>

      <div class="title">Pixabay</div>
      <div class="video-wrapper">
        <div class="video" v-for="item in pixabayVideoList" :key="item.img" @click="handleSelect(item, 'pixabay')">
          <div class="img-wrapper">
            <img v-if="item.img" :src="item.img" loading="lazy" />
          </div>
        </div>
        <div class="video-fake" v-for="item in 4" :key="item"></div>
      </div>
    </div>
    <div class="loading-wrapper" v-if="loading">
      <div class="custom-loading">
        <span class="loader"></span>
      </div>
    </div>
  </easy-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { apiURL } from '@/global'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n';

const { t } = useI18n()
const emit = defineEmits(['submit'])

const beginLoad = ref(false)
const dialogVisible = ref(false)
const loading = ref(false)

const basicVideoList = ref<any[]>([])
const pixabayVideoList = ref<any[]>([])

const getList = async () => {
  const staticVideos = await fetch(`${apiURL}/staticVideos`)
  const staticVideosRes = await staticVideos.json()

  const pixabayVideos = await fetch(`${apiURL}/pixabayVideos`)
  const pixabayVideosRes = await pixabayVideos.json()
  basicVideoList.value = staticVideosRes.data.list
  pixabayVideoList.value = pixabayVideosRes.data.list
}

const handleOpenSelector = () => {
  dialogVisible.value = true
  if (!beginLoad.value) beginLoad.value = true
  getList()
}

const handleSelect = async (item: any, type: string) => {
  try {
    loading.value = true
    if (type === 'pixabay') {
      const pixabayVideo = await fetch(`${apiURL}/tapi/pixabay/videos/?id=${item.id}`)
      const pixabayVideoRes = await pixabayVideo.json()
      if (pixabayVideoRes?.hits && pixabayVideoRes.hits.length) {
        const videoDetail = pixabayVideoRes.hits[0]
        const videoLinks = Object.values(videoDetail.videos)
        let video: any = videoLinks.find((item:any) => item.width === 1920)
        if (!video) video = videoDetail.videos.large
        const url = video.url
        emit('submit', url)
        dialogVisible.value = false
      } else {
        throw new Error('Something error')
      }
    } else if (type === 'static') {
      const staticVideo = await fetch(`${apiURL}/getQiNiuWallpaperURL?fileName=${item.filename}`)
      const staticVideoRes = await staticVideo.json()
      if (staticVideoRes.url) {
        emit('submit', staticVideoRes.url)
        dialogVisible.value = false
      } else {
        throw new Error('Something error')
      }
    }
  } catch {
    ElNotification({
      title: t('错误'),
      type: 'error',
      message: t('获取动态壁纸URL失败')
    })
  } finally {
    loading.value = false
  }
}

</script>
<style lang="scss" scoped>
.loading-wrapper {
  position: absolute;
  top: 48px;
  left: 0;
  width: 100%;
  height: calc(100% - 48px);
  background: rgba(255,255,255,.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.tips {
  font-size: 14px;
  color: #767676;
  padding: 8px 12px;
  border-left: 5px solid $color-warning;
  background: rgba($color-warning, .2);
}
.video-content {
  padding: 20px 0;
  .title {
    display: inline-flex;
    color: rgb(43, 43, 43);
    font-weight: bold;
    font-size: 16px;
    position: relative;
    margin-bottom: 10px;
    &:after {
      position: absolute;
      content: '';
      left: 0;
      width: 100%;
      bottom: 0;
      height: 8px;
      background: rgba($color-warning, 0.2);
    }
  }
}
.video-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  font-size: 16px;
  margin-bottom: 20px;
  .video-fake {
    width: 12em;
    height: 0;
    margin: 0 .2em;
  }
  .video {
    width: 12em;
    height: 6.75em;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 10px 10px -5px rgb(0 0 0 / 4%);
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
  .video-wrapper {
    font-size: 12px;
  }
}
</style>
