<template>
  <el-radio-group v-model="mode" @change="handleBackgroundChange">
    <el-radio :label="1">{{$t('透明')}}</el-radio>
    <el-radio :label="2">{{$t('纯色')}}</el-radio>
    <el-radio :label="3">{{$t('网络图片')}}</el-radio>
    <el-radio :label="4">{{$t('随机图片')}}</el-radio>
  </el-radio-group>
  <div class="color-selecor" v-if="mode === 2">
    <div class="form-row-control">
      <div class="label">{{$t('选择颜色')}}</div>
      <div class="content">
        <standard-color-picker
          v-model="color"
          show-alpha
          @change="handleBackgroundChange"
        ></standard-color-picker>
      </div>
    </div>
  </div>
  <div class="img-url" v-if="mode === 3">
    <div class="form-row-control">
      <div class="label">URL</div>
      <div class="content" style="flex-wrap: wrap">
        <div class="flex-center-y" style="width: 100%">
          <el-input
            v-model="bgImg"
            type="textarea"
            :autosize="{ minRows: 2, maxRows: 8 }"
            :placeholder="isFullScreen ? $t('输入图片或动态壁纸URL') : $t('输入图片URL')"
            @change="handleBackgroundChange"
          />
          <Tips
            v-if="isFullScreen"
            :content="$t('bgImgTips')"
          ></Tips>
        </div>
        <div>
          <RecommendVideo v-if="recommendVideo" @submit="handleRecommendSelect" />
          <RecommendPicture v-if="recommendPicture" @submit="handleRecommendSelect" />
        </div>
      </div>
    </div>
  </div>
  <div class="random-img-type" v-if="mode === 4">
    <div class="form-row-control">
      <label class="label">{{$t('图片源')}}</label>
      <div class="content">
        <el-radio-group v-model="randomSource" @change="handleBackgroundChange">
          <el-radio label="sina">{{$t('新浪')}}</el-radio>
          <el-radio label="unsplash">UNSPLASH</el-radio>
        </el-radio-group>
      </div>
    </div>
    <template v-if="randomSource === 'unsplash'">
      <div class="form-row-control">
        <label class="label" style="line-height: 32px">{{$t('关键词')}}</label>
        <div class="content" style="flex-wrap: wrap;">
          <el-radio-group v-model="imgType" @change="handleBackgroundChange">
            <el-radio v-for="(value, key) in BG_IMG_TYPE_MAP" :key="key" :label="key">{{
              store.global.lang === 'zh-cn' ? value: key
            }}</el-radio>
            <el-radio label="Custom">{{$t('自定义')}}</el-radio>
          </el-radio-group>
          <el-input
            v-if="imgType === 'Custom'"
            v-model.lazy="customImgType"
            :placeholder="$t('自定义关键词(英文)')"
            @change="handleBackgroundChange"
          ></el-input>
        </div>
      </div>
      <div class="form-row-control">
        <label class="label">{{$t('国内镜像')}}</label>
        <div class="content">
          <el-switch v-model="mirror" @change="handleBackgroundChange"></el-switch>
        </div>
      </div>
    </template>
    <div class="form-row-control">
      <label class="label">{{$t('定时刷新')}}</label>
      <div class="content flex-center-y">
        <el-input-number
          v-model="duration"
          :min="0"
          :max="3600"
          controls-position="right"
          @change="handleBackgroundChange"
        ></el-input-number>
        <Tips :content="$t('refreshDurationTips')" />
      </div>
    </div>
    <div class="form-row-control">
      <label class="label ellipsis">{{$t('刷新按钮')}}</label>
      <div class="content flex-center-y">
        <el-switch v-model="showRefreshBtn" style="width: 150px" />
        <Tips :content="$t('refreshBtnTips')" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineAsyncComponent, defineComponent, ref, watch } from 'vue'
import { BG_IMG_TYPE_MAP } from '@/constanst'
import StandardColorPicker from '@/components/FormControl/StandardColorPicker.vue'
import Tips from '@/components/Tools/Tips.vue'
import { useStore } from '@/store'
export default defineComponent({
  name: 'BackgroundSelector',
  components: {
    StandardColorPicker,
    Tips,
    RecommendVideo: defineAsyncComponent(() => import('@/components/Recommend/RecommendVideo.vue')),
    RecommendPicture: defineAsyncComponent(
      () => import('@/components/Recommend/RecommendPicture.vue')
    )
  },
  props: {
    background: {
      type: String,
      default: ''
    },
    w: {
      type: Number,
      default: 4
    },
    h: {
      type: Number,
      default: 4
    },
    positionMode: {
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
  setup(props, { emit }) {
    const mode = ref(1)
    const color = ref('rgba(255,255,255,1)')
    const bgImg = ref('')
    const randomSource = ref('sina')
    const imgType = ref('Nature')
    const customImgType = ref('')
    const mirror = ref(true)
    const duration = ref(0)

    watch(
      () => props.background,
      (val) => {
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
            const _url = new URL(url)
            if (url.includes('sina')) {
              randomSource.value = 'sina'
              duration.value = ~~(_url.searchParams.get('duration') || 0)
            } else {
              const keyword = _url.searchParams.get('keyword')
              if (keyword) {
                if (Object.keys(BG_IMG_TYPE_MAP).includes(keyword)) {
                  imgType.value = keyword
                } else {
                  imgType.value = 'Custom'
                  customImgType.value = keyword
                }
              }
              mirror.value = url.includes('mirror')
              randomSource.value = 'unsplash'
              duration.value = ~~(_url.searchParams.get('duration') || 0)
            }
            mode.value = 4
          } else {
            mode.value = 3
            bgImg.value = url
          }
        } else {
          mode.value = 2
          color.value = val || 'rgba(255,255,255,1)'
        }
      },
      {
        immediate: true
      }
    )

    const w = computed(() => {
      if (props.isFullScreen) {
        return window.innerWidth
      } else if (props.positionMode === 2) {
        return props.w
      } else {
        return props.w * 80
      }
    })

    const h = computed(() => {
      if (props.isFullScreen) {
        return window.innerHeight
      } else if (props.positionMode === 2) {
        return props.h
      } else {
        return props.h * 80
      }
    })

    const handleBackgroundChange = () => {
      let output = ''
      switch (mode.value) {
        case 1:
          output = 'transparent'
          break
        case 2:
          output = color.value
          break
        case 3:
          output = `#242428 url(${bgImg.value}) center center / cover`
          break
        case 4:
          if (randomSource.value === 'sina') {
            output = `#242428 url(https://kongfandong.cn/api/randomPhoto/sina?duration=${duration.value}) center center / cover`
          } else {
            const keyword = imgType.value === 'Custom' ? customImgType.value : imgType.value
            const mirrorStr = mirror.value ? '&type=mirror' : ''
            output = `#242428 url(https://kongfandong.cn/api/randomPhoto?keyword=${keyword}&w=${w.value}&h=${h.value}${mirrorStr}&duration=${duration.value}) center center / cover`
          }
          break
      }
      emit('update:background', output)
    }

    watch(
      () => [props.w, props.h, props.positionMode],
      () => {
        handleBackgroundChange()
      }
    )

    const handleRecommendSelect = (url: string) => {
      bgImg.value = url
      handleBackgroundChange()
    }

    const store = useStore()
    const showRefreshBtn = computed({
      get: () => store.showRefreshBtn,
      set: (value: boolean) => {
        store.updateState({ key: 'showRefreshBtn', value })
      }
    })

    return {
      mode,
      bgImg,
      color,
      imgType,
      randomSource,
      BG_IMG_TYPE_MAP,
      customImgType,
      mirror,
      duration,
      handleBackgroundChange,
      handleRecommendSelect,
      showRefreshBtn,
      store
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
:deep(.el-radio) {
  margin-bottom: 5px;
}
</style>
