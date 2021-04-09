<template>
  <animation-dialog
    ref="dialog"
    :animationMode="true"
    title="全局配置"
    width="min(440px, 98vw)"
    height="min(520px, 90vh)"
    customClass="global-config-dialog"
    :closeOnClickOutside="false"
    :listenWindowSizeChange="true"
    animation-in="flipInY"
    @beforeClose="close">
    <WarnLock />
    <el-form ref="form" label-position="top">
      <el-form-item label="壁纸">
        <BackgroundSelector v-model:background="state.formData.background" :isFullScreen="true" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button class="btn" @click="close">取消</button>
        <button class="btn btn-primary" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive } from 'vue'
import AnimationDialog from '@howdyjs/animation-dialog'
import BackgroundSelector from './BackgroundSelector.vue'
import WarnLock from '@/components/WarnLock.vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'GlobalConfig',
  components: {
    AnimationDialog,
    BackgroundSelector,
    WarnLock
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const dialog = ref()
    const store = useStore()

    const state = reactive({
      formData: {}
    })

    watch(() => props.visible, (val) => {
      if (val) {
        dialog.value.open()
        state.formData = {
          ...store.state.global
        }
      } else {
        dialog.value.close()
      }
    })
    const close = () => {
      emit('update:visible', false)
    }

    const submit = () => {
      store.commit('updateGlobal', state.formData)
      close()
    }
    return {
      dialog,
      close,
      submit,
      state
    }
  }
})
</script>
<style lang="scss" scoped>
:deep {
 .el-form-item__label {
    color: rgb(43, 43, 43);
    font-weight: bold;
    line-height: 1 !important;
    font-size: 14px;
 }
}
</style>
<style>
.global-config-dialog .dialog-body{
  padding: 5px 20px !important;
}
</style>
