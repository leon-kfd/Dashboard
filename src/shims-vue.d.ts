import { DefineComponent } from 'vue'

declare module '*.vue' {
  const component: DefineComponent<any, any, any>
  export default component
}

declare module '*.md' {
  const component: DefineComponent<any, any, any>
  export default component
}

declare module 'vue-grid-layout'
