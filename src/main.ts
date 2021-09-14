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
import { publicPath } from './global'

const version = '1.0.0'
const localVersion = localStorage.getItem('__v__')
const hasConfig = localStorage.getItem('config')
if (hasConfig && localVersion !== version) {
  alert('抱歉，本地数据不适应最新版本，必须清除数据!')
  localStorage.removeItem('config')
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
  ElDatePicker
]
components.map(component => {
  app.component(component.name, component)
})
app.config.globalProperties.$ELEMENT = {
  size: 'small'
}

app.use(VueGridLayout)

app.mount('#app')

if ('serviceWorker' in navigator) {
  // Use the window load event to keep the page load performant
  window.addEventListener('load', () => {
    navigator.serviceWorker.register(`${publicPath}sw.js`);
  });
}
