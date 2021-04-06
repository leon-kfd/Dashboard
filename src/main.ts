import { createApp } from 'vue'
import '@/assets/base.css'
// import '@/assets/global.scss'
import App from './App.vue'
import store from './store'
import { ElRadioGroup, ElRadio, ElInput, ElOption, ElSelect, ElForm, ElFormItem, ElInputNumber, ElIcon, ElButton, ElColorPicker, ElSwitch, ElTooltip } from 'element-plus'
import '@/assets/element-variables.scss'

const app = createApp(App)
app.use(store)
// element
const components = [
  ElRadioGroup, ElRadio, ElInput, ElOption, ElSelect, ElForm, ElFormItem, ElInputNumber, ElIcon, ElButton, ElColorPicker, ElSwitch, ElTooltip
]
components.map(component => {
  app.component(component.name, component)
})
app.config.globalProperties.$ELEMENT = {
  size: 'small'
}

app.mount('#app')
