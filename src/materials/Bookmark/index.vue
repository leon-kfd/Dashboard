<template>
  <div
    class="wrapper"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      padding: componentSetting.padding + 'px'
    }">
    <div
      class="bookmark-wrapper"
      :style="{
        maxWidth: `${componentSetting.maxWidth || 880}px`,
        pointerEvents: isLock ? 'all' : 'none'
      }">
      <Draggable
        v-model="list"
        class="bookmark-draggable-wrapper"
        item-key="id">
        <template #item="{ element, index }">
          <div
            v-mouse-menu="{ params: { element, index }, menuList, width: 120 }"
            class="item"
            @click="jump(element, $event)">
            <div class="tile-icon" :style="{ background: element.bgColor, boxShadow: componentSetting.boxShadow }">
              <template v-if="element.type !== 'folder'">
                <img v-if="element.iconType === 'network'" :src="element.iconPath" alt="">
                <div v-if="element.iconType === 'text'" :style="{ fontSize: iconSize, color: element.iconPath }" class="no-icon">{{element.title.slice(0,1)}}</div>
              </template>
              <svg v-else viewBox="0 0 1124 1024" :width="(iconSize || '32').replace('px','')" :height="(iconSize || '32').replace('px','')">
                <path d="M948.079775 106.337352H460.223099S394.153465 1.788394 355.688563 1.788394H181.435493a69.68969 69.68969 0 0 0-69.68969 69.704113v801.474704a69.718535 69.718535 0 0 0 69.68969 69.68969h766.629859a69.718535 69.718535 0 0 0 69.68969-69.68969V176.027042a69.718535 69.718535 0 0 0-69.68969-69.68969z" fill="#D0994B"></path>
                <path d="M111.745803 210.871887h906.023662v278.787606H111.745803z" fill="#E4E7E7"></path>
                <path d="M76.900958 280.561577h975.713352a69.68969 69.68969 0 0 1 69.704113 69.704113L1052.628732 942.656901a69.718535 69.718535 0 0 1-69.704112 69.689691H146.60507a69.718535 69.718535 0 0 1-69.704112-69.689691L7.211268 350.26569a69.68969 69.68969 0 0 1 69.68969-69.704113z" fill="#F4B459"></path>
              </svg>
            </div>
            <div class="tile-title">{{element.title}}</div>
            <!-- <div class="edit-btn" @click.stop="handleEdit(element)">
              <i class="el-icon-setting"></i>
            </div>
            <div class="delete-btn" @click.stop="handleDelete(index)">
              <i class="el-icon-close"></i>
            </div> -->
          </div>
        </template>
        <template #footer>
          <div class="item" @click="handleAddNewBookmark()">
            <div class="btn-add-wrapper">
              <i class="el-icon-plus"></i>
            </div>
          </div>
          <div class="item fake" v-for="number in 20" :key="number"></div>
        </template>
      </Draggable>
    </div>
    <ConfigDialog
      ref="configDialog"
      :boxSize="boxSize"
      :boxRadius="boxRadius"
      :iconSize="iconSize"
      @add="addBookmark"
      @edit="editBookmark" />
    <MoveDialog ref="moveDialog" :folderList="folderList" />
    <ActionPopover ref="popover" :close-on-click-outside="false" @closed="popoverClosed">
      <div class="popover-wrapper" v-if="folderOpener">
        <div class="title">{{ folderOpener.title }}</div>
        <Draggable
          v-model="folderOpener.children"
          class="bookmark-draggable-wrapper"
          item-key="id"
          @end="folderOpenerSortChange">
          <template #item="{ element, index }">
            <div
              v-mouse-menu="{ params: { element, index, parent: folderOpener }, menuList, width: 120 }"
              class="item"
              :style="{ width: boxWrapperSize, height: boxWrapperSize, padding }"
              @click="jump(element)">
              <div class="tile-icon" :style="{ background: element.bgColor, boxShadow: componentSetting.boxShadow, width: boxSize, height: boxSize, borderRadius: boxRadius }">
                <template v-if="element.type !== 'folder'">
                  <img v-if="element.iconType === 'network'" :style="{ width: iconSize, height: iconSize}" :src="element.iconPath" alt="">
                  <div v-if="element.iconType === 'text'" :style="{ fontSize: iconSize, color: element.iconPath }" class="no-icon">{{element.title.slice(0,1)}}</div>
                </template>
              </div>
              <div class="tile-title" :style="{ fontSize: textFontSize, color: textColor}">{{element.title}}</div>
            </div>
          </template>
          <template #footer>
            <div class="item" :style="{ width: boxWrapperSize, height: boxWrapperSize, padding }" @click="handleAddNewBookmark(folderOpener)">
              <div class="btn-add-wrapper" :style="{ color: textColor, border: `2px dashed ${textColor}`}">
                <i class="el-icon-plus"></i>
              </div>
            </div>
            <div
              class="item fake"
              :style="{ width: boxWrapperSize, padding: `0 ${padding}` }"
              v-for="number in 20"
              :key="number">
            </div>
          </template>
        </Draggable>
      </div>
    </ActionPopover>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick } from 'vue';
import Draggable from 'vuedraggable'
import { useStore } from 'vuex'
import ConfigDialog from './ConfigDialog.vue'
import MoveDialog from './MoveDialog.vue'
import ActionPopover from '@/components/Action/ActionPopover.vue'
import MouseMenuDirective from '@/plugins/mouse-menu'
const props = defineProps({
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
})
const vMouseMenu = {
  ...MouseMenuDirective,
  updated: MouseMenuDirective.mounted
}

const configDialog = ref()

const isLock = computed(() => store.state.isLock)
const boxSize = computed(() => props.componentSetting.boxSize + 'px')
const boxRadius = computed(() => props.componentSetting.boxRadius + 'px')
const iconSize = computed(() => props.componentSetting.iconSize + 'px')
const textFontSize = computed(() => props.componentSetting.textFontSize + 'px')
const textColor = computed(() => props.componentSetting.textColor)
const padding = computed(() => props.componentSetting.padding + 'px')
const boxWrapperSize = computed(() => `${props.componentSetting.boxSize + props.componentSetting.textFontSize * 1.5 + props.componentSetting.padding * 2 + 8}px`)

const store = useStore()
const list = computed({
  get: () => props.componentSetting.bookmark,
  set: (val) => {
    const element = JSON.parse(JSON.stringify(props.element))
    if (props.isAction) {
      element.componentSetting.actionClickValue.componentSetting.bookmark = val
      store.dispatch('updateActionElement', element)
    } else {
      element.componentSetting.bookmark = val
    }
    store.dispatch('editComponent', element)
  }
})

const menuList = ref([
  {
    label: '编辑',
    fn: (params: any) => {
      handleEdit(params.element, params.parent)
    },
    icon: 'el-icon-setting'
  },
  {
    label: '移动',
    fn: (params: any) => {
      handleMove([params.element], params.parent)
    },
    hidden: (params: any) => params.element.type === 'folder',
    icon: 'el-icon-position'
  },
  {
    label: '删除',
    fn: (params: any) => {
      handleMove([params.element], params.parent, true)
    },
    icon: 'el-icon-edit-outline',
    customClass: 'delete'
  },
])

const handleEdit = (params: Bookmark, parent?: Bookmark) => configDialog.value.open(params, parent)
const handleAddNewBookmark = (parent?: Bookmark | null) => configDialog.value.open(null, parent)

const addBookmark = (formData: Bookmark, parent?: Bookmark) => {
  const element = JSON.parse(JSON.stringify(props.element))
  const bookmark = props.isAction ? element.componentSetting.actionClickValue.componentSetting.bookmark : element.componentSetting.bookmark
  if (parent) {
    const parentIndex = bookmark.findIndex((item: Bookmark) => item.id === parent.id)
    if (~parentIndex) {
      bookmark[parentIndex].children.push(formData)
    }
  } else {
    bookmark.push(formData)
  }
  // if (props.isAction) {
  //   element.componentSetting.actionClickValue.componentSetting.bookmark.push(formData)
  //   store.dispatch('updateActionElement', element)
  // } else {
  //   element.componentSetting.bookmark.push(formData)
  // }
  store.dispatch('editComponent', element)
  if (parent) refreshFolderOpener()
}

const editBookmark = async (formData: Bookmark, parent?: Bookmark) => {
  const element = JSON.parse(JSON.stringify(props.element))
  const bookmark = props.isAction ? element.componentSetting.actionClickValue.componentSetting.bookmark : element.componentSetting.bookmark
  if (parent) {
    const parentIndex = bookmark.findIndex((item: Bookmark) => item.id === parent.id)
    if (!~parentIndex) return
    const childrenIndex = bookmark[parentIndex].children.findIndex((item: Bookmark) => item.id === formData.id)
    if (~childrenIndex) bookmark[parentIndex].children[childrenIndex] = formData
  } else {
    const index = bookmark.findIndex((item: Bookmark) => item.id === formData.id)
    if (~index) bookmark[index] = formData
  }
  store.dispatch('editComponent', element)
  if (parent) refreshFolderOpener()
}

const jump = (element: Bookmark, $event?: any) => {
  if (element.type === 'icon') {
    let target = element.url as string
    if (!(/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(target))) {
      target = 'https://' + target
    }
    if (props.componentSetting.jumpType === 2) {
      window.location.href = target
    } else {
      window.open(target)
    }
  } else if (element.type === 'folder') {
    popover.value.defaultOpen({
      w: Math.min(720, window.innerWidth * 0.9),
      h: Math.min(400, window.innerHeight * 0.75),
      direction: 0
    }, $event.currentTarget)
    folderOpener.value = element
  }
}

const moveDialog = ref()
const folderList = computed(() => list.value.filter((item:Bookmark) => item.type === 'folder'))
const handleMove = async (params: Bookmark[], parent: Bookmark, isDelete = false) => {
  try {
    const element = JSON.parse(JSON.stringify(props.element))
    const bookmark = props.isAction ? element.componentSetting.actionClickValue.componentSetting.bookmark : element.componentSetting.bookmark
    if (!isDelete) {
      const folder = await moveDialog.value.move(parent)
      if (folder === '$root') {
        // 根目录
        params.map(item => {
          if (!~bookmark.findIndex((item1: Bookmark) => item1.id === item.id)) {
            bookmark.push(item)
          }
        })
      } else {
        const index = bookmark.findIndex((item: Bookmark) => item.id === folder)
        // 移动
        if (~index) {
          params.map(item => {
            if (!~bookmark[index].children.findIndex((item1: Bookmark) => item1.id === item.id)) {
              bookmark[index].children.push(item)
            }
          })
        }
      }
    } else {
      if (!confirm('确认要删除所选项?')) return
    }
    // 删除源
    if (parent) {
      const parentIndex = bookmark.findIndex((item: Bookmark) => item.id === parent.id)
      params.map(item => {
        const index = bookmark[parentIndex].children.findIndex((item1:Bookmark) => item1.id === item.id)
        if (~index) bookmark[parentIndex].children.splice(index, 1)
      })
    } else {
      params.map(item => {
        const index = bookmark.findIndex((item1:Bookmark) => item1.id === item.id)
        if (~index) bookmark.splice(index, 1)
      })
    }
    if (props.isAction) store.dispatch('updateActionElement', element)
    store.dispatch('editComponent', element)
    if (parent) refreshFolderOpener()
  } catch (e) {
    console.error(e)
    console.log('Cancel Move')
  }
}

const folderOpener = ref<Bookmark | null>()
const popover = ref()

const refreshFolderOpener = async () => {
  await nextTick()
  const index = list.value.findIndex((item: Bookmark) => item.id === folderOpener.value?.id)
  if (~index) {
    folderOpener.value = list.value[index]
  }
}

const folderOpenerSortChange = () => {
  const element = JSON.parse(JSON.stringify(props.element))
  const bookmark = props.isAction ? element.componentSetting.actionClickValue.componentSetting.bookmark : element.componentSetting.bookmark
  const index = list.value.findIndex((item: Bookmark) => item.id === folderOpener.value?.id)
  bookmark[index].children = folderOpener.value?.children
  store.dispatch('editComponent', element)
}
const popoverClosed = () => {
  folderOpener.value = null
}
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  user-select: none;
  .bookmark-wrapper {
    width: 100%;
  }
}
.bookmark-draggable-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: v-bind('padding');
    width: v-bind('boxWrapperSize');
    height: v-bind('boxWrapperSize');
    cursor: pointer;
    border-radius: 4px;
    &:hover {
      background: rgba($--color-dark, .42);
      .delete-btn,
      .edit-btn {
        display: flex;
      }
    }
    &.fake {
      height: 0;
      padding-top: 0;
      padding-bottom: 0;
    }
    .tile-icon {
      width: v-bind('boxSize');
      height: v-bind('boxSize');
      border-radius: v-bind('boxRadius');
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(241, 243, 244, 1);
      margin: 4px 0;
      img {
        width: v-bind('iconSize');
        height: v-bind('iconSize');
      }
      .no-icon {
        font-weight: bold;
      }
    }
    .tile-title {
      font-size: v-bind('textFontSize');
      color: v-bind('textColor');
      width: 100%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-top: 4px;
    }
    .edit-btn,
    .delete-btn {
      display: none;
      position: absolute;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      font-size: 14px;
      color: rgb(193, 204, 212);
      border-radius: 50%;
      cursor: pointer;
      &:hover {
        background: rgb(133, 136, 138);
      }
    }
    .edit-btn {
      top: 2px;
      left: 2px;
    }
    .delete-btn {
      right: 2px;
      top: 2px;
    }
    .btn-add-wrapper {
      border-radius: 4px;
      width: calc(100% - 10px);
      height: calc(100% - 10px);
      border: 2px dashed v-bind('textColor');
      color: v-bind('textColor');
      font-size: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
.popover-wrapper {
  background: rgba(#242428, .98);
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 4px;
  .title {
    font-weight: bold;
    color: #fff;
    font-size: 20px;
    padding-left: 10px;
    border-left: 4px solid #b8b8e4;
    margin-bottom: 12px;
  }
  .bookmark-draggable-wrapper {
    width: 100%;
  }
}
</style>
