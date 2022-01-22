import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate';
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
      const { hiddenWarnLockTips, list, affix, fontFamilyList, showBackgroundEffect, showRefreshBtn, tabList, showTabSwitchBtn, enableKeydownSwitchTab } = state
      return { hiddenWarnLockTips, list, affix, fontFamilyList, showBackgroundEffect, showRefreshBtn, tabList, showTabSwitchBtn, enableKeydownSwitchTab }
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
      disabledDialogAnimation: false,
      ...getLocalGlobal()
    },
    fontFamilyList: [] as any[],
    tabList: [] as any[],
    actionElement: null,
    showBackgroundEffect: false,
    showRefreshBtn: true,
    showTabSwitchBtn: true,
    enableKeydownSwitchTab: true,
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
    },
    UPDATE_AFFIX_RECT_INFO(state, value) {
      const { i, x, y, w, h } = value
      const index = state.affix.findIndex(item => item.i === i)
      if (~index) {
        state.affix[index].affixInfo.x = x
        state.affix[index].affixInfo.y = y
        state.affix[index].w = w
        state.affix[index].h = h
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
    },
    editAffixRectInfo({ commit }, value) {
      commit('UPDATE_AFFIX_RECT_INFO', value)
    },
    updateTabList({ commit }, value) {
      commit('UPDATE_STATE', { key: 'tabList', value })
    },
    updateTabSelected({ dispatch, state }, id) {
      try {
        const _tabList = JSON.parse(JSON.stringify(state.tabList))
        const index = _tabList.findIndex((item: any) => item.id === id)
        if (~index) {
          const { list, affix, global, showBackgroundEffect, showRefreshBtn } = state
          const { list: list1, affix: affix1, global: global1, showBackgroundEffect: showBackgroundEffect1, showRefreshBtn: showRefreshBtn1 } = _tabList[index].data
          const current = _tabList.find((item: any) => !!item.selected)
          current.selected = false
          current.data = JSON.parse(JSON.stringify({ list, affix, global, showBackgroundEffect, showRefreshBtn }))
          _tabList[index].selected = true
          _tabList[index].data = null
          dispatch('updateStates', [
            { key: 'tabList', value: _tabList },
            { key: 'list', value: list1 },
            { key: 'affix', value: affix1 },
            { key: 'showBackgroundEffect', value: showBackgroundEffect1 },
            { key: 'showRefreshBtn', value: showRefreshBtn1 }
          ])
          dispatch('updateGlobal', global1)
        }
      } catch (e) {
        console.error(e)
        alert('数据异常，切换失败')
      }
    },
    // Common state updater
    updateState({ commit }, { key, value }) {
      commit('UPDATE_STATE', { key, value })
    },
    updateStates({ commit }, payloads) {
      for (let i = 0; i < payloads.length; i++) {
        const { key, value } = payloads[i]
        commit('UPDATE_STATE', { key, value })
      }
    }
  }
})
