import { createApp } from 'vue'
import VueGridLayout from 'vue-grid-layout'
import App from './App.vue'
import store from './store'
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
  ElButton,
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
import '@/assets/element-variables.scss'
import AnimationDialog from '@howdyjs/animation-dialog'
import { publicPath } from './global'

const version = '1.0.1'
const localVersion = localStorage.getItem('__v__')
const hasConfig = localStorage.getItem('config')
if (hasConfig && localVersion !== version) {
  // alert('抱歉，本地数据不适应最新版本，必须清除数据!')
  // localStorage.removeItem('config')
  // location.reload()
  const config = JSON.parse(hasConfig)
  const fixMaterialMap: any = {
    1: 'Empty',
    2: 'Clock',
    3: 'Verse',
    4: 'Search',
    5: 'Collection',
    6: 'Iframe',
    7: 'TodoList',
    8: 'Weather',
    9: 'CountDown',
    10: 'JuejinList',
    11: 'WeiboList',
    12: 'GithubTrending'
  }
  config.list = config.list.map((item: any) => {
    if (typeof item.material === 'number') {
      item.material = fixMaterialMap[item.material]
    }
    if (typeof item.actionSetting?.actionClickValue?.material === 'number') {
      item.actionSetting.actionClickValue.material = fixMaterialMap[item.actionSetting.actionClickValue.material]
    }
    return item
  })
  config.affix = config.affix.map((item: any) => {
    if (typeof item.material === 'number') {
      item.material = fixMaterialMap[item.material]
    }
    if (typeof item.actionSetting?.actionClickValue?.material === 'number') {
      item.actionSetting.actionClickValue.material = fixMaterialMap[item.actionSetting.actionClickValue.material]
    }
    return item
  })
  localStorage.setItem('config', JSON.stringify(config))
  location.reload()
}
localStorage.setItem('__v__', version)

const app = createApp(App)
app.use(store)
// element
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
  ElButton,
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
app.config.globalProperties.$ELEMENT = {
  size: 'small'
}

app.use(VueGridLayout)
app.component(AnimationDialog.name, AnimationDialog)

const globalLoading = document.querySelector('#globalLoading')
if (globalLoading) {
  globalLoading.parentNode?.removeChild(globalLoading)
}

app.mount('#app')

if (import.meta.env.PROD) {
  if ('serviceWorker' in navigator) {
    // Use the window load event to keep the page load performant
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${publicPath}sw.js`);
    });
  }
}
