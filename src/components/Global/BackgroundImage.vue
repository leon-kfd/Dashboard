<template>
  <div
    class="wrapper"
    :style="{
      background: !backgroundURL && background
    }">
    <el-image
      v-if="backgroundURL"
      :src="backgroundURL"
      fit="cover"
      class="bg-img">
      <template #placeholder>
        <div class="bg-placeholder">Image Loading...</div>
      </template>
      <template #error>
        <div class="bg-placeholder">Image Error</div>
      </template>
    </el-image>
    <i v-if="showRefresh && backgroundURL" class="el-icon-refresh btn-refresh" title="刷新背景图" @click="refresh"></i>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
export default defineComponent({
  name: 'Unset',
  props: {
    background: {
      type: String
    },
    showRefresh: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const t = ref(+new Date())
    const getURL = (input: string) => {
      const reg = /url\(['"]?(.*?)['"]?\)/
      const match = input.match(reg)
      return match && match.length >= 2 ? match[1] : ''
    }
    const backgroundURL = computed(() => {
      if (props.background && props.background.includes('url')) {
        let url = getURL(props.background)
        if (url.includes('/api/randomPhoto?')) {
          url += `&t=${t.value}`
        }
        return url
      }
      return ''
    })

    const refresh = () => {
      t.value = +new Date()
    }

    return {
      backgroundURL,
      refresh,
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: 0;
}
.bg-img {
  width: 100%;
  height: 100%;
  :deep {
    .el-image__inner {
      transform: scale(1.02);
    }
  }
}
.bg-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #515bec, #60dfd5, #8c60df, #f1a38b);
  background-size: 400% 400%;
  animation: bgmove 15s ease infinite;
  // animation-name: bgmove;
  // animation-duration: 10s;
  // animation-timing-function: linear;
  // animation-iteration-count: infinite;
  // animation-direction: alternate;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  color: #e7e7e7;
  font-size: 14px;
  padding-bottom: 30px;
}
.btn-refresh {
  position: absolute;
  left: 16px;
  bottom: 16px;
  font-size: 20px;
  z-index: 20;
  color: $--color-white;
  cursor: pointer;
  &:hover {
    color: $--color-grey5;
  }
}
</style>
