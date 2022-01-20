<template>
  <animation-dialog
    ref="dialog"
    animationMode
    title="选择文件夹"
    width="min(280px, 90vw)"
    height="min(320px, 60vh)"
    :closeOnClickOutside="false"
    :listenWindowSizeChange="true"
    appendToBody
    @close="close"
    v-bind="dialogOptions"
    customWrapperClass="bookmark-move-dialog"
  >
    <el-radio-group v-model="moveFolderTarget">
      <el-radio label="$root" v-if="showRoot">
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
        <button type="button" class="btn" @click="closeDialog">取消</button>
        <button type="button" class="btn btn-primary" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts" setup>
import { ref, PropType } from 'vue'
import useDialogOption from '@/hooks/useDialogOption'
defineProps({
  folderList: {
    type: Array as PropType<Bookmark[]>,
    default: () => ([])
  }
})
const dialog = ref()

const showRoot = ref(false)

let _resolve:(value?: unknown) => void
let _reject:(value?: unknown) => void
const move = (parent?: Bookmark) => {
  dialog.value.open()
  showRoot.value = !!parent
  return new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
}

const moveFolderTarget = ref('$root')
const closeDialog = () => {
  dialog.value.close()
}

const close = () => {
  _reject()
}
const submit = () => {
  if (!moveFolderTarget.value) return
  _resolve(moveFolderTarget.value)
  closeDialog()
}
defineExpose({ move })
const dialogOptions = useDialogOption()
</script>

<style lang="scss" scoped>
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
