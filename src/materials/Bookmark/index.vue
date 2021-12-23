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
            @click="jump(element)">
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
          <div class="item" @click="handleAddNewBookmark">
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
    <animation-dialog
      ref="folderDialog"
      customWrapperClass="backdrop-blur"
      animationMode
      title="选择文件夹"
      width="min(280px, 90vw)"
      height="min(320px, 60vh)"
      :closeOnClickOutside="false"
      :listenWindowSizeChange="true"
      appendToBody
      animation-in="flipInY"
    >
      <el-radio-group v-model="moveFolderTarget">
        <el-radio label="$root">
          <div class="folder-wrapper">
            <svg viewBox="0 0 1124 1024" width="20" height="20">
              <path d="M948.079775 106.337352H460.223099S394.153465 1.788394 355.688563 1.788394H181.435493a69.68969 69.68969 0 0 0-69.68969 69.704113v801.474704a69.718535 69.718535 0 0 0 69.68969 69.68969h766.629859a69.718535 69.718535 0 0 0 69.68969-69.68969V176.027042a69.718535 69.718535 0 0 0-69.68969-69.68969z" fill="#D0994B"></path>
              <path d="M111.745803 210.871887h906.023662v278.787606H111.745803z" fill="#E4E7E7"></path>
              <path d="M76.900958 280.561577h975.713352a69.68969 69.68969 0 0 1 69.704113 69.704113L1052.628732 942.656901a69.718535 69.718535 0 0 1-69.704112 69.689691H146.60507a69.718535 69.718535 0 0 1-69.704112-69.689691L7.211268 350.26569a69.68969 69.68969 0 0 1 69.68969-69.704113z" fill="#F4B459"></path>
            </svg>
            <div class="folder-name">__ROOT__</div>
          </div>
        </el-radio>
        <el-radio v-for="item in folderList" :label="item.id" :key="item.id">
          <div class="folder-wrapper">
            <svg viewBox="0 0 1124 1024" width="20" height="20">
              <path d="M948.079775 106.337352H460.223099S394.153465 1.788394 355.688563 1.788394H181.435493a69.68969 69.68969 0 0 0-69.68969 69.704113v801.474704a69.718535 69.718535 0 0 0 69.68969 69.68969h766.629859a69.718535 69.718535 0 0 0 69.68969-69.68969V176.027042a69.718535 69.718535 0 0 0-69.68969-69.68969z" fill="#D0994B"></path>
              <path d="M111.745803 210.871887h906.023662v278.787606H111.745803z" fill="#E4E7E7"></path>
              <path d="M76.900958 280.561577h975.713352a69.68969 69.68969 0 0 1 69.704113 69.704113L1052.628732 942.656901a69.718535 69.718535 0 0 1-69.704112 69.689691H146.60507a69.718535 69.718535 0 0 1-69.704112-69.689691L7.211268 350.26569a69.68969 69.68969 0 0 1 69.68969-69.704113z" fill="#F4B459"></path>
            </svg>
            <div class="folder-name">{{item.title}}</div>
          </div>
        </el-radio>
      </el-radio-group>
      <template #footer>
        <div class="footer" style="text-align: right;padding: 12px;">
          <button type="button" class="btn" @click="closeMove">取消</button>
          <button type="button" class="btn btn-primary" @click="submitMove">确认</button>
        </div>
      </template>
    </animation-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import Draggable from 'vuedraggable'
import { useStore } from 'vuex'
import ConfigDialog from './ConfigDialog.vue'
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
      handleEdit(params.element)
    },
    icon: 'el-icon-setting'
  },
  {
    label: '移动',
    fn: (params: any) => {
      handleMove([params.element])
    },
    hidden: (params: any) => params.element.type === 'folder',
    icon: 'el-icon-position'
  },
  {
    label: '删除',
    fn: (params: any) => {
      handleDelete(params.iundex)
    },
    icon: 'el-icon-edit-outline',
    customClass: 'delete'
  },
])

const handleDelete = (index: number) => {
  if (confirm('确定要删除所选项?')) {
    const element = JSON.parse(JSON.stringify(props.element))
    if (props.isAction) {
      element.componentSetting.actionClickValue.componentSetting.bookmark.splice(index, 1)
      store.dispatch('updateActionElement', element)
    } else {
      element.componentSetting.bookmark.splice(index, 1)
    }
    store.dispatch('editComponent', element)
  }
}

const handleEdit = (params: Bookmark) => configDialog.value.open(params)
const handleAddNewBookmark = () => configDialog.value.open()
const handleMove = (params: Bookmark[]) => {
  moveFolderSource.value = params
  folderDialog.value.open()
}

const addBookmark = (formData: Bookmark) => {
  const element = JSON.parse(JSON.stringify(props.element))
  if (props.isAction) {
    element.componentSetting.actionClickValue.componentSetting.bookmark.push(formData)
    store.dispatch('updateActionElement', element)
  } else {
    element.componentSetting.bookmark.push(formData)
  }
  store.dispatch('editComponent', element)
}

const editBookmark = (formData: Bookmark) => {
  const element = JSON.parse(JSON.stringify(props.element))
  if (props.isAction) {
    const index = element.componentSetting.actionClickValue.componentSetting.bookmark.findIndex((item: Bookmark) => item.id === formData.id)
    if (~index) {
      element.componentSetting.actionClickValue.componentSetting.bookmark[index] = formData
      store.dispatch('updateActionElement', element)
    }
  } else {
    const index = element.componentSetting.bookmark.findIndex((item: Bookmark) => item.id === formData.id)
    if (~index) {
      element.componentSetting.bookmark[index] = formData
    }
  }
  store.dispatch('editComponent', element)
}

const jump = (element: Bookmark) => {
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
  }
}

const folderDialog = ref()
const moveFolderTarget = ref('$root')
const moveFolderSource = ref<Bookmark[]>([])
const folderList = computed(() => list.value.filter((item:Bookmark) => item.type === 'folder'))
const closeMove = () => {
  folderDialog.value.close()
}
const submitMove = () => {
  if (moveFolderTarget.value === '$root') {
    // 根目录
  } else {
    const element = JSON.parse(JSON.stringify(props.element))
    const bookmark = props.isAction ? element.componentSetting.actionClickValue.componentSetting.bookmark : element.componentSetting.bookmark
    const index = bookmark.findIndex((item: Bookmark) => item.id === moveFolderTarget.value)
    if (~index) {
      bookmark[index].children.push(...JSON.parse(JSON.stringify(moveFolderSource.value)))
    }
    moveFolderSource.value.map(item => {
      const index = bookmark.findIndex((item1:Bookmark) => item1.id === item.id)
      if (~index) {
        bookmark.splice(index, 1)
      }
    })
    if (props.isAction) store.dispatch('updateActionElement', element)
    store.dispatch('editComponent', element)
    closeMove()
  }
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
  }
}
.folder-wrapper {
  display: flex;
  align-items: center;
  width: 170px;
  flex-wrap: nowrap;
  overflow: hidden;
  .folder-name {
    color: #687275;
    margin-left: 5px;
    width: 100%;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    height: 20px;
    line-height: 20px;
  }
}
</style>
