<template>
  <div class="row">
    <div class="label">滤镜</div>
    <div class="content">
      <el-radio-group v-model="mode" @change="handleUpdateValue">
        <el-radio :label="1">无</el-radio>
        <el-radio :label="2">亮度</el-radio>
        <el-radio :label="3">高斯模糊</el-radio>
      </el-radio-group>
      <div v-if="mode === 2">
        <div class="flex-center-y">
          <el-input-number
            v-model="brightness"
            :min="0.1"
            :max="1.5"
            :step="0.1"
            controls-position="right"
            @change="handleUpdateValue"
          ></el-input-number>
          <Tips content="基于CSS3:filter属性的brightness" />
        </div>
      </div>
      <div v-if="mode === 3">
        <div class="flex-center-">
          <el-input-number
            v-model="blur"
            :min="0"
            :max="100"
            controls-position="right"
            @change="handleUpdateValue"
          ></el-input-number>
          <span style="font-weight: bold; margin: 0 4px">px</span>
          <Tips content="基于CSS3:filter属性的blur" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Tips from '@/components/Tools/Tips.vue'
export default defineComponent({
  name: 'BackgroundFilterSelector',
  components: {
    Tips
  },
  props: {
    filter: {
      type: String
    }
  },
  setup(props, { emit }) {
    const mode = ref(1)
    const brightness = ref(1)
    const blur = ref(5)

    watch(
      () => props.filter,
      (val) => {
        if (val) {
          const match = /[\d.]+/.exec(val)
          if (match && match.length >= 0) {
            if (val.includes('brightness')) {
              mode.value = 2
              brightness.value = +match[0]
            } else if (val.includes('blur')) {
              mode.value = 3
              blur.value = +match[0]
            }
            return
          }
        }
        mode.value = 1
      },
      {
        immediate: true
      }
    )

    const handleUpdateValue = () => {
      let output = ''
      switch (mode.value) {
        case 1:
          break
        case 2:
          output = `brightness(${brightness.value})`
          break
        case 3:
          output = `blur(${blur.value}px)`
          break
      }
      emit('update:filter', output)
    }

    return {
      mode,
      brightness,
      blur,
      handleUpdateValue
    }
  }
})
</script>
<style lang="scss" scoped>
.row {
  display: flex;
  margin-bottom: 10px;
  .label {
    font-weight: bold;
    margin-bottom: 0;
    margin-right: 8px;
    width: 84px;
    text-align: right;
    line-height: 32px;
  }
  .content {
    flex: 1;
  }
}
:deep(.el-radio) {
  margin-bottom: 5px;
}
</style>
