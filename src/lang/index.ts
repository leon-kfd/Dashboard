import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zhCN from './locales/zh-cn.json'

export const i18n = createI18n({
  legacy: false,
  locale: 'zh-cn',
  fallbackLocale: 'zh-cn',
  globalInjection: true,
  missingWarn: false,
  fallbackWarn: false,
  messages: {
    en,
    'zh-cn': zhCN
  }
})

export const langList = [
  {
    label: '简体中文',
    value: 'zh-cn'
  },
  {
    label: 'English',
    value: 'en'
  }
]

export default {}