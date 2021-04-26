<template>
  <div
    class="wrapper"
    :style="{
      background: !backgroundURL && background
    }">
    <el-image v-if="backgroundURL" :src="backgroundURL" fit="cover" class="bg-img">
      <template #placeholder>
        <div class="bg-placeholder">Image Loading...</div>
      </template>
      <template #error>
        <div class="bg-placeholder">Image Error</div>
      </template>
    </el-image>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
export default defineComponent({
  name: 'Unset',
  props: {
    background: {
      type: String
    }
  },
  setup(props) {
    const getURL = (input: string) => {
      const reg = /url\(['"]?(.*?)['"]?\)/
      const match = input.match(reg)
      return match && match.length >= 2 ? match[1] : ''
    }
    const backgroundURL = computed(() => {
      if (props.background && props.background.includes('url')) {
        const url = getURL(props.background)
        return url
      }
      return ''
    })

    return {
      backgroundURL
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: -1;
  font-size: 0;
}
.bg-img {
  width: 100%;
  height: 100%;
}
.bg-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #8c60df, #e499a1, #f0b187,#e499a1, #8c60df);
  background-size: 200% 100%;
  animation-name: bgmove;
  animation-duration: 10s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
  animation-direction: alternate;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: #e7e7e7;
  font-size: 14px;
  padding-bottom: 30px;
}
</style>
