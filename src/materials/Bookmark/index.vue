<template>
  <div
    class="wrapper material-bookmark"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
    }"
  >
    <div
      class="bookmark-wrapper"
      :style="{
        maxWidth: `${componentSetting.maxWidth || 880}px`,
        pointerEvents: isLock ? 'all' : 'none'
      }"
    >
      <Draggable v-model="list" class="bookmark-draggable-wrapper" item-key="id">
        <template #item="{ element, index }">
          <div
            v-mouse-menu="{
              disabled: () => isInBatch,
              params: { element, index },
              menuList,
              width: 160,
              iconType: 'vnode-icon'
            }"
            :class="['item']"
            @click="jump(element, $event)"
          >
            <div
              :class="['tile-icon', isInBatch && !batchParent && 'bounce-icon']"
              :style="{ background: element.bgColor, boxShadow: componentSetting.boxShadow }"
            >
              <template v-if="element.type !== 'folder'">
                <img v-if="element.iconType === 'network'" :src="element.iconPath" alt="" />
                <div
                  v-if="element.iconType === 'text'"
                  :style="{ fontSize: iconSize, color: element.iconPath }"
                  class="no-icon"
                >
                  {{ element.iconText || element.title.slice(0, 1) }}
                </div>
              </template>
              <svg
                v-else
                viewBox="0 0 1024 1024"
                :width="(iconSize || '32').replace('px', '')"
                :height="(iconSize || '32').replace('px', '')"
              >
                  <path d="M853.333333 256H469.333333l-85.333333-85.333333H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v170.666667h853.333334v-85.333334c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFD766"></path>
                  <path d="M853.333333 256H170.666667c-46.933333 0-85.333333 38.4-85.333334 85.333333v426.666667c0 46.933333 38.4 85.333333 85.333334 85.333333h682.666666c46.933333 0 85.333333-38.4 85.333334-85.333333V341.333333c0-46.933333-38.4-85.333333-85.333334-85.333333z" fill="#FFAC33"></path>
              </svg>
            </div>
            <div class="tile-title">{{ element.title }}</div>
            <div class="selected-icon" v-if="selectedIds.includes(element.id)">
              <Icon name="check" size="30" />
            </div>
          </div>
        </template>
        <template #footer>
          <div
            v-if="!isInBatch"
            v-show="!componentSetting.hiddenAddBtn || list.length === 0"
            class="item btn-add-item"
            @click="handleAddNewBookmark()"
          >
            <div class="btn-add-wrapper">
              <Icon name="add" />
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
      @edit="editBookmark"
      @import="importBookmark"
    />
    <MoveDialog ref="moveDialog" :folderList="folderList" />
    <ActionPopover
      ref="popover"
      :close-on-click-outside="!!componentSetting.closeClickOutside"
      @closed="popoverClosed"
      :zIndex="1000"
    >
      <div class="popover-wrapper" v-if="folderOpener">
        <div class="title">{{ folderOpener.title }}</div>
        <Draggable
          v-model="folderOpener.children"
          class="bookmark-draggable-wrapper"
          item-key="id"
          @end="folderOpenerSortChange"
        >
          <template #item="{ element, index }">
            <div
              v-mouse-menu="{
                params: { element, index, parent: folderOpener },
                menuList,
                width: 160,
                iconType: 'vnode-icon'
              }"
              :class="['item']"
              :style="{ width: boxWrapperSize, height: boxWrapperSize, padding }"
              @click="jump(element)"
            >
              <div
                :class="['tile-icon', isInBatch && batchParent && 'bounce-icon']"
                :style="{
                  background: element.bgColor,
                  boxShadow: componentSetting.boxShadow,
                  width: boxSize,
                  height: boxSize,
                  borderRadius: boxRadius
                }"
              >
                <template v-if="element.type !== 'folder'">
                  <img
                    v-if="element.iconType === 'network'"
                    :style="{ width: iconSize, height: iconSize }"
                    :src="element.iconPath"
                    alt=""
                  />
                  <div
                    v-if="element.iconType === 'text'"
                    :style="{ fontSize: iconSize, color: element.iconPath }"
                    class="no-icon"
                  >
                    {{ element.iconText || element.title.slice(0, 1) }}
                  </div>
                </template>
              </div>
              <div class="tile-title" :style="{ fontSize: textFontSize, color: textColor }">
                {{ element.title }}
              </div>
              <div class="selected-icon" v-if="selectedIds.includes(element.id)">
                <Icon name="check" size="30" />
              </div>
            </div>
          </template>
          <template #footer>
            <div
              v-if="!isInBatch"
              v-show="
                !componentSetting.hiddenAddBtn ||
                (folderOpener.children && folderOpener.children.length === 0)
              "
              class="item btn-add-item"
              :style="{ width: boxWrapperSize, height: boxWrapperSize, padding }"
              @click="handleAddNewBookmark(folderOpener)"
            >
              <div
                class="btn-add-wrapper"
                :style="{ color: textColor, border: `2px dashed ${textColor}` }"
              >
                <Icon name="add" />
              </div>
            </div>
            <div
              class="item fake"
              :style="{ width: boxWrapperSize, padding: `0 ${padding}` }"
              v-for="number in 20"
              :key="number"
            ></div>
          </template>
        </Draggable>
        <div class="batch-operation-wrapper" v-if="isInBatch && batchParent">
          <div class="close-btn" @click="closeBatch"><Icon name="close" /></div>
          <div class="selected-count">
            <span class="num">{{ selected.length }}</span
            >{{ $t('项已选择') }}
          </div>
          <div class="operation-btn-wrapper">
            <div class="move-btn" @click="handleMove(selected, false, folderOpener)">
              <Icon name="send-plane" size="16" /> {{ $t('移动') }}
            </div>
            <div class="del-btn" @click="handleMove(selected, true, folderOpener)">
              <Icon name="delete" size="16" /> {{ $t('删除') }}
            </div>
          </div>
        </div>
      </div>
    </ActionPopover>
    <div class="batch-operation-wrapper" v-if="isInBatch && !batchParent">
      <div class="close-btn" @click="closeBatch"><Icon name="close" /></div>
      <div class="selected-count">
        <span class="num">{{ selected.length }}</span
        >{{ $t('项已选择') }}
      </div>
      <div class="operation-btn-wrapper">
        <div class="move-btn" @click="handleMove(selected)">
          <Icon name="send-plane" size="16" /> {{ $t('移动') }}
        </div>
        <div class="del-btn" @click="handleMove(selected, true)">
          <Icon name="delete" size="16" /> {{ $t('删除') }}
        </div>
      </div>
    </div>
    <IframeOpener ref="iframeOpener" />
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, nextTick, onMounted, onUnmounted, h } from 'vue'
import Draggable from 'vuedraggable'
import { useStore } from '@/store'
import ConfigDialog from './ConfigDialog.vue'
import MoveDialog from './MoveDialog.vue'
import ActionPopover from '@/components/Action/ActionPopover.vue'
import Icon from '@/components/Tools/Icon.vue'
import IframeOpener from '@/components/Global/IframeOpener.vue'
import MouseMenuDirective from '@/plugins/mouse-menu'
import { ElNotification } from 'element-plus'
import { uid } from '@/utils'
import { useI18n } from 'vue-i18n'
import type { MenuSetting } from '@howdyjs/mouse-menu'
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

const { t } = useI18n()

const configDialog = ref()
const iframeOpener = ref()

const isLock = computed(() => store.isLock)
const boxSize = computed(() => props.componentSetting.boxSize + 'px')
const boxRadius = computed(() => props.componentSetting.boxRadius + 'px')
const iconSize = computed(() => props.componentSetting.iconSize + 'px')
const textFontSize = computed(() => props.componentSetting.textFontSize + 'px')
const textColor = computed(() => props.componentSetting.textColor)
const padding = computed(() => props.componentSetting.padding + 'px')
const boxWrapperSize = computed(
  () =>
    `${
      props.componentSetting.boxSize +
      props.componentSetting.textFontSize * 1.5 +
      props.componentSetting.padding * 2 +
      8
    }px`
)

const store = useStore()
const list = computed({
  get: () => props.componentSetting.bookmark,
  set: (val) => {
    const element = JSON.parse(JSON.stringify(props.element))
    if (props.isAction) {
      element.componentSetting.actionClickValue.componentSetting.bookmark = val
      store.updateActionElement(element)
    } else {
      element.componentSetting.bookmark = val
    }
    store.editComponent(element)
  }
})

const menuList = ref<MenuSetting[]>([
  {
    label: (params: any) => params.element.title,
    customClass: 'title'
  },
  {
    label: () => t('新标签页打开'),
    customClass: 'skip-icon',
    fn: (params: any) => {
      window.open(params.element.url)
    },
    hidden: (params: any) => params.element.type === 'folder'
  },
  {
    label: () => t('IFrame窗口打开'),
    customClass: 'skip-icon',
    fn: (params: any) => {
      iframeOpener.value.open(params.element.url)
    },
    hidden: (params: any) => params.element.type === 'folder'
  },
  {
    line: true,
    hidden: (params: any) => params.element.type === 'folder'
  },
  {
    label: () => t('添加'),
    icon: h(Icon, { name: 'add', size: 18 }) as any,
    fn: (params: any) => {
      handleAddNewBookmark(params.parent)
    }
  },
  {
    label: () => t('编辑'),
    icon: h(Icon, { name: 'lock', size: 18 }) as any,
    fn: (params: any) => {
      handleEdit(params.element, params.parent)
    }
  },
  {
    label: () => t('移动'),
    icon: h(Icon, { name: 'send-plane', size: 18 }) as any,
    fn: (params: any) => {
      handleMove([params.element], false, params.parent)
    },
    hidden: (params: any) => params.element.type === 'folder'
  },
  {
    label: () => t('删除'),
    icon: h(Icon, { name: 'delete', size: 18 }) as any,
    fn: (params: any) => {
      handleMove([params.element], true, params.parent)
    },
    customClass: 'delete'
  },
  {
    line: true
  },
  {
    label: () => t('批量操作'),
    icon: h(Icon, { name: 'checkbox-multiple', size: 18 }) as any,
    fn: (params: any) => {
      setBatch(params.parent)
    }
  }
])

const handleEdit = (params: Bookmark, parent?: Bookmark) => configDialog.value.open(params, parent)
const handleAddNewBookmark = (parent?: Bookmark | null) => configDialog.value.open(null, parent)

const addBookmark = (formData: Bookmark, parent?: Bookmark) => {
  const element = JSON.parse(JSON.stringify(props.element))
  const bookmark = props.isAction
    ? element.componentSetting.actionClickValue.componentSetting.bookmark
    : element.componentSetting.bookmark
  if (parent) {
    const parentIndex = bookmark.findIndex((item: Bookmark) => item.id === parent.id)
    if (~parentIndex) {
      bookmark[parentIndex].children.push(formData)
    }
  } else {
    bookmark.push(formData)
  }
  store.editComponent(element)
  if (parent) refreshFolderOpener()
}

const editBookmark = async (formData: Bookmark, parent?: Bookmark) => {
  const element = JSON.parse(JSON.stringify(props.element))
  const bookmark = props.isAction
    ? element.componentSetting.actionClickValue.componentSetting.bookmark
    : element.componentSetting.bookmark
  if (parent) {
    const parentIndex = bookmark.findIndex((item: Bookmark) => item.id === parent.id)
    if (!~parentIndex) return
    const childrenIndex = bookmark[parentIndex].children.findIndex(
      (item: Bookmark) => item.id === formData.id
    )
    if (~childrenIndex) bookmark[parentIndex].children[childrenIndex] = formData
  } else {
    const index = bookmark.findIndex((item: Bookmark) => item.id === formData.id)
    if (~index) bookmark[index] = formData
  }
  store.editComponent(element)
  if (parent) refreshFolderOpener()
}

const importBookmark = (bookmarkData: any[]) => {
  const data = bookmarkData.map((item) => {
    if (!item.children) {
      return {
        bgColor: 'rgba(241, 243, 244, 1)',
        children: [],
        iconPath: item.icon || 'rgba(48,50,56,1)',
        iconType: item.icon ? 'network' : 'text',
        id: uid(),
        title: item.title,
        type: 'icon',
        url: item.href
      }
    } else {
      item.children = item.children.map((item1: any) => {
        return {
          bgColor: 'rgba(241, 243, 244, 1)',
          iconPath: item1.icon || 'rgba(48,50,56,1)',
          iconType: item1.icon ? 'network' : 'text',
          id: uid(),
          title: item1.title,
          type: 'icon',
          url: item1.href
        }
      })
      return {
        bgColor: 'rgba(241, 243, 244, 1)',
        children: item.children,
        iconPath: '',
        iconType: 'api',
        id: uid(),
        title: item.title,
        type: 'folder',
        url: ''
      }
    }
  })
  const element = JSON.parse(JSON.stringify(props.element))
  const bookmark = props.isAction
    ? element.componentSetting.actionClickValue.componentSetting.bookmark
    : element.componentSetting.bookmark
  bookmark.push(...data)
  store.editComponent(element)
}

const jump = (element: Bookmark, $event?: any) => {
  if (!isInBatch.value) {
    if (element.type === 'icon') {
      let target = element.url as string
      if (!/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(target)) {
        target = 'https://' + target
      }
      if (props.componentSetting.jumpType === 3) {
        iframeOpener.value.open(target, $event.currentTarget)
      } else if (props.componentSetting.jumpType === 2) {
        window.location.href = target
      } else {
        window.open(target)
      }
    } else if (element.type === 'folder') {
      popover.value.defaultOpen(
        {
          w: Math.min(720, window.innerWidth * 0.9),
          h: Math.min(400, window.innerHeight * 0.75),
          direction: 0
        },
        $event.currentTarget
      )
      folderOpener.value = element
    }
  } else {
    const index = selectedIds.value.findIndex((item) => item === element.id)
    if (~index) {
      selected.value.splice(index, 1)
      selectedIds.value.splice(index, 1)
    } else {
      selected.value.push(element)
      selectedIds.value.push(element.id)
    }
  }
}

const moveDialog = ref()
const folderList = computed(() => list.value.filter((item: Bookmark) => item.type === 'folder'))
const handleMove = async (params: Bookmark[], isDelete = false, parent?: Bookmark | null) => {
  if (!params || params.length === 0) return
  try {
    const element = JSON.parse(JSON.stringify(props.element))
    const bookmark = props.isAction
      ? element.componentSetting.actionClickValue.componentSetting.bookmark
      : element.componentSetting.bookmark
    if (!isDelete) {
      const folder = await moveDialog.value.move(parent)
      if (folder === parent?.id) return
      if (params.filter((item) => item.type === 'folder').length) {
        ElNotification({ title: t('提示'), message: t('目前暂不支持移动文件夹') })
        params = params.filter((item) => item.type !== 'folder')
      }
      if (folder === '$root') {
        // 根目录
        params.map((item) => {
          if (!~bookmark.findIndex((item1: Bookmark) => item1.id === item.id)) {
            bookmark.push(item)
          }
        })
      } else {
        const index = bookmark.findIndex((item: Bookmark) => item.id === folder)
        // 移动
        if (~index) {
          params.map((item) => {
            if (!~bookmark[index].children.findIndex((item1: Bookmark) => item1.id === item.id)) {
              bookmark[index].children.push(item)
            }
          })
        }
      }
    } else {
      if (!confirm(t('确认要删除所选项?'))) return
    }
    // 删除源
    if (parent) {
      const parentIndex = bookmark.findIndex((item: Bookmark) => item.id === parent.id)
      params.map((item) => {
        const index = bookmark[parentIndex].children.findIndex(
          (item1: Bookmark) => item1.id === item.id
        )
        if (~index) bookmark[parentIndex].children.splice(index, 1)
      })
    } else {
      params.map((item) => {
        const index = bookmark.findIndex((item1: Bookmark) => item1.id === item.id)
        if (~index) bookmark.splice(index, 1)
      })
    }
    if (props.isAction) store.updateActionElement(element)
    store.editComponent(element)
    if (parent) refreshFolderOpener()
    if (isInBatch.value) {
      isInBatch.value = false
      selected.value = []
      selectedIds.value = []
    }
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
  const bookmark = props.isAction
    ? element.componentSetting.actionClickValue.componentSetting.bookmark
    : element.componentSetting.bookmark
  const index = list.value.findIndex((item: Bookmark) => item.id === folderOpener.value?.id)
  bookmark[index].children = folderOpener.value?.children
  store.editComponent(element)
}
const popoverClosed = () => {
  folderOpener.value = null
}

const isInBatch = ref(false)
const batchParent = ref<Bookmark>()
const selected = ref<Bookmark[]>([])
const selectedIds = ref<string[]>([])
const setBatch = (parent?: Bookmark) => {
  isInBatch.value = true
  batchParent.value = parent
}
const closeBatch = () => {
  isInBatch.value = false
  selected.value.length = 0
  selectedIds.value.length = 0
}
const preventMouseMenu = (e: MouseEvent) => {
  if (isInBatch.value) {
    closeBatch()
    e.preventDefault()
    document.oncontextmenu = (e: MouseEvent) => e.preventDefault()
  }
}
onMounted(() => document.addEventListener('contextmenu', preventMouseMenu))
onUnmounted(() => document.removeEventListener('contextmenu', preventMouseMenu))
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
  align-content: baseline;
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
    .selected-icon {
      position: absolute;
      width: 90%;
      height: 90%;
      left: 5%;
      top: 5%;
      background: rgba(24, 24, 24, 0.85);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
    }
    &:hover {
      background: rgba(0,0,0,0.1);
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
      overflow: hidden;
      img {
        width: v-bind('iconSize');
        height: v-bind('iconSize');
      }
      .no-icon {
        font-weight: bold;
        padding-bottom: 1px;
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
  background: rgba(#242428, 0.9);
  width: 100%;
  height: 100%;
  padding: 10px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
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
    height: 100%;
    flex: 1;
    overflow-y: auto;
  }
}

.batch-operation-wrapper {
  position: absolute;
  bottom: 20px;
  width: 480px;
  left: calc(50% - 240px);
  background: rgba(#292942, 0.95);
  height: 44px;
  border-radius: 22px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  color: #b8b6b6;
  .close-btn {
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      color: #f5f5f7;
    }
  }
  .selected-count {
    display: flex;
    align-items: center;
    margin-left: 10px;
    flex: 1;
    line-height: 20px;
    .num {
      display: block;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      font-weight: bold;
      color: rgb(226, 226, 226);
      border-radius: 10px;
      padding: 0 10px;
      margin: 0 6px;
      background: rgb(83, 77, 94);
    }
  }
  .operation-btn-wrapper {
    display: flex;
    align-items: center;
    .move-btn,
    .del-btn {
      padding: 0 12px;
      height: 28px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      cursor: pointer;
      color: rgb(226, 226, 226);
      font-size: 14px;
      svg {
        margin-right: 2px;
      }
    }
    .move-btn {
      background: rgb(83, 77, 94);
      margin-right: 8px;
      &:hover {
        background: rgb(101, 96, 110);
      }
    }
    .del-btn {
      background: rgb(224, 93, 93);
      &:hover {
        background: rgb(206, 101, 101);
      }
    }
  }
}
@keyframes tada {
  from {
    transform: rotate3d(0, 0, 1, -3deg);
  }
  25% {
    transform: rotate3d(0, 0, 1, 0);
  }
  50% {
    transform: rotate3d(0, 0, 1, 3deg);
  }
  75% {
    transform: rotate3d(0, 0, 1, 0);
  }
  to {
    transform: rotate3d(0, 0, 1, -3deg);
  }
}
.bounce-icon {
  animation-name: tada;
  animation-duration: 0.25s;
  animation-iteration-count: infinite;
}
</style>
