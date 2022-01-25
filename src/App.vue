<template>
  <div
    class="page"
    :style="global.globalFontFamily && `font-family: ${global.globalFontFamily}`"
    v-mouse-menu="{ menuList, drop: () => isMobile }">
    <BackgroundImage :background="global.background" :filter="global.backgroundFilter" ref="bg"/>
    <GooeyMenu @addComponent="showAddDialog" @showGlobalConfig="showGlobalConfig" @showAuxiliaryConfig="showAuxiliaryConfig"/>
    <Layout @edit="showEditDialog"/>
    <BaseConfig ref="baseConfig" />
    <GlobalConfig v-model:visible="globalConfigVisible" />
    <AuxiliaryConfig v-model:visible="axuiliaryConfigVisible" />
    <DefaultTheme />
    <TabCarousel />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed } from 'vue'
import Layout from '@/components/Layout.vue'
import BaseConfig from '@/components/BaseConfig.vue'
import GooeyMenu from '@/components/GooeyMenu.vue'
import GlobalConfig from '@/components/GlobalConfig.vue'
import BackgroundImage from '@/components/Global/BackgroundImage.vue'
import DefaultTheme from '@/components/Global/DefaultTheme.vue'
import AuxiliaryConfig from '@/components/AuxiliaryConfig.vue'
import TabCarousel from './components/Global/TabCarousel.vue'
import vMouseMenu from '@/plugins/mouse-menu'
import { useStore } from 'vuex'
const store = useStore()
const global = computed(() => store.state.global)
const isLock = computed(() => store.state.isLock)

const isMobile = ('ontouchstart' in window)

if (global.value.siteTitle) {
  document.title = global.value.siteTitle
}

const bg = ref()

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

const menuList = ref([
  {
    label: '添加组件',
    fn: () => {
      showAddDialog()
    },
    icon: 'el-icon-plus'
  },
  {
    label: '全局设置',
    fn: () => {
      showGlobalConfig()
    },
    icon: 'el-icon-setting'
  },
  {
    label: '辅助功能',
    fn: () => {
      showAuxiliaryConfig()
    },
    icon: 'el-icon-magic-stick'
  },
  {
    line: true
  },
  {
    label: '刷新壁纸',
    hidden: () => !global.value.background.includes('api/randomPhoto'),
    fn: () => {
      bg.value.refresh()
    },
    icon: 'el-icon-refresh'
  },
  {
    label: () => isLock.value ? '进入编辑' : '锁定',
    fn: () => {
      store.dispatch('updateIsLock', !isLock.value)
    },
    icon: () => isLock.value ? 'el-icon-unlock' : 'el-icon-lock'
  }
])
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100%;
  position: relative;
  // transition: filter ease-in-out .4s;
}
</style>
