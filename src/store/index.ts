import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import Setting from '@/materials/setting'
import { MATERIAL_LIST_MAP } from '@/constanst'
import { getSupportFontFamilyList } from '@/utils/font'

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
      const { hiddenWarnLockTips, isLock, list, affix, fontFamilyList } = state
      return { hiddenWarnLockTips, isLock, list, affix, fontFamilyList }
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
      backgroundFilter: 'brightness(0.9)',
      gutter: 10,
      css: '',
      ...getLocalGlobal()
    },
    fontFamilyList: [] as any[]
  },
  mutations: {
    updateIsLock(state, value) {
      state.isLock = value
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
        state.list.push(value)
      } else if (value.position === 2) {
        state.affix.push(value)
      }
    },
    editComponent(state, value) {
      const id = value.id
      if (value.position === 1) {
        const index = state.list.findIndex(item => item.id === id)
        if (~index) {
          // const list = JSON.parse(JSON.stringify(state.list))
          // list[index] = value
          // state.list = list
          state.list[index] = value
        }
      } else if (value.position === 2) {
        const index = state.affix.findIndex(item => item.id === id)
        if (~index) {
          // const affix = JSON.parse(JSON.stringify(state.affix))
          // affix[index] = value
          // state.affix = affix
          state.affix[index] = value
        }
      }
    },
    deleteComponent(state, value) {
      const id = value.id
      if (value.position === 1) {
        const index = state.list.findIndex(item => item.id === id)
        if (~index) {
          // const list = JSON.parse(JSON.stringify(state.list))
          // list.splice(index, 1)
          // state.list = list
          state.list.splice(index, 1)
        }
      } else {
        const index = state.affix.findIndex(item => item.id === id)
        if (~index) {
          // const affix = JSON.parse(JSON.stringify(state.affix))
          // affix.splice(index, 1)
          // state.affix = affix
          state.affix.splice(index, 1)
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
    updateFontFamilyList(state) {
      state.fontFamilyList = getSupportFontFamilyList()
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
      const index1 = state.list.findIndex(item => item.id === id)
      const index2 = state.affix.findIndex(item => item.id === id)
      if (~index1) {
        return state.list[index1]
      } else if (~index2) {
        return state.affix[index2]
      } else {
        throw new Error('Id maybe error')
      }
    }
  },
  actions: {}
})
