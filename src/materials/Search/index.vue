<template>
  <div
    class="wrapper material-search"
    :style="{
      padding: componentSetting.padding + 'px',
      ...positionCSS
    }"
  >
    <div
      class="search-wrapper-box"
      :style="{
        maxWidth: `${componentSetting.maxWidth || 600}px`,
        pointerEvents: isLock ? 'all' : 'none',
      }"
      @contextmenu="contextmenu"
    >
      <div
        class="search-main-box"
        :style="{
          boxShadow: componentSetting.boxShadow,
          borderRadius: `${componentSetting.boxRadius || 4}px`,
          padding: `0 ${(componentSetting.boxRadius || 4) / 4}px`,
          backdropFilter: componentSetting.backdropBlur ? 'blur(5px)' : 'none'
        }">
        <div
          class="search-engine-box"
          :style="{ filter: componentSetting.backdropBlur ? 'drop-shadow(1px 2px 4px #262626)' : 'none'}"
          @click.stop="showEngine = !showEngine">
          <img
            v-if="activeEngineItem.iconType === 'local' || activeEngineItem.iconType === 'network'"
            :src="activeEngineItem.iconPath"
            alt="icon"
            width="24"
            height="24"
          />
          <img
            v-if="activeEngineItem.iconType === 'api'"
            :src="getTargetIcon(activeEngineItem.link)"
            alt="icon"
            width="24"
            height="24"
          />
          <div v-if="activeEngineItem.iconType === 'text'" class="no-icon">
            {{ activeEngineItem.name.slice(0, 1) }}
          </div>
        </div>
        <div class="search-input-box-wrapper">
          <input
            class="search-input-box"
            :style="{ color: componentSetting.textColor }"
            ref="searchInput"
            v-model="searchKey"
            @keydown.stop="handleInputKeyDown"
            @focus="handleInputFocus"
            @blur="handleInputBlur"
            tabindex="1"
          />
          <div v-if="searchKey" class="clear-btn" @click="handleClear">
            <Icon name="close" />
          </div>
        </div>
        <div
          class="search-btn"
          :style="{
            color: componentSetting.textColor,
            filter: componentSetting.backdropBlur ? 'drop-shadow(1px 2px 4px #262626)' : 'none'
          }"
          @click="handleSearchBtnClick">
          <Icon name="search" />
        </div>
      </div>
      <transition name="fadeInUp">
        <div
          v-show="showEngine"
          ref="engineSelector"
          class="engine-selector"
          :style="{
            backdropFilter: componentSetting.backdropBlur ? 'blur(5px)' : 'none',
            filter: componentSetting.backdropBlur ? 'drop-shadow(1px 2px 4px #262626)' : 'none'
          }">
          <div
            v-for="(item, index) in componentSetting.engineList"
            :key="index"
            class="engine-list-item"
            @click="handleChangeEngine(index)"
          >
            <img
              v-if="item.iconType === 'local' || item.iconType === 'network'"
              :src="item.iconPath"
              alt="icon"
              width="24"
              height="24"
            />
            <img
              v-if="item.iconType === 'api'"
              :src="getTargetIcon(item.link)"
              alt="icon"
              width="24"
              height="24"
            />
            <div v-if="item.iconType === 'text'" class="no-icon">{{ item.name.slice(0, 1) }}</div>
            <div class="text">{{ item.name }}</div>
          </div>
        </div>
      </transition>
      <transition name="fadeInUp">
        <div
          v-if="linkSearchArr.length > 0"
          class="link-search-wrapper"
          :style="{ backdropFilter: componentSetting.backdropBlur ? 'blur(5px)' : 'none'}">
          <div
            class="link-search-item"
            :class="{ active: linkSearchArrActive === index }"
            v-for="(item, index) in linkSearchArr"
            :key="item"
          >
            <div class="text" @click="handleLinkSearchJump(item)">{{ item }}</div>
            <div v-if="!searchKey" class="remove-btn" @click="removeHistory(index)">
              <Icon name="close" size="1em" />
            </div>
          </div>
          <div class="clear-history" v-if="!searchKey && componentSetting.rememberHistory">
            <div class="clear-history-btn" @click="clearHistory">
              <Icon name="delete" size="1em" style="margin-right: 2px" /> {{$t('清空历史记录')}}
            </div>
          </div>
        </div>
      </transition>
      <transition name="fadeInUp">
        <div class="tab-tooltips" v-show="showTabTips">
          <div class="main">{{$t('按Tab键可快速切换搜索引擎')}}</div>
          <div class="no-more" @click.stop="hanldeNoShowMore">{{$t('不再提示')}}</div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useStore } from '@/store'
import { apiURL } from '@/global'
import { mapPosition } from '@/plugins/position-selector'
import { getTargetIcon } from '@/utils/images'
export default defineComponent({
  name: 'Search',
  props: {
    componentSetting: {
      type: Object,
      required: true
    },
    element: {
      type: Object,
      required: true
    },
    isAction: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const store = useStore()

    const activeEngine = ref(0)
    const showEngine = ref(false)
    const searchKey = ref('')
    const linkSearchArr = ref([])
    const linkSearchArrActive = ref(-1)
    const showTabTips = ref(false)
    const searchInput = ref()

    const activeEngineItem = computed(() => {
      return (
        props.componentSetting.engineList[activeEngine.value] ||
        props.componentSetting.engineList[0]
      )
    })
    let throttleTimer: number

    const handleChangeEngine = (index: number) => {
      activeEngine.value = index
      showEngine.value = false
    }
    const handleSearchBtnClick = () => {
      if (props.componentSetting.rememberHistory) {
        addHistory(searchKey.value)
      }
      let link = activeEngineItem.value.link
      if (/\[0\]/.test(link)) {
        link = link.replace(/\[0\]/, encodeURIComponent(searchKey.value))
      } else {
        link = link + encodeURIComponent(searchKey.value)
      }
      if (props.componentSetting.jumpType === 2) {
        window.location.href = link
      } else {
        window.open(link)
      }
      searchKey.value = ''
      linkSearchArr.value = []
      searchInput.value.blur()
    }
    const handleInputKeyDown = (e: KeyboardEvent) => {
      const specialKeyArr = [9, 13, 38, 40]
      if (specialKeyArr.includes(e.keyCode)) {
        if (e.keyCode === 9) {
          // Tab键
          if (e.shiftKey) {
            activeEngine.value =
              activeEngine.value <= 0
                ? props.componentSetting.engineList.length - 1
                : --activeEngine.value
            e.preventDefault()
          } else {
            activeEngine.value =
              activeEngine.value >= props.componentSetting.engineList.length - 1
                ? 0
                : ++activeEngine.value
            e.preventDefault()
          }
        }
        if (e.keyCode === 13) {
          // 回车键
          handleSearchBtnClick()
        }
        if (e.keyCode === 38) {
          linkSearchArrActive.value =
            linkSearchArrActive.value <= 0 && linkSearchArr.value.length > 0
              ? linkSearchArr.value.length - 1
              : linkSearchArrActive.value - 1
          searchKey.value = linkSearchArr.value[linkSearchArrActive.value]
        }
        if (e.keyCode === 40) {
          linkSearchArrActive.value =
            linkSearchArrActive.value < linkSearchArr.value.length - 1 &&
            linkSearchArr.value.length > 0
              ? linkSearchArrActive.value + 1
              : 0
          searchKey.value = linkSearchArr.value[linkSearchArrActive.value]
        }
      } else {
        if (throttleTimer) window.clearTimeout(throttleTimer)
        throttleTimer = window.setTimeout(() => {
          linkSearch()
        }, 400)
      }
    }

    const needShowBackgrounEffect = computed(
      () => props.componentSetting.focusBgAnimation && store.global.background.includes('url')
    )

    const handleInputFocus = () => {
      linkSearch()
      if (props.componentSetting.showTabTips) {
        if (
          !props.componentSetting.rememberHistory ||
          props.componentSetting.rememberHistoryList.length === 0
        ) {
          showTabTips.value = true
        }
      }
      if (needShowBackgrounEffect.value) {
        store.updateState({ key: 'showBackgroundEffect', value: true })
      }
    }
    const handleInputBlur = () => {
      setTimeout(() => {
        showTabTips.value = false
      }, 200)
      linkSearchArr.value = []
      if (needShowBackgrounEffect.value) {
        store.updateState({ key: 'showBackgroundEffect', value: false })
      }
    }
    const hanldeNoShowMore = () => {
      showTabTips.value = false
      const element = JSON.parse(JSON.stringify(props.element))
      if (props.isAction) {
        element.actionSetting.actionClickValue.componentSetting.showTabTips = false
        store.updateActionElement(element)
      } else {
        element.componentSetting.showTabTips = false
      }
      store.editComponent(element)
    }
    const handleClear = () => {
      searchKey.value = ''
    }

    const handleLinkSearchJump = (key: string) => {
      linkSearchArr.value = []
      linkSearchArrActive.value = -1
      searchKey.value = key
      setTimeout(() => {
        handleSearchBtnClick()
      }, 200)
    }

    async function linkSearch() {
      if (!searchKey.value) {
        // 用于搜索历史
        if (props.componentSetting.rememberHistory) {
          linkSearchArr.value = props.componentSetting.rememberHistoryList || []
        } else {
          linkSearchArr.value = []
        }
        linkSearchArrActive.value = -1
        return
      }
      if (!props.componentSetting.keywordLink) return
      try {
        const res = await fetch(`${apiURL}/getAutomatedKeywords?s=${searchKey.value}`)
        const { errCode, data } = await res.json()
        if (errCode === 200) {
          showTabTips.value = false
          if (searchKey.value) linkSearchArr.value = data
        } else {
          throw new Error('403')
        }
      } catch (e) {
        linkSearchArr.value = []
        linkSearchArrActive.value = -1
      }
    }

    function addHistory(value: string) {
      const element = JSON.parse(JSON.stringify(props.element))
      const history = element.componentSetting.rememberHistoryList || []
      const index = history.indexOf(value)
      if (!~index) {
        history.unshift(value)
        if (history.length > 10) history.length = 10
        if (props.isAction) {
          element.actionSetting.actionClickValue.componentSetting.rememberHistoryList = history
          store.updateActionElement(element)
        } else {
          element.componentSetting.rememberHistoryList = history
        }
        store.editComponent(element)
      }
    }

    function clearHistory() {
      const element = JSON.parse(JSON.stringify(props.element))
      if (props.isAction) {
        element.actionSetting.actionClickValue.componentSetting.rememberHistoryList = []
        store.updateActionElement(element)
      } else {
        element.componentSetting.rememberHistoryList = []
      }
      store.editComponent(element)
    }

    async function removeHistory(index: number) {
      const element = JSON.parse(JSON.stringify(props.element))
      if (props.isAction) {
        element.actionSetting.actionClickValue.componentSetting.rememberHistoryList.splice(index, 1)
        store.updateActionElement(element)
      } else {
        element.componentSetting.rememberHistoryList.splice(index, 1)
      }
      store.editComponent(element)
      await nextTick()
      searchInput.value.focus()
      linkSearch()
    }

    // click-outside
    const engineSelector = ref()
    function clickEngineWrapperOutside(e: MouseEvent) {
      if (showEngine.value && !engineSelector.value.contains(e.target)) {
        showEngine.value = false
      }
    }
    onMounted(() => {
      showTabTips.value = props.element.showTabTips
      document.addEventListener('click', clickEngineWrapperOutside)
    })
    onUnmounted(() => {
      document.removeEventListener('click', clickEngineWrapperOutside)
    })

    const positionCSS = computed(() => mapPosition(props.componentSetting.position))

    const isLock = computed(() => store.isLock)
    const contextmenu = (e: MouseEvent) => {
      if (isLock.value) {
        e.stopPropagation()
      }
    }

    const boxBackground = computed(() => props.componentSetting.boxBackground || 'rgba(255,255,255,0.9)')
    const textColor = computed(() => props.componentSetting.textColor || '#464650')

    return {
      activeEngine,
      showEngine,
      searchKey,
      linkSearchArr,
      linkSearchArrActive,
      showTabTips,
      activeEngineItem,
      handleChangeEngine,
      handleInputKeyDown,
      handleInputFocus,
      handleInputBlur,
      hanldeNoShowMore,
      handleClear,
      handleLinkSearchJump,
      handleSearchBtnClick,
      searchInput,
      engineSelector,
      positionCSS,
      getTargetIcon,
      clearHistory,
      removeHistory,
      contextmenu,
      isLock,
      boxBackground,
      textColor
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}
.search-wrapper-box {
  width: 100%;
  height: 2.4rem;
  transition: all 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
  position: relative;
  .search-main-box {
    width: 100%;
    height: 100%;
    background: v-bind(boxBackground);
    border: 1px solid #c8c8cc;
    display: flex;
    align-items: center;
  }
  .search-engine-box {
    padding: 0 12px;
    display: inline-flex;
    border-right: 1px solid #c8c8cc;
    cursor: pointer;
    justify-content: center;
    align-items: center;
    // img {
    //   filter: drop-shadow(0 0 1px #262626);
    // }
    .no-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #abb;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
    }
  }
  .engine-selector {
    position: absolute;
    padding: 5px;
    top: 3rem;
    left: 0;
    width: auto;
    display: flex;
    border-radius: 4px;
    flex-wrap: wrap;
    background: v-bind(boxBackground);
    z-index: 20;
    border: 1px solid #c8c8cc;
    // &:after {
    //   position: absolute;
    //   content: '';
    //   width: 10px;
    //   height: 10px;
    //   border-top: 1px solid #c8c8cc;
    //   border-left: 1px solid #c8c8cc;
    //   left: 20px;
    //   top: -6px;
    //   transform: rotate(45deg);
    //   background: v-bind(boxBackground);
    //   clip-path: polygon(0 0, 0 100%, 100% 0);
    // }
    .engine-list-item {
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 3px;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      // filter: drop-shadow(0 0 1px #262626);
      .text {
        line-height: 18px;
        font-size: 12px;
        color: v-bind(textColor);
        width: 100%;
        text-align: center;
        margin-top: 6px;
      }
      .no-icon {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #abb;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
      }
      &:hover {
        background: rgba(207,191,219,.2);
      }
    }
  }
  .search-input-box-wrapper {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    .search-input-box {
      flex: 1;
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      background: transparent;
      padding: 0 20px 0 10px;
      font-size: 1rem;
      font-weight: 500;
      color: #363640;
      vertical-align: middle;
      &::placeholder {
        color: #aab;
        font-size: 12px;
      }
    }
    .clear-btn {
      position: absolute;
      height: 100%;
      right: 0;
      cursor: pointer;
      display: flex;
      width: 28px;
      align-items: center;
      justify-content: center;
      color: #a9a9a9;
    }
  }
  .search-btn {
    width: 2rem;
    height: 2rem;
    margin-right: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-around;
    svg path {
      fill: currentColor;
    }
  }
  .tab-tooltips {
    position: absolute;
    padding: 6px 3px 6px 8px;
    top: 3.4rem;
    left: 50px;
    width: auto;
    border-radius: 4px;
    background: #f5e2cd;
    display: flex;
    filter: drop-shadow(0 0 5px rgb(150, 92, 57));
    align-items: center;
    &::before {
      position: absolute;
      content: '';
      width: 0;
      height: 0;
      top: -7px;
      left: 14px;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-bottom: 8px solid #f5e2cd;
    }
    .main {
      font-size: 14px;
      color: #ff933b;
      margin-right: 10px;
    }
    .no-more {
      font-size: 14px;
      color: rgb(122, 122, 119);
      padding: 3px 5px;
      cursor: pointer;
      border-radius: 3px;
      &:hover {
        background: #c2ccda;
      }
    }
  }
  .link-search-wrapper {
    position: absolute;
    top: calc(2.4rem + 5px);
    width: calc(100% - 90px);
    left: 50px;
    background: v-bind(boxBackground);
    text-align: left;
    z-index: 999;
    border-radius: 4px;
    // box-shadow: 0 0 10px #ccc;
    border: 1px solid #c8c8cc;
    padding: 5px 0;
    .link-search-item {
      padding: 0 10px;
      cursor: pointer;
      width: 100%;
      height: 30px;
      display: flex;
      align-items: center;
      .text {
        width: 100%;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        line-height: 30px;
        font-size: 13px;
        color: v-bind(textColor);
        &:hover {
          color: #2e5adb;
        }
      }
      &.active {
        .text {
        color: #2e5adb;
        }
      }
      .remove-btn {
        width: 24px;
        height: 24px;
        display: flex;
        border-radius: 2px;
        margin-left: 4px;
        align-items: center;
        justify-content: center;
        color: #889;
        &:hover {
          background: rgba(0,0,0,.1);
        }
      }
    }
  }
}
.clear-history {
  padding: 10px 10px 12px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  .clear-history-btn {
    color: #aab;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    &:hover {
      color: #b44;
    }
  }
}
</style>
