<template>
  <div class="wrapper" :style="`width: ${windowWidth}px`">
    <Draggable
      v-model="cloneList"
      item-key="id"
      tag="transition-group"
      :component-data="{ name:'flip-list' }"
      @change="onChange"
      :disabled="isLock">
      <template #item="{ element }">
        <div
          class="item"
          :style="{
            width: `${element.sizeWidthUnit !== 2 ? ~~(fr * (screenMode === 0 ? Math.min(element.sizeWidth, 12) : element.sizeWidth)) : element.sizeWidth + global.gutter * 2}px`,
            height: `${element.sizeHeightUnit !== 2 ? ~~(fr * element.sizeHeight) : element.sizeHeight + global.gutter * 2}px`,
            padding: `${global.gutter}px`,
          }">
          <div
            v-if="!element.refresh"
            v-mouse-menu="{
              disabled: () => isLock,
              params: element,
              menuList
            }"
            class="item-content"
            :class="!isLock && 'show-outline-1'"
            :style="{
              background: element.background,
              boxShadow: element.boxShadow,
              borderRadius: element.borderRadius + 'px'
            }">
            <component :is="MATERIAL_LIST_MAP[element.material].label" :element="element" :componentSetting="element.componentSetting"></component>
          </div>
        </div>
      </template>
    </Draggable>
  </div>
  <div class="affix-wrapper">
    <div
      class="affix-item"
      :class="!isLock && 'show-outline-2'"
      v-for="element in affix"
      v-to-drag="{
        positionMode: element.affixInfo.mode,
        moveCursor: false,
        disabled: () => isLock
      }"
      :key="element.id"
      :style="{
        width: `${element.sizeWidthUnit !== 2 ? ~~(fr * (screenMode === 0 ? Math.min(element.sizeWidth, 12) : element.sizeWidth)) : element.sizeWidth + global.gutter * 2}px`,
        height: `${element.sizeHeightUnit !== 2 ? ~~(fr * element.sizeHeight) : element.sizeHeight + global.gutter * 2}px`,
        ...computedPosition(element.affixInfo)
      }"
      @todragend="handleAffixDragend($event, element)"
    >
      <div
        class="affix-item-content"
        v-if="!element.refresh"
        v-mouse-menu="{
          disabled: () => isLock,
          params: element,
          menuList
        }"
        :style="{
          background: element.background,
          boxShadow: element.boxShadow,
          borderRadius: element.borderRadius + 'px',
        }">
        <component :is="MATERIAL_LIST_MAP[element.material].label" :element="element" :componentSetting="element.componentSetting"></component>
      </div>
    </div>
  </div>
  <ComponentConfig ref="componentConfig" />
</template>

<script lang="ts">
import { defineComponent, ref, computed, defineAsyncComponent, nextTick, watchEffect } from 'vue'
import { useStore } from 'vuex'
import Draggable from 'vuedraggable'
// import { MouseMenuDirective } from '@howdyjs/mouse-menu';
import { ToDragDirective } from '@howdyjs/to-drag'
import MouseMenuDirective from '@/plugins/mouse-menu'
import { MATERIAL_LIST_MAP } from '@/constanst'
import useScreenMode from '@/plugins/useScreenMode'
import ComponentConfig from '@/components/ComponentConfig.vue'
export default defineComponent({
  name: 'Layout',
  components: {
    Draggable,
    ComponentConfig,
    Empty: defineAsyncComponent(() => import('@/materials/Empty/index.vue')),
    Clock: defineAsyncComponent(() => import('@/materials/Clock/index.vue')),
    Verse: defineAsyncComponent(() => import('@/materials/Verse/index.vue')),
    Search: defineAsyncComponent(() => import('@/materials/Search/index.vue')),
    Collection: defineAsyncComponent(() => import('@/materials/Collection/index.vue')),
    Iframe: defineAsyncComponent(() => import('@/materials/Iframe/index.vue')),
    TodoList: defineAsyncComponent(() => import('@/materials/TodoList/index.vue')),
    Weather: defineAsyncComponent(() => import('@/materials/Weather/index.vue')),
    CountDown: defineAsyncComponent(() => import('@/materials/CountDown/index.vue')),
    JuejinList: defineAsyncComponent(() => import('@/materials/JuejinList/index.vue'))
  },
  directives: {
    MouseMenu: {
      ...MouseMenuDirective,
      updated: MouseMenuDirective.mounted
    },
    ToDrag: ToDragDirective
  },
  props: {
    gutter: {
      type: Number,
      default: 10
    }
  },
  emits: ['edit'],
  setup (props, { emit }) {
    const { windowWidth, screenMode, fr } = useScreenMode()

    const componentConfig = ref()

    const store = useStore()
    const isLock = computed(() => store.state.isLock)
    const global = computed(() => store.state.global)

    const cloneList = ref([])
    watchEffect(() => {
      cloneList.value = JSON.parse(JSON.stringify(store.state.list))
    })
    const onChange = () => {
      store.commit('updateList', cloneList)
    }

    const menuList = ref([
      {
        label: '基础配置',
        tips: 'Edit Base',
        fn: (params: ComponentOptions) => {
          emit('edit', params.id)
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
        label: '刷新',
        tips: 'Refresh',
        fn: async (params: ComponentOptions) => {
          const setting = JSON.parse(JSON.stringify(params))
          setting.refresh = true
          store.commit('editComponent', setting)
          await nextTick()
          setting.refresh = false
          store.commit('editComponent', setting)
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
      const mode = element.affixInfo?.mode || 1
      const { left, top, bottom, right } = $event
      const _element = JSON.parse(JSON.stringify(element))
      _element.affixInfo.x = [1, 3].includes(mode) ? left : right
      _element.affixInfo.y = [1, 2].includes(mode) ? top : bottom
      store.commit('editComponent', _element)
    }

    return {
      fr,
      windowWidth,
      cloneList,
      onChange,
      isLock,
      global,
      menuList,
      MATERIAL_LIST_MAP,
      screenMode,
      componentConfig,
      affix,
      computedPosition,
      handleAffixDragend
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
  .item {
    float: left;
    .item-content {
      width: 100%;
      height: 100%;
      position: relative;
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
    .affix-item-content {
      width: 100%;
      height: 100%;
    }
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
