<template>
  <div class="wrapper" :style="`width: ${windowWidth}px`">
    <Draggable v-model="cloneList" item-key="id" tag="transition-group" :component-data="{ name:'flip-list' }" @change="onChange" :disabled="isLock">
      <template #item="{ element }">
        <div 
          class="item"
          v-mouse-menu="{
            params: element,
            menuList
          }"
          :style="{
            width: `${~~(fr * (screenMode === 0 ? Math.min(element.sizeWidth, 12) : element.sizeWidth))}px`,
            height: `${~~(fr * element.sizeHeight)}px`,
            padding: `${gutter}px`,
          }">
          <div 
            v-if="!element.refresh" 
            class="item-content" 
            :style="{
              background: element.background,
              boxShadow: element.boxShadow,
              borderRadius: element.borderRadius
            }">
            <component :is="MATERIAL_LIST_MAP[element.material].label" :componentSetting="element.componentSetting"></component>
          </div>
        </div>
      </template>
    </Draggable>
  </div>
  <ComponentConfig ref="componentConfig" />
</template>

<script lang="ts">
import { defineComponent, ref, computed, defineAsyncComponent, nextTick, watchEffect } from 'vue'
import { useStore } from 'vuex'
import Draggable from 'vuedraggable'
// import { MouseMenuDirective } from '@howdyjs/mouse-menu';
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
    Clock: defineAsyncComponent(() => import('@/materials/Clock/index.vue'))
  },
  directives: {
    MouseMenu: MouseMenuDirective
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
          console.log(params)
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

    return {
      fr,
      windowWidth,
      cloneList,
      onChange,
      isLock,
      menuList,
      MATERIAL_LIST_MAP,
      screenMode,
      componentConfig
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
      padding: 10px;
      display: grid;
      place-items: center;
      position: relative;
      overflow: hidden;
      background-size: cover;
    }
  }
}
.flip-list-move {
  transition: transform 0.4s;
}
</style>
