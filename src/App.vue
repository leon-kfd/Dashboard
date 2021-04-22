<template>
  <div
    class="page"
    :style="{
      background: !backgroundURL && $store.state.global.background
    }">
    <el-image v-if="backgroundURL" :src="backgroundURL" fit="cover" class="bg-img">
      <template #placeholder>
        <div class="bg-placeholder"></div>
      </template>
    </el-image>
    <GooeyMenu @addComponent="showAddDialog" @showGlobalConfig="showGlobalConfig"/>
    <Layout @edit="showEditDialog"/>
    <BaseConfig ref="baseConfig" />
    <GlobalConfig v-model:visible="globalConfigVisible" />
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import Layout from '@/components/Layout.vue'
import BaseConfig from '@/components/BaseConfig.vue'
import GooeyMenu from '@/components/GooeyMenu.vue'
import GlobalConfig from '@/components/GlobalConfig.vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'App',
  components: {
    Layout,
    BaseConfig,
    GooeyMenu,
    GlobalConfig
  },
  setup () {
    const store = useStore()
    const baseConfig = ref()
    const showAddDialog = () => {
      baseConfig.value.open()
    }
    const showEditDialog = (id: string) => {
      baseConfig.value.open(id)
    }

    const globalConfigVisible = ref(false)
    const showGlobalConfig = () => {
      globalConfigVisible.value = true
    }
    const getURL = (input: string) => {
      const reg = /url\(['"]?(.*?)['"]?\)/
      const match = input.match(reg)
      return match && match.length >= 2 ? match[1] : ''
    }
    const backgroundURL = computed(() => {
      if (store.state.global.background && store.state.global.background.includes('url')) {
        const url = getURL(store.state.global.background)
        console.log(1, url)
        return url
      }
      console.log(2)
      return ''
    })
    return {
      baseConfig,
      showAddDialog,
      showEditDialog,
      globalConfigVisible,
      showGlobalConfig,
      backgroundURL
    }
  }
})
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100%;
  position: relative;
  .bg-img {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  .bg-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #8c60df, #e499a1, #f0b187, #e499a1, #8c60df);
    background-size: 200% 100%;
    animation-name: bgmove;
    animation-duration: 10s;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
    animation-direction: alternate;
  }
}
</style>
