import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import Setting from '@/materials/setting'
import { MATERIAL_LIST_MAP } from '@/constanst'

const updateLocalGlobal = (global: any) => localStorage.setItem('global', JSON.stringify(global))

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
  plugins: [createPersistedState({
    key: 'config',
    reducer: (state) => {
      const { hiddenWarnLockTips, isLock, list, affix } = state
      return { hiddenWarnLockTips, isLock, list, affix }
    }
  })],
  state: {
    isMobile: 'ontouchstart' in window,
    hiddenWarnLockTips: false,
    isLock: true,
    list: [] as any[],
    affix: [] as any[],
    global: {
      background: '#ffffff',
      gutter: 10,
      css: '',
      ...getLocalGlobal()
    }
  },
  mutations: {
    updateIsLock(state, value) {
      state.isLock = value
      localStorage.setItem('isLock', JSON.stringify(state.isLock))
    },
    updateList(state, val) {
      state.list = val
    },
    updateAffix(state, val) {
      state.affix = val
    },
    addComponent(state, value) {
      // set default
      const material = MATERIAL_LIST_MAP[value.material as keyof typeof MATERIAL_LIST_MAP].label
      value.componentSetting = Setting[material].formData
      if (value.position === 1) {
        state.list = [...state.list, value]
      } else if (value.position === 2) {
        state.affix = [...state.affix, value]
      }
    },
    editComponent(state, value) {
      const id = value.id
      if (value.position === 1) {
        const index = state.list.findIndex(item => item.id === id)
        if (~index) {
          const list = JSON.parse(JSON.stringify(state.list))
          list[index] = value
          state.list = list
        }
      } else if (value.position === 2) {
        const index = state.affix.findIndex(item => item.id === id)
        if (~index) {
          const affix = JSON.parse(JSON.stringify(state.affix))
          affix[index] = value
          state.affix = affix
        }
      }
    },
    deleteComponent(state, value) {
      const id = value.id
      if (value.position === 1) {
        const index = state.list.findIndex(item => item.id === id)
        if (~index) {
          const list = JSON.parse(JSON.stringify(state.list))
          list.splice(index, 1)
          state.list = list
        }
      } else {
        const index = state.affix.findIndex(item => item.id === id)
        if (~index) {
          const affix = JSON.parse(JSON.stringify(state.affix))
          affix.splice(index, 1)
          state.affix = affix
        }
      }
    },
    updateGlobal(state, value) {
      state.global = JSON.parse(JSON.stringify(value))
      updateLocalGlobal(state.global)
    },
    updateHiddenWarnLockTips(state, value) {
      state.hiddenWarnLockTips = value
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
    }
  },
  getters: {
    getComponentSetting: state => (id: string) => {
      const index = state.list.findIndex(item => item.id === id)
      if (~index) {
        return state.list[index]
      } else {
        throw new Error('Id maybe error')
      }
    }
  },
  actions: {}
})
