import { createApp } from 'vue'
import VueGridLayout from 'vue-grid-layout'
import { i18n } from '@/lang'
import App from './App.vue'
import store from './store'
import '@/assets/element-modules.scss'
import '@/assets/global.scss'
import {
  ElRadioGroup,
  ElRadio,
  ElInput,
  ElOption,
  ElSelect,
  ElForm,
  ElFormItem,
  ElInputNumber,
  ElIcon,
  ElColorPicker,
  ElSwitch,
  ElTooltip,
  ElAlert,
  ElCheckbox,
  ElImage,
  ElTabs,
  ElTabPane,
  ElDatePicker
} from 'element-plus'
import EasyDialog from '@/components/Global/EasyDialog.vue'
import Icon from '@/components/Tools/Icon.vue'
import { setPreviewModeData } from '@/utils/preview-mode'

if (import.meta.env.PROD) {
  // 强制重定向到https
  if (window?.location?.protocol === 'http:') {
    window.location.href = window.location.href.replace('http', 'https')
  }
  // 开启ServiceWorker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
    });
  }
  // 判断当前是否为Edge扩展, 更换Favicon
  const isEdgeExtension = window.location.href.includes('chrome-extension') && window.navigator.userAgent.includes('Edg/')
  if (isEdgeExtension) {
    const iconRel = document.querySelector('link[rel="icon"]')
    iconRel?.setAttribute('href', 'favicon-edge.png')
  }
}

// 非Edge滚动条重置
if (!window.navigator.userAgent.includes('Edg/')) {
  document.body.classList.add('scrollbar1')
}

const init = async () => {
  // Init app
  const app = createApp(App)
  app.use(store)
  app.use(i18n)

  // Get storage data if it is preview mode
  const isPreviewMode = window.location.href.includes('preview=')
  if (isPreviewMode) {
    const previewKey = (new URLSearchParams(window.location.search)).get('preview')
    if (previewKey) {
      try {
        await setPreviewModeData(previewKey)
      } catch (e) {
        console.error(e)
        if (confirm('获取预览数据失败, 即将返回主站')) {
          window.location.href = 'https://howdz.xyz'
        }
      }
    }
  }

  // Mount app
  const components = [
    ElRadioGroup,
    ElRadio,
    ElInput,
    ElOption,
    ElSelect,
    ElForm,
    ElFormItem,
    ElInputNumber,
    ElIcon,
    ElColorPicker,
    ElSwitch,
    ElTooltip,
    ElAlert,
    ElCheckbox,
    ElImage,
    ElTabs,
    ElTabPane,
    ElDatePicker,
  ]
  components.map(component => {
    app.use(component)
  })
  app.use(VueGridLayout)
  app.component('EasyDialog', EasyDialog)
  app.component('Icon', Icon)
  const globalLoading = document.querySelector('#globalLoading')
  if (globalLoading) {
    globalLoading.parentNode?.removeChild(globalLoading)
  }
  app.mount('#app')
}

init()

// document.documentElement.style.setProperty('--el-border-radius-base', '8px')
// document.documentElement.style.setProperty('--el-border-radius-small', '4px')

// 移动端禁用右键菜单与任何长按选中
if ('ontouchstart' in window) {
  document.documentElement.style.setProperty('--user-select', 'none')
  document.addEventListener('contextmenu', (e) => e.preventDefault())
}