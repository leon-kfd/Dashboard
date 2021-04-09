import { createStore } from 'vuex'
import Setting from '@/materials/setting'
import { MATERIAL_LIST_MAP } from '@/constanst'

const updateLocalList = (list: any) => {
  localStorage.setItem('list', JSON.stringify(list))
}
const updateLocalGlobal = (global: any) => {
  localStorage.setItem('global', JSON.stringify(global))
}

// It need reset default global background w & h when use random image.
const getLocalGlobal = () => {
  const global = JSON.parse(localStorage.getItem('global') || '{}')
  if (global.background && global.background.includes('/api/randomPhoto')) {
    const w = window.innerWidth
    const h = window.innerHeight
    global.background = global.background.replace(/w=(\d*)/, `w=${w}`).replace(/h=(\d*)/, `h=${h}`)
  }
  updateLocalGlobal(global)
  return global
}

export default createStore({
  state: {
    isMobile: 'ontouchstart' in window,
    hiddenWarnLockTips: !!localStorage.getItem('hiddenWarnLockTips'),
    isLock: false,
    list: JSON.parse(localStorage.getItem('list') || '[]') as any[],
    global: {
      background: '#ffffff',
      ...getLocalGlobal()
    }
  },
  mutations: {
    updateIsLock(state, value) {
      state.isLock = value
    },
    updateList(state, val) {
      state.list = val
      updateLocalList(state.list)
    },
    addComponent(state, value) {
      // set default
      const material = MATERIAL_LIST_MAP[value.material as keyof typeof MATERIAL_LIST_MAP].label
      value.componentSetting = Setting[material].formData
      state.list = [...state.list, value]
      updateLocalList(state.list)
    },
    editComponent(state, value) {
      const id = value.id
      const index = state.list.findIndex(item => item.id === id)
      if (~index) {
        const list = JSON.parse(JSON.stringify(state.list))
        list[index] = value
        state.list = list
        updateLocalList(state.list)
      }
    },
    deleteComponent(state, value) {
      const id = value.id
      const index = state.list.findIndex(item => item.id === id)
      if (~index) {
        const list = JSON.parse(JSON.stringify(state.list))
        list.splice(index, 1)
        state.list = list
        updateLocalList(state.list)
      }
    },
    updateGlobal(state, value) {
      state.global = JSON.parse(JSON.stringify(value))
      updateLocalGlobal(state.global)
    },
    updateHiddenWarnLockTips(state, value) {
      state.hiddenWarnLockTips = true
      localStorage.setItem('hiddenWarnLockTips', value)
    },
    // Materials
    // Search
    updateSearchShowTabTips(state, value) {
      // find every search
      const list = JSON.parse(JSON.stringify(state.list))
      const newList = list.map((item: ComponentOptions) => {
        if (item.material === 4) {
          if (item.componentSetting) {
            item.componentSetting.showTabTips = value
          }
        }
        return item
      })
      state.list = newList
      updateLocalList(state.list)
    }
  },
  getters: {
    getComponentSetting: state => (id: string) => {
      const index = state.list.findIndex(item => item.id === id)
      if (~index) {
        return state.list[index]
      } else {
        throw new Error('Id may be error')
      }
    }
  },
  actions: {}
})
