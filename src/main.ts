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

if (import.meta.env.PROD) {
  // 强制重定向到https
  if (window?.location?.protocol === 'http:') {
    window.location.href = window.location.href.replace('http', 'https')
  }
  // 开启ServiceWorker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register(`${publicPath}sw.js`);
    });
  }
}

// const userConfig = localStorage.getItem('config')
// const version = '1.0.1'
// const localVersion = localStorage.getItem('__v__')
// if (userConfig && localVersion !== version) {
//   alert('抱歉，本地数据不适应最新版本，必须清除数据!')
//   localStorage.removeItem('config')
//   location.reload()
// }
// localStorage.setItem('__v__', version)

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
