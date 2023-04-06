<template>
  <div
    class="page"
    :style="global.globalFontFamily && `font-family: ${global.globalFontFamily}`"
    v-mouse-menu="{ menuList, drop: () => isMobile, iconType: 'vnode-icon' }"
  >
    <BackgroundImage :background="global.background" :filter="global.backgroundFilter" ref="bg" />
    <BackgroundEffect />
    <GooeyMenu
      v-if="global.showMenuBtn !== false"
      @addComponent="showAddDialog"
      @showGlobalConfig="showGlobalConfig"
      @showAuxiliaryConfig="showAuxiliaryConfig"
    />
    <Layout @edit="showEditDialog" />
    <BaseConfig ref="baseConfig" />
    <GlobalConfig v-model:visible="globalConfigVisible" />
    <AuxiliaryConfig v-model:visible="axuiliaryConfigVisible" />
    <DefaultTheme v-if="needShowDefaultThemePicker" />
    <TabCarousel />
  </div>
</template>
<script lang="ts" setup>
import { ref, computed, h, onMounted } from 'vue'
import Layout from '@/components/Layout.vue'
import BaseConfig from '@/components/BaseConfig.vue'
import GooeyMenu from '@/components/GooeyMenu.vue'
import GlobalConfig from '@/components/GlobalConfig.vue'
import BackgroundImage from '@/components/Global/BackgroundImage.vue'
import BackgroundEffect from '@/components/Global/BackgroundEffect.vue'
import DefaultTheme from '@/components/Global/DefaultTheme.vue'
import AuxiliaryConfig from '@/components/AuxiliaryConfig.vue'
import TabCarousel from './components/Global/TabCarousel.vue'
import vMouseMenu from '@/plugins/mouse-menu'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { loadHarmonyOSFont } from '@/utils'
import Icon from '@/components/Tools/Icon.vue'
const store = useStore()
const global = computed(() => store.global)
const isLock = computed(() => store.isLock)
const { t } = useI18n()

const isMobile = 'ontouchstart' in window

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

const handleDownloadBg = () => {
  const url = document.querySelector('.global-bg-img')?.getAttribute('src')
  if (url) {
    // 当前因非同域名图片不能直接下载，会新窗口打开
    const a = document.createElement('a')
    a.setAttribute('href', url)
    a.setAttribute('download', 'background')
    a.setAttribute('target', '_blank')
    a.click()
  }
}

const menuList = ref([
  {
    label: () => t('添加组件'),
    fn: () => {
      showAddDialog()
    },
    icon: h(Icon, { name: 'add', size: 20 })
  },
  {
    label: () => t('全局设置'),
    fn: () => {
      showGlobalConfig()
    },
    icon: h(Icon, { name: 'setting-4', size: 18 })
  },
  {
    label: () => t('辅助功能'),
    fn: () => {
      showAuxiliaryConfig()
    },
    icon: h(Icon, { name: 'tools', size: 18 })
  },
  {
    line: true
  },
  {
    label: () => t('刷新壁纸'),
    hidden: () => !global.value.background.includes('api/randomPhoto'),
    fn: () => {
      bg.value.refresh()
    },
    icon: h(Icon, { name: 'refresh', size: 18 })
  },
  {
    label: () => t('下载壁纸'),
    hidden: () => !global.value.background.includes('api/randomPhoto'),
    fn: () => {
      handleDownloadBg()
    },
    icon: h(Icon, { name: 'download-cloud', size: 18 })
  },
  {
    line: true,
    hidden: () => !global.value.background.includes('api/randomPhoto')
  },
  {
    label: () => (isLock.value ? t('进入编辑') : t('锁定')),
    fn: () => {
      store.updateIsLock(!isLock.value)
    },
    icon: () =>
      isLock.value ? h(Icon, { name: 'unlock', size: 18 }) : h(Icon, { name: 'lock', size: 18 })
  }
])

const needShowDefaultThemePicker = computed(() => {
  if (store.tabList && store.tabList.length > 1) return false
  const config = JSON.parse(localStorage.getItem('config') || '{}')
  if ((!config.list || config.list.length === 0) && (!config.affix || config.affix.length === 0)) {
    return true
  } else {
    return false
  }
})

onMounted(() => {
  // 加载鸿蒙字体
  if (store.global.loadHarmonyOSFont) {
    loadHarmonyOSFont()
  }
})
</script>
<style lang="scss" scoped>
.page {
  width: 100%;
  min-height: 100%;
  position: relative;
}
</style>
