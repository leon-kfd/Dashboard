<template>
  <div 
    class="page" 
    :style="{
      background: $store.state.global.background
    }">
    <GooeyMenu @addComponent="showAddDialog" @showGlobalConfig="showGlobalConfig"/>
    <Layout @edit="showEditDialog"/>
    <BaseConfig ref="baseConfig" />
    <GlobalConfig v-model:visible="globalConfigVisible" />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Layout from '@/components/Layout.vue'
import BaseConfig from '@/components/BaseConfig.vue'
import GooeyMenu from '@/components/GooeyMenu.vue'
import GlobalConfig from '@/components/GlobalConfig.vue'
export default defineComponent({
  name: 'App',
  components: {
    Layout,
    BaseConfig,
    GooeyMenu,
    GlobalConfig
  },
  setup () {
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
    return {
      baseConfig,
      showAddDialog,
      showEditDialog,
      globalConfigVisible,
      showGlobalConfig
    }
  }
})
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  height: 100%;
}
</style>