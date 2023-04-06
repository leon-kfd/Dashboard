<template>
  <easy-dialog
    v-model="dialogVisible"
    :title="dialogTitle || $t('提示')"
    width="300px"
    :height="`${dialogHeight || 200}px`"
    @close="close"
  >
    <p class="warn-text">{{ message }}</p>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button type="button" class="btn" @click="closeDialog">{{$t('取消')}}</button>
        <button type="button" class="btn btn-primary" @click="submit">{{$t('确认')}}</button>
      </div>
    </template>
  </easy-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'

let _resolve:(value?: unknown) => void
let _reject:(value?: unknown) => void

const dialogVisible = ref(false)
const message = ref('')

const dialogTitle = ref('')
const dialogHeight = ref(200)

const confirm = async (_message: string, options: { title?: string, height?: number }) => {
  message.value = _message
  dialogVisible.value = true
  if (options?.title) dialogTitle.value = options.title
  if (options?.height) dialogHeight.value = options.height
  return new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
}

const closeDialog = () => {
  dialogVisible.value = false
}

const close = () => {
  _reject()
}

const submit = () => {
  _resolve()
  closeDialog()
}

defineExpose({
  confirm
})
</script>
