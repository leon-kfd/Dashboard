import { createPinia, defineStore } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { getSupportFontFamilyList } from '@/utils/font'

export default createPinia().use(piniaPluginPersistedstate)

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

const getMaxY = (list: ComponentOptions[]) => {
  const yList = list.map(item => item.y || 0)
  const maxY = Math.max(...yList)
  const index = yList.indexOf(maxY)
  if (~index) {
    const h = list[index].h
    return (maxY + h) || 0
  } else {
    return 0
  }
}

export const useStore = defineStore({
  id: 'config',
  state: () => {
    return {
      isMobile: 'ontouchstart' in window,
      hiddenWarnLockTips: false,
      isLock: true,
      list: [] as ComponentOptions[],
      affix: [] as ComponentOptions[],
      global: {
        background: '#242428',
        backgroundFilter: 'brightness(0.8)',
        lang: 'zh-cn',
        gutter: 10,
        css: '',
        js: '',
        globalFontFamily: '',
        loadHarmonyOSFont: false,
        siteTitle: '',
        disabledDialogAnimation: false,
        showMenuBtn: true,
        ...getLocalGlobal()
      } as GlobalOptions,
      fontFamilyList: [] as IFontData[],
      tabList: [] as any[],
      actionElement: null as ComponentOptions | null,
      showBackgroundEffect: false,
      showRefreshBtn: true,
      showTabSwitchBtn: true,
      enableKeydownSwitchTab: true,
      wallpaperCollectionList: [] as string[],
      realBackgroundURL: localStorage.getItem('cacheBackgroundURL') || '',
      backgroundEffectActive: 0
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
  actions: {
    updateIsLock(value: boolean) {
      this.isLock = value
    },
    updateList(value: ComponentOptions[]) {
      this.list = value
    },
    updateAffix(value: ComponentOptions[]) {
      this.affix = value
    },
    async updateFontFamilyList() {
      this.fontFamilyList = await getSupportFontFamilyList()
    },
    updateActionElement(value: ComponentOptions) {
      this.actionElement = value
    },
    updateGlobal(value: GlobalOptions) {
      this.global = value
      updateLocalGlobal(this.global)
    },
    updateGlobalKey({ key, value }: { key: string; value: any; }) {
      this.global[key] = value
      updateLocalGlobal(this.global)
    },
    resetGlobalBackground() {
      this.global.background = '#242428'
      updateLocalGlobal(this.global)
    },
    addComponent(value: ComponentOptions) {
      const key = value.position === 1 ? 'list' : 'affix'
      if (value.position === 1) {
        value.x = 0
        value.y = getMaxY(this.list)
      }
      this[key].push(value)
    },
    editComponent(value: ComponentOptions) {
      const id = value.i
      const key = value.position === 1 ? 'list' : 'affix'
      const index = this[key].findIndex(item => item.i === id)
      if (~index) {
        this[key][index] = value
      }
    },
    deleteComponent(value: ComponentOptions) {
      const id = value.i
      const key = value.position === 1 ? 'list' : 'affix'
      const index = this[key].findIndex(item => item.i === id)
      if (~index) {
        this[key].splice(index, 1)
      }
    },
    editAffixRectInfo(value: Pick<ComponentOptions, 'i' | 'x' | 'y' | 'w' | 'h'>) {
      const { i, x, y, w, h } = value
      const index = this.affix.findIndex(item => item.i === i)
      if (~index) {
        this.affix[index].w = w
        this.affix[index].h = h
        if (x && y) {
          (this.affix[index].affixInfo as AffixInfo).x = x;
          (this.affix[index].affixInfo as AffixInfo).y = y;
        }
      }
    },
    updateTabList(value: any[]) {
      this.tabList = value
    },
    updateTabSelected(id: string) {
      try {
        const _tabList = JSON.parse(JSON.stringify(this.tabList))
        const index = this.tabList.findIndex((item: any) => item.id === id)
        if (~index) {
          const { list, affix, global, showBackgroundEffect, showRefreshBtn, backgroundEffectActive } = this
          const { list: list1, affix: affix1, global: global1, showBackgroundEffect: showBackgroundEffect1, showRefreshBtn: showRefreshBtn1, backgroundEffectActive: backgroundEffectActive1 } = _tabList[index].data
          const current = _tabList.find((item: any) => !!item.selected)
          current.selected = false
          current.data = JSON.parse(JSON.stringify({ list, affix, global, showBackgroundEffect, showRefreshBtn, backgroundEffectActive }))
          _tabList[index].selected = true
          _tabList[index].data = null
          global1.lang = this.global.lang
          this.updateTabList(_tabList)
          this.updateList(list1)
          this.updateAffix(affix1)
          this.updateGlobal(global1)
          this.showBackgroundEffect = showBackgroundEffect1
          this.showRefreshBtn = showRefreshBtn1
          this.backgroundEffectActive = backgroundEffectActive1
        }
      } catch (e) {
        console.error(e)
        alert('数据异常，切换失败')
      }
    },
    updateState({ key, value }: { key: string; value: any; }) {
      this[key] = value
    },
    updateStates(payloads: any[]) {
      for (let i = 0; i < payloads.length; i++) {
        const { key, value } = payloads[i]
        this[key] = value
      }
    }
  },
  persist: {
    paths: [
      'hiddenWarnLockTips',
      'list',
      'affix',
      'fontFamilyList',
      'showBackgroundEffect',
      'showRefreshBtn',
      'tabList',
      'showTabSwitchBtn',
      'enableKeydownSwitchTab',
      'wallpaperCollectionList',
      'backgroundEffectActive'
    ]
  }
})
