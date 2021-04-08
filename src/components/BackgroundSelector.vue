<template>
  <el-radio-group v-model="mode" @change="handleBackgroundChange">
    <el-radio :label="1">透明</el-radio>
    <el-radio :label="2">纯色</el-radio>
    <el-radio :label="3">固定图片</el-radio>
    <el-radio :label="4">随机图片</el-radio>
  </el-radio-group>
  <div class="color-selecor" v-if="mode === 2">
    <standard-color-picker v-model="color" show-alpha @change="handleBackgroundChange"></standard-color-picker>
  </div>
  <div class="img-url" v-if="mode === 3">
    <label for="img_url">URL</label>
    <el-input v-model="bgImg" placeholder="输入图片URL" @change="handleBackgroundChange" />
  </div>
  <div class="random-img-type" v-if="mode === 4">
    <div class="row">
      <label class="label" style="line-height: 1">关键词</label>
      <div class="content">
        <el-radio-group v-model="imgType" @change="handleBackgroundChange">
          <el-radio v-for="(value, key) in BG_IMG_TYPE_MAP" :key="key" :label="key">{{value}}</el-radio>
          <el-radio label="Custom">自定义</el-radio>
        </el-radio-group>
        <el-input v-if="imgType === 'Custom'" v-model.lazy="customImgType" placeholder="自定义关键词(英文)" @change="handleBackgroundChange"></el-input>
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
import { defineComponent, ref, watch } from 'vue'
import { BG_IMG_TYPE_MAP } from '@/constanst' 
export default defineComponent({
  name: 'BackgroundSelector',
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
    isFullScreen: {
      type: Boolean,
      default: false
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
      } else if(val.includes('url')) {
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
    })

    const handleBackgroundChange = () => {
      let output = ''
      switch(mode.value) {
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
          const w = !props.isFullScreen ? props.sizeWidth * 80 : window.innerWidth
          const h = !props.isFullScreen ? props.sizeHeight * 80 : window.innerHeight
          const mirrorStr = mirror.value ? `&type=mirror` : ''
          output = `#CBCFF3 url(https://kongfandong.cn/api/randomPhoto?keyword=${keyword}&w=${w}&h=${h}${mirrorStr}) center center / cover`
          break;
      }
      emit('update:background', output) 
    }

    watch(() => [props.sizeWidth, props.sizeHeight], () => {
      handleBackgroundChange()
    })

    return {
      mode,
      bgImg,
      color,
      imgType,
      BG_IMG_TYPE_MAP,
      customImgType,
      mirror,
      handleBackgroundChange,
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
.img-url {
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding-left: 20px;
  label {
    font-weight: bold;
    margin-bottom: 0;
    padding-right: 10px;
  }
}
.random-img-type {
  margin-top: 10px;
  .row {
    display: flex;
    .label {
      font-weight: bold;
      margin-bottom: 0;
      padding-right: 10px;
      width: 80px;
      text-align: right;
      line-height: 32px;
    }
    .content {
      flex: 1
    }
  }
}
:deep {
  .el-radio {
    margin-bottom: 5px;
  }
}
</style>
