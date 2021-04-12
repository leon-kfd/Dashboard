import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { ElRadioGroup, ElRadio, ElInput, ElOption, ElSelect, ElForm, ElFormItem, ElInputNumber, ElIcon, ElButton, ElColorPicker, ElSwitch, ElTooltip, ElAlert, ElCheckbox } from 'element-plus'
import StandardColorPicker from '@/plugins/standard-color-picker'
import '@/assets/element-variables.scss'

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
  ElCheckbox
]
components.map(component => {
  app.component(component.name, component)
})
app.config.globalProperties.$ELEMENT = {
  size: 'small'
}

// 二次封装ColorPicker
app.use(StandardColorPicker)

app.mount('#app')
