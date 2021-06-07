<template>
  <el-radio-group v-model="mode" @change="handleBackgroundChange">
    <el-radio :label="1">透明</el-radio>
    <el-radio :label="2">纯色</el-radio>
    <el-radio :label="3">网络图片</el-radio>
    <el-radio :label="4">随机图片</el-radio>
  </el-radio-group>
  <div class="color-selecor" v-if="mode === 2">
    <div class="row">
      <div class="label">选择颜色</div>
      <div class="content">
        <standard-color-picker v-model="color" show-alpha @change="handleBackgroundChange"></standard-color-picker>
      </div>
    </div>
  </div>
  <div class="img-url" v-if="mode === 3">
    <div class="row">
      <div class="label">URL</div>
      <div class="content">
        <div class="flex-center-y">
          <el-input
            v-model="bgImg"
            type="textarea"
            autosize
            :rows="2"
            :placeholder="isFullScreen?'输入图片或动态壁纸URL':'输入图片URL'"
            @change="handleBackgroundChange" />
          <Tips v-if="isFullScreen" content="支持输入Video视频网络路径会自动识别成动态壁纸，需要原生浏览器Video支持播放的视频格式"></Tips>
        </div>
        <div>
          <RecommendVideo v-if="recommendVideo" @submit="handleRecommendSelect" />
          <RecommendPicture v-if="recommendPicture" @submit="handleRecommendSelect" />
        </div>
      </div>
    </div>
  </div>
  <div class="random-img-type" v-if="mode === 4">
    <div class="row">
      <label class="label" style="line-height: 1">关键词</label>
      <div class="content">
        <el-radio-group v-model="imgType" @change="handleBackgroundChange">
          <el-radio v-for="(value, key) in BG_IMG_TYPE_MAP" :key="key" :label="key">{{value}}</el-radio>
          <el-radio label="Custom">自定义</el-radio>
        </el-radio-group>
        <el-input
          v-if="imgType === 'Custom'"
          v-model.lazy="customImgType"
          placeholder="自定义关键词(英文)"
          @change="handleBackgroundChange"></el-input>
      </div>
    </div>
    <div class="row">
      <label class="label">国内镜像</label>
      <div class="content">
        <el-switch v-model="mirror" @change="handleBackgroundChange"></el-switch>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, ref, watch } from 'vue'
import { BG_IMG_TYPE_MAP } from '@/constanst'
import StandardColorPicker from '@/components/FormControl/StandardColorPicker.vue'
import Tips from '@/components/Tools/Tips.vue'
export default defineComponent({
  name: 'BackgroundSelector',
  components: {
    StandardColorPicker,
    Tips,
    RecommendVideo: defineAsyncComponent(() => import('@/components/Recommend/RecommendVideo.vue')),
    RecommendPicture: defineAsyncComponent(() => import('@/components/Recommend/RecommendPicture.vue'))
  },
  props: {
    background: {
      type: String,
      default: ''
    },
    sizeWidth: {
      type: Number,
      default: 4
    },
    sizeHeight: {
      type: Number,
      default: 4
    },
    sizeWidthUnit: {
      type: Number,
      default: 1
    },
    sizeHeightUnit: {
      type: Number,
      default: 1
    },
    isFullScreen: {
      type: Boolean,
      default: false
    },
    recommendVideo: {
      type: Boolean,
      default: false
    },
    recommendPicture: {
      type: Boolean,
      default: true
    }
  },
  setup (props, { emit }) {
    const mode = ref(1)
    const color = ref('rgba(255,255,255,1)')
    const bgImg = ref('')
    const imgType = ref('Nature')
    const customImgType = ref('')
    const mirror = ref(true)

    watch(() => props.background, (val) => {
      // Transform background to form data.
      if (!val || val.includes('transparent')) {
        mode.value = 1
      } else if (val.includes('url')) {
        const getURL = (input: string) => {
          const reg = /url\(['"]?(.*?)['"]?\)/
          const match = input.match(reg)
          return match && match.length >= 2 ? match[1] : ''
        }
        const url = getURL(val)
        if (url.includes('/api/randomPhoto')) {
          const getKeyword = (input: string) => {
            const reg = /keyword=(.*?)&/
            const match = input.match(reg)
            return match && match.length >= 2 ? match[1] : ''
          }
          const keyword = getKeyword(url)
          if (keyword) {
            if (Object.keys(BG_IMG_TYPE_MAP).includes(keyword)) {
              imgType.value = keyword
            } else {
              imgType.value = 'Custom'
              customImgType.value = keyword
            }
          }
          mirror.value = url.includes('mirror')
          mode.value = 4
        } else {
          mode.value = 3
          bgImg.value = url
        }
      } else {
        mode.value = 2
        color.value = val || 'rgba(255,255,255,1)'
      }
    }, {
      immediate: true
    })

    const w = computed(() => {
      if (props.isFullScreen) {
        return window.innerWidth
      } else if (props.sizeWidthUnit === 2) {
        return props.sizeWidth
      } else {
        return props.sizeWidth * 80
      }
    })

    const h = computed(() => {
      if (props.isFullScreen) {
        return window.innerHeight
      } else if (props.sizeHeightUnit === 2) {
        return props.sizeHeight
      } else {
        return props.sizeHeight * 80
      }
    })

    const handleBackgroundChange = () => {
      let output = ''
      switch (mode.value) {
        case 1:
          output = 'transparent';
          break;
        case 2:
          output = color.value;
          break;
        case 3:
          output = `#CBCFF3 url(${bgImg.value}) center center / cover`;
          break;
        case 4:
          const keyword = imgType.value === 'Custom' ? customImgType.value : imgType.value
          const mirrorStr = mirror.value ? '&type=mirror' : ''
          output = `#CBCFF3 url(https://kongfandong.cn/api/randomPhoto?keyword=${keyword}&w=${w.value}&h=${h.value}${mirrorStr}) center center / cover`
          break;
      }
      emit('update:background', output)
    }

    watch(() => [props.sizeWidth, props.sizeHeight, props.sizeWidthUnit, props.sizeHeightUnit], () => {
      handleBackgroundChange()
    })

    const handleRecommendSelect = (url: string) => {
      bgImg.value = url
      handleBackgroundChange()
    }

    return {
      mode,
      bgImg,
      color,
      imgType,
      BG_IMG_TYPE_MAP,
      customImgType,
      mirror,
      handleBackgroundChange,
      handleRecommendSelect
    }
  }
})
</script>
<style lang="scss" scoped>
.radio-group-item {
  display: inline-flex;
  margin-right: 10px;
  label {
    cursor: pointer;
    padding-left: 3px;
  }
}
.random-img-type {
  margin-top: 10px;
}
.row {
  display: flex;
  margin-bottom: 10px;
  .label {
    font-weight: bold;
    margin-bottom: 0;
    margin-right: 8px;
    width: 72px;
    text-align: right;
    line-height: 32px;
  }
  .content {
    flex: 1;
  }
}
:deep {
  .el-radio {
    margin-bottom: 5px;
  }
}
</style>
