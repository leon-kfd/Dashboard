<template>
  <div class="page">
    <BackgroundImage :background="$store.state.global.background" :filter="$store.state.global.backgroundFilter"/>
    <GooeyMenu @addComponent="showAddDialog" @showGlobalConfig="showGlobalConfig" @showAuxiliaryConfig="showAuxiliaryConfig"/>
    <Layout @edit="showEditDialog"/>
    <BaseConfig ref="baseConfig" />
    <GlobalConfig v-model:visible="globalConfigVisible" />
    <AuxiliaryConfig v-model:visible="axuiliaryConfigVisible" />
    <DefaultTheme />
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Layout from '@/components/Layout.vue'
import BaseConfig from '@/components/BaseConfig.vue'
import GooeyMenu from '@/components/GooeyMenu.vue'
import GlobalConfig from '@/components/GlobalConfig.vue'
import BackgroundImage from '@/components/Global/BackgroundImage.vue'
import DefaultTheme from '@/components/Global/DefaultTheme.vue'
import AuxiliaryConfig from '@/components/AuxiliaryConfig.vue'
export default defineComponent({
  name: 'App',
  components: {
    Layout,
    BaseConfig,
    GooeyMenu,
    GlobalConfig,
    BackgroundImage,
    DefaultTheme,
    AuxiliaryConfig
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

    const axuiliaryConfigVisible = ref(false)
    const showAuxiliaryConfig = () => {
      axuiliaryConfigVisible.value = true
    }
    return {
      baseConfig,
      showAddDialog,
      showEditDialog,
      globalConfigVisible,
      showGlobalConfig,
      axuiliaryConfigVisible,
      showAuxiliaryConfig
    }
  }
})
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100%;
  position: relative;
  transition: filter ease-in-out .4s;
}
</style>
