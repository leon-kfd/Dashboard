<template>
  <button type="button" class="btn btn-small btn-primary" style="margin: 0;margin-right: 5px;" @click="handleOpenSelector">{{$t('动态壁纸推荐')}}</button>
  <easy-dialog
    v-model="dialogVisible"
    :title="$t('动态壁纸推荐')"
    width="min(760px, 94vw)"
    height="min(480px, 80vh)">
    <div class="tips">{{$t('recommendVideoTips')}}</div>
    <div class="video-wrapper" v-if="beginLoad">
      <div class="video" v-for="item in videoList" :key="item.img" @click="handleSelect(item)">
        <div class="img-wrapper">
          <img v-if="item.img" :src="item.img" loading="lazy" />
        </div>
      </div>
      <div class="video-fake" v-for="item in 4" :key="item"></div>
    </div>
  </easy-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const emit = defineEmits(['submit'])
const beginLoad = ref(false)
const dialogVisible = ref(false)
const handleOpenSelector = () => {
  dialogVisible.value = true
  if (!beginLoad.value) beginLoad.value = true
}
const handleSelect = (item: any) => {
  emit('submit', item.video)
  dialogVisible.value = false
}

// videoList
const CDN_VIDEO_MAP = [4, 5, 6, 10, 11, 14, 15, 16, 17, 18, 19, 21, 22, 23, 24, 25, 26, 27, 28, 30, 31, 32, 33, 34, 35, 37, 39, 41, 42, 43, 44, 47, 49]
const videoList = CDN_VIDEO_MAP.map(i => {
  return {
    img: `https://fastly.jsdelivr.net/gh/dsource/static/assets/${i}-test.jpg`,
    video: `https://fastly.jsdelivr.net/gh/dsource/static/assets/${i}-test.webm`
  }
})

</script>
<style lang="scss" scoped>
.tips {
  font-size: 14px;
  color: #767676;
  padding: 8px 12px;
  border-left: 5px solid $color-warning;
  background: rgba($color-warning, .2);
}
.video-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  font-size: 16px;
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
