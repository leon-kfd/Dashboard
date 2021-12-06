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
      js: '',
      globalFontFamily: '',
      siteTitle: '',
      ...getLocalGlobal()
    },
    fontFamilyList: [] as any[],
    actionElement: null
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
  mutations: {
    UPDATE_STATE(state, { key, value }) {
      (state as any)[key] = value
    },
    UPDATE_STATE_LIST(state, { key, type, value, index }) {
      switch (type) {
        case 'add':
          (state as any)[key].push(value)
          break
        case 'edit':
          (state as any)[key][index] = value
          break
        case 'delete':
          (state as any)[key].splice(index, 1)
          break
      }
    }
  },
  actions: {
    updateIsLock({ commit }, value) {
      commit('UPDATE_STATE', { key: 'isLock', value })
    },
    updateList({ commit }, value) {
      commit('UPDATE_STATE', { key: 'list', value })
    },
    updateAffix({ commit }, value) {
      commit('UPDATE_STATE', { key: 'affix', value })
    },
    updateHiddenWarnLockTips({ commit }, value) {
      commit('UPDATE_STATE', { key: 'hiddenWarnLockTips', value })
    },
    updateFontFamilyList({ commit }) {
      commit('UPDATE_STATE', { key: 'fontFamilyList', value: getSupportFontFamilyList() })
    },
    updateActionElement({ commit }, value) {
      commit('UPDATE_STATE', { key: 'actionElement', value })
    },
    updateGlobal({ commit }, value) {
      const _global = JSON.parse(JSON.stringify(value))
      updateLocalGlobal(_global)
      commit('UPDATE_STATE', { key: 'global', value: _global })
    },
    resetGlobalBackground({ commit, state }) {
      const _global = JSON.parse(JSON.stringify(state.global))
      _global.background = '#242428'
      commit('UPDATE_STATE', { key: 'global', value: _global })
    },
    addComponent({ commit, state }, value) {
      const material = value.material
      value.componentSetting = Setting[material].formData
      const key = value.position === 1 ? 'list' : 'affix'
      if (value.position === 1) {
        value.x = 0
        value.y = getMaxY(state.list)
      }
      commit('UPDATE_STATE_LIST', {
        key,
        type: 'add',
        value
      })
    },
    editComponent({ commit, state }, value) {
      const id = value.i
      const key = value.position === 1 ? 'list' : 'affix'
      const index = state[key].findIndex(item => item.i === id)
      if (~index) {
        commit('UPDATE_STATE_LIST', {
          key,
          type: 'edit',
          value,
          index
        })
      }
    },
    deleteComponent({ commit, state }, value) {
      const id = value.i
      const key = value.position === 1 ? 'list' : 'affix'
      const index = state[key].findIndex(item => item.i === id)
      if (~index) {
        commit('UPDATE_STATE_LIST', {
          key,
          type: 'delete',
          index
        })
      }
    }
  }
})
