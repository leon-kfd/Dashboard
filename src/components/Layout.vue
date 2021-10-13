<template>
  <div class="wrapper" :style="`width: ${windowWidth}px;`">
    <grid-layout
      v-model:layout="list"
      :col-num="12"
      :row-height="rowHeight"
      :margin="[global.gutter, global.gutter]"
      :is-draggable="!isLock"
      :is-resizable="!isLock"
      vertical-compact
      use-css-transforms
    >
      <grid-item
        v-for="item in list"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
        :style="{ 'z-index': item.zIndex || 1 }"
        >
          <div
            v-if="!item.refresh"
            v-mouse-menu="{ disabled: () => isLock, params: item, menuList }"
            class="item-content"
            :class="!isLock && 'show-outline-1'"
            :style="{
              boxShadow: item.boxShadow,
              borderRadius: item.borderRadius + 'px',
              userSelect: item.actionSetting && item.actionSetting.actionType === 1 ? 'none' : 'auto',
              cursor: item.actionSetting && item.actionSetting.actionType === 1 ? 'pointer' : 'default'
            }">
            <div
              class="bg"
              :style="{
                background: item.background,
                borderRadius: item.borderRadius + 'px',
                filter: item.background.includes('url') && item.backgroundFilter
              }">
            </div>
            <component
              :is="MATERIAL_LIST_MAP[item.material].label"
              :element="item"
              :componentSetting="item.componentSetting"
              @click="handleComponentClick(item, $event)">
            </component>
          </div>
      </grid-item>
    </grid-layout>
  </div>
  <div class="affix-wrapper">
    <div
      class="affix-item"
      :class="!isLock && 'show-outline-2'"
      v-for="element in affix"
      v-to-control="{
        positionMode: element.affixInfo.mode,
        moveCursor: false,
        disabled: () => isLock,
        arrowOptions: {
          lineColor: '#9a98c3',
          size: 12,
          padding: 8
        }
      }"
      :key="element.id"
      :style="{
        width: `${element.w}px`,
        height: `${element.h}px`,
        zIndex: element.zIndex || 2,
        ...computedPosition(element.affixInfo)
      }"
      @todragend="handleAffixDragend($event, element)"
      @tocontrolend="handleAffixDragend($event, element)"
    >
      <div
        class="affix-item-content"
        v-if="!element.refresh"
        v-mouse-menu="{ disabled: () => isLock, params: element, menuList }"
        :style="{
          boxShadow: element.boxShadow,
          borderRadius: element.borderRadius + 'px',
          userSelect: element.actionSetting && element.actionSetting.actionType === 1 ? 'none' : 'auto',
          cursor: element.actionSetting && element.actionSetting.actionType === 1 ? 'pointer' : 'default'
        }">
        <div
          class="bg"
          :style="{
            background: element.background,
            borderRadius: element.borderRadius + 'px',
            filter: element.background.includes('url') && element.backgroundFilter
          }">
        </div>
        <component
          :is="MATERIAL_LIST_MAP[element.material].label"
          :element="element"
          :componentSetting="element.componentSetting"
          @click="handleComponentClick(element, $event)">
        </component>
      </div>
    </div>
  </div>
  <ComponentConfig ref="componentConfig" />
  <ActionConfig ref="actionConfig" />
  <ActionPopover ref="actionPopover">
    <div
      v-if="
        actionElement &&
        actionElement.actionSetting &&
        actionElement.actionSetting.actionType === 1 &&
        actionElement.actionSetting.actionClickType === 1
      "
      class="action-popover-wrapper"
      :style="{
        borderRadius: actionElement.actionSetting.actionClickValue.borderRadius + 'px',
        boxShadow: actionElement.actionSetting.actionClickValue.boxShadow,
      }">
      <div
        class="bg"
        :style="{
          background: actionElement.actionSetting.actionClickValue.background,
          filter: actionElement.actionSetting.actionClickValue.background.includes('url') && actionElement.actionSetting.actionClickValue.backgroundFilter
        }">
      </div>
      <component
        :is="MATERIAL_LIST_MAP[actionElement.actionSetting.actionClickValue.material].label"
        :element="actionElement"
        :componentSetting="actionElement.actionSetting.actionClickValue.componentSetting"
        isAction
      >
      </component>
    </div>
  </ActionPopover>
</template>

<script lang="ts">
import { defineComponent, ref, computed, defineAsyncComponent, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ToControlDirective } from '@howdyjs/to-control'
import MouseMenuDirective from '@/plugins/mouse-menu'
import { MATERIAL_LIST_MAP } from '@/constanst'
import useScreenMode from '@/plugins/useScreenMode'
import ComponentConfig from '@/components/ComponentConfig.vue'
import ActionConfig from '@/components/ActionConfig.vue'
import ActionPopover from '@/components/Action/ActionPopover.vue'
export default defineComponent({
  name: 'Layout',
  components: {
    ComponentConfig,
    ActionConfig,
    ActionPopover,
    Empty: defineAsyncComponent(() => import('@/materials/Empty/index.vue')),
    Clock: defineAsyncComponent(() => import('@/materials/Clock/index.vue')),
    Verse: defineAsyncComponent(() => import('@/materials/Verse/index.vue')),
    Search: defineAsyncComponent(() => import('@/materials/Search/index.vue')),
    Collection: defineAsyncComponent(() => import('@/materials/Collection/index.vue')),
    Iframe: defineAsyncComponent(() => import('@/materials/Iframe/index.vue')),
    TodoList: defineAsyncComponent(() => import('@/materials/TodoList/index.vue')),
    Weather: defineAsyncComponent(() => import('@/materials/Weather/index.vue')),
    CountDown: defineAsyncComponent(() => import('@/materials/CountDown/index.vue')),
    JuejinList: defineAsyncComponent(() => import('@/materials/JuejinList/index.vue')),
    WeiboList: defineAsyncComponent(() => import('@/materials/WeiboList/index.vue')),
    GithubTrending: defineAsyncComponent(() => import('@/materials/GithubTrending/index.vue')),
    Day: defineAsyncComponent(() => import('@/materials/Day/index.vue'))
  },
  directives: {
    MouseMenu: {
      ...MouseMenuDirective,
      updated: MouseMenuDirective.mounted
    },
    ToControl: ToControlDirective
  },
  emits: ['edit'],
  setup (props, { emit }) {
    const { windowWidth, windowHeight } = useScreenMode()

    const componentConfig = ref()
    const actionConfig = ref()
    const actionPopover = ref()

    const store = useStore()
    const isLock = computed(() => store.state.isLock)
    const global = computed(() => store.state.global)

    const list = computed({
      get: () => store.state.list,
      set: (val) => {
        store.commit('updateList', val)
      }
    })

    const actionElement = computed(() => store.state.actionElement)

    const rowHeight = computed(() => {
      const h = windowHeight.value / 27
      return h > 40 ? 40 : h < 20 ? 20 : h
    })

    const menuList = ref([
      {
        label: '基础配置',
        tips: 'Edit Base',
        fn: (params: ComponentOptions) => {
          emit('edit', params.i)
        }
      },
      {
        label: '组件配置',
        tips: 'Edit Component',
        fn: (params: ComponentOptions) => {
          componentConfig.value.open(params)
        }
      },
      {
        label: '交互配置',
        tips: 'Edit Action',
        hidden: (params: ComponentOptions) => ![1, 2, 3, 8, 9].includes(params.material),
        fn: (params: ComponentOptions) => {
          actionConfig.value.open(params)
        }
      },
      {
        label: '刷新',
        tips: 'Refresh',
        fn: async (params: ComponentOptions & { refresh?: boolean }) => {
          params.refresh = true;
          await nextTick();
          params.refresh = false;
        }
      },
      {
        label: '删除',
        tips: 'Delete',
        fn: (params: ComponentOptions) => {
          store.commit('deleteComponent', params)
        }
      }
    ])

    const affix = computed(() => store.state.affix)
    const computedPosition = ({ mode, x, y }: AffixInfo) => {
      const result = {
        top: 'auto',
        left: 'auto',
        bottom: 'auto',
        right: 'auto'
      }
      if ([1, 2].includes(mode)) {
        result.top = y + 'px'
      } else {
        result.bottom = y + 'px'
      }
      if ([1, 3].includes(mode)) {
        result.left = x + 'px'
      } else {
        result.right = x + 'px'
      }
      return result
    }

    const handleAffixDragend = ($event: any, element: ComponentOptions) => {
      console.log('$event', $event)
      const mode = element.affixInfo?.mode || 1
      const { left, top, bottom, right, width, height } = $event
      const _element = JSON.parse(JSON.stringify(element))
      _element.affixInfo.x = [1, 3].includes(mode) ? left : right
      _element.affixInfo.y = [1, 2].includes(mode) ? top : bottom
      if (width && height) {
        _element.w = width
        _element.h = height
      }
      store.commit('editComponent', _element)
    }

    const handleComponentClick = (component: ComponentOptions, $event: PointerEvent) => {
      if (
        isLock.value &&
        component.actionSetting &&
        component.actionSetting.actionType === 1
      ) {
        if (component.actionSetting.actionClickType === 1) {
          store.commit('updateActionElement', component)
          actionPopover.value.toggle(component, $event.target)
        } else if (component.actionSetting.actionClickType === 2) {
          const url = component.actionSetting.actionClickValue.url
          window.open(url)
        }
      }
    }

    return {
      windowWidth,
      rowHeight,
      list,
      isLock,
      global,
      menuList,
      MATERIAL_LIST_MAP,
      componentConfig,
      actionConfig,
      actionPopover,
      actionElement,
      affix,
      computedPosition,
      handleAffixDragend,
      handleComponentClick
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  zoom: 1;
  &:after {
    content: '';
    clear: both;
    display: table;
    height: 0;
  }
  .item-content {
    width: 100%;
    height: 100%;
    position: relative;
    .bg {
      position: absolute;
      width: 100%;
      height: 100%;
      left: 0;
      top: 0;
      background-size: cover;
    }
  }
}
.flip-list-move {
  transition: transform 0.4s;
}
.affix-wrapper {
  .affix-item {
    position: fixed;
    transition: none !important;
    .affix-item-content {
      width: 100%;
      height: 100%;
      position: relative;
      .bg {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background-size: cover;
      }
    }
  }
}
.action-popover-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-size: cover;
  }
}
.show-outline-1 {
  outline: 2px dashed $--color-primary;
  user-select: none;
}
.show-outline-2 {
  outline: 2px dashed $--color-warning;
  user-select: none;
  cursor: move;
}
</style>
<style>
.vue-grid-item > .vue-resizable-handle {
  width: 24px !important;
  height: 24px !important;
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjMxNjA4MTYyMzEwIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMzNjExIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiPjxkZWZzPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+PC9zdHlsZT48L2RlZnM+PHBhdGggZD0iTTI4Ni4xNjUzMzMgNjcwLjE2NTMzM2E0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMSAxLTYwLjMzMDY2Ni02MC4zMzA2NjZsMjU2LTI1NmE0Mi42NjY2NjcgNDIuNjY2NjY3IDAgMCAxIDU5LjAwOC0xLjI4bDI1NiAyMzQuNjY2NjY2YTQyLjY2NjY2NyA0Mi42NjY2NjcgMCAxIDEtNTcuNjg1MzM0IDYyLjg5MDY2N2wtMjI1Ljg3NzMzMy0yMDcuMDYxMzMzLTIyNy4xMTQ2NjcgMjI3LjExNDY2NnoiIGZpbGw9IiM5YTk4YzMiIHAtaWQ9IjMzNjEyIj48L3BhdGg+PC9zdmc+') 0 0/24px 24px !important;
  padding: 0 !important;
  transform: rotate(135deg) !important;
}
</style>
