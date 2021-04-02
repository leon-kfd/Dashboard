<template>
  <el-radio-group v-model="mode" @change="handleBackgroundChange" style="margin-bottom: 5px;">
    <el-radio :label="1">透明</el-radio>
    <el-radio :label="2">纯色</el-radio>
    <el-radio :label="3">固定图片</el-radio>
    <el-radio :label="4">随机图片</el-radio>
  </el-radio-group>
  <div class="color-selecor" v-if="mode === 2">
    <el-color-picker v-model="color" @change="handleBackgroundChange" show-alpha></el-color-picker>
    <label for="color">{{color}}</label>
  </div>
  <div class="img-url" v-if="mode === 3">
    <label for="img_url">URL</label>
    <el-input v-model="bgImg" placeholder="输入图片URL" @change="handleBackgroundChange" />
  </div>
  <div class="random-img-type" v-if="mode === 4">
    <label for="img_type">Keyword</label>
    <div>
      <el-radio-group v-model="imgType" @change="handleBackgroundChange">
        <el-radio label="Wallpapers">壁纸</el-radio>
        <el-radio label="Nature">自然</el-radio>
        <el-radio label="People">人物</el-radio>
        <el-radio label="Architecture">建筑</el-radio>
        <el-radio label="Technology">科技</el-radio>
        <el-radio label="Animals">动物</el-radio>
        <el-radio label="Custom">自定义</el-radio>
      </el-radio-group>
      <el-input v-if="imgType === 'Custom'" v-model.lazy="customImgType" placeholder="自定义关键词(英文)" @change="handleBackgroundChange"></el-input>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { ElColorPicker } from 'element-plus'
export default defineComponent({
  name: 'BackgroundSelector',
  components: {
    ElColorPicker
  },
  props: {
    background: {
      type: String,
      default: ''
    },
    sizeWidth: {
      type: Number,
      default: 4
    }
  }, 
  setup (props, { emit }) {
    const mode = ref(1)
    const color = ref('rgba(255,255,255,1)')
    const bgImg = ref('')
    const imgType = ref('Wallpapers')
    const customImgType = ref('')

    watch(() => props.background, (val) => {
      if (!val || val.includes('transparent')) {
        mode.value = 1
      } else if(val.includes('url')) {
        const getURL = (input: string) => {
          const reg = /url\(['"]?(.*?)['"]?\)/
          const match = input.match(reg)
          if (match && match.length >= 2) {
            return match[1]
          } else {
            return ''
          }
        }
        const url = getURL(val)
        if (url.includes('/api/randomPhoto')) {
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
          const w = props.sizeWidth * 80
          output = `#CBCFF3 url(https://kongfandong.cn/api/randomPhoto?type=mirror&keyword=${keyword}&w=${w}) center center / cover`
          break;
      }
      emit('update:background', output) 
    }

    watch(() => props.sizeWidth, () => {
      handleBackgroundChange()
    })

    return {
      mode,
      bgImg,
      color,
      imgType,
      customImgType,
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
.color-selecor {
  display: flex;
  align-items: center;
  input[type=color] {
    cursor: pointer;
    padding: 4px 10px;
    min-height: auto;
  }
  label {
    font-weight: bold;
    padding-left: 10px;
    // text-transform: uppercase;
    margin-bottom: 0;
  }
}
.img-url {
  display: flex;
  align-items: center;
  margin-top: 10px;
  label {
    font-weight: bold;
    margin-bottom: 0;
    padding-right: 10px;
  }
}
.random-img-type {
  display: flex;
  margin-top: 10px;
  label[for='img_type'] {
    font-weight: bold;
    margin-bottom: 0;
    padding-right: 10px;
    line-height: 1;
  }
  :deep {
    .el-radio {
      margin-bottom: 5px;
    }
  }
}
</style>
