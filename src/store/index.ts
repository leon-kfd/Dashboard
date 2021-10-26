import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';
import Setting from '@/materials/setting'
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

const getMaxY = (list: any) => {
  const yList = list.map((item: any) => item.y)
  const maxY = Math.max(...yList)
  const index = yList.indexOf(maxY)
  if (~index) {
    const h = list[index].h
    return (maxY + h) || 0
  } else {
    return 0
  }
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
      background: '#242428',
      backgroundFilter: 'brightness(0.8)',
      gutter: 10,
      css: '',
      globalFontFamily: '',
      ...getLocalGlobal()
    },
    fontFamilyList: [] as any[],
    actionElement: null
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
      const material = value.material
      value.componentSetting = Setting[material].formData
      if (value.position === 1) {
        value.x = 0
        value.y = getMaxY(state.list)
        state.list.push(value)
      } else if (value.position === 2) {
        state.affix.push(value)
      }
    },
    editComponent(state, value) {
      const id = value.i
      if (value.position === 1) {
        const index = state.list.findIndex(item => item.i === id)
        if (~index) {
          state.list[index] = value
        }
      } else if (value.position === 2) {
        const index = state.affix.findIndex(item => item.i === id)
        if (~index) {
          state.affix[index] = value
        }
      }
    },
    deleteComponent(state, value) {
      const id = value.i
      if (value.position === 1) {
        const index = state.list.findIndex(item => item.i === id)
        if (~index) {
          state.list.splice(index, 1)
        }
      } else {
        const index = state.affix.findIndex(item => item.i === id)
        if (~index) {
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
        if (item.material === 'Search') {
          if (item.componentSetting) {
            item.componentSetting.showTabTips = value
          }
        }
        return item
      })
      state.list = newList
    },
    updateActionElement(state, value) {
      state.actionElement = value
    },
    resetGlobalBackground(state) {
      state.global.background = '#242428'
    }
  },
  getters: {
    getComponentSetting: state => (id: string) => {
      const index1 = state.list.findIndex(item => item.i === id)
      const index2 = state.affix.findIndex(item => item.i === id)
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
