<template>
  <div class="wrapper" :style="`width: ${windowWidth}px`">
    <Draggable v-model="cloneList" item-key="id" tag="transition-group" :component-data="{ name:'flip-list' }" @change="onChange" :disabled="!isLock">
      <template #item="{ element }">
        <div 
          class="item"
          v-mouse-menu="{
            params: element,
            menuList
          }"
          :style="{
            width: `${~~(fr * (screenMode === 0 ? Math.min(element.w, 12) : element.w))}px`,
            height: `${~~(fr * element.h)}px`,
            padding: `${gutter}px`,
          }">
          <div class="item-content" :style="`background: ${element.background}`">
            <component :is="MATERIAL_LIST_MAP[element.material]" v-bind="{...element.props}"></component>
          </div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, defineAsyncComponent } from 'vue'
import { useStore } from 'vuex'
import Draggable from 'vuedraggable'
import { MouseMenuDirective } from '@howdyjs/mouse-menu';
import { MATERIAL_LIST_MAP } from '@/constanst'
import useScreenMode from '@/plugins/useScreenMode'
export default defineComponent({
  name: 'Layout',
  components: {
    Draggable,
    Empty: defineAsyncComponent(() => import('@/materials/Empty.vue'))
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
  setup () {
    const { windowWidth, screenMode, fr } = useScreenMode()

    const store = useStore()
    const isLock = computed(() => store.state.isLock)

    const cloneList = ref([])
    let needWatchChange = true
    watch(() => store.state.list, (val) => {
      if (needWatchChange) {
        cloneList.value = JSON.parse(JSON.stringify(val))
      }
      needWatchChange = true
    }, {
      immediate: true
    })
    const onChange = () => {
      needWatchChange = false
      store.commit('updateList', cloneList)
    }

    const menuList = ref([
      {
        label: '编辑',
        tips: 'Edit',
        fn: (params: ComponentOptions) => {
          handleEdit(params)
        }
      },
      {
        label: '删除',
        tips: 'Delete',
        fn: (params: ComponentOptions) => {
          handleDelete(params)
        }
      }
    ])

    function handleEdit(params: ComponentOptions) {
      console.log('edit', params)
    }
    function handleDelete(params: ComponentOptions) {
      store.commit('deleteComponentFromList', params)
    }

    return {
      fr,
      windowWidth,
      cloneList,
      onChange,
      isLock,
      menuList,
      MATERIAL_LIST_MAP,
      screenMode
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  // display: flex;
  // flex-wrap: wrap;
  .item {
    float: left;
    .item-content {
      width: 100%;
      height: 100%;
      box-shadow: 0 2px 10px #ccc;
      padding: 10px;
      display: grid;
      place-items: center;
      border-radius: 4px;
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
