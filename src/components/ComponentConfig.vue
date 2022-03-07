<template>
  <animation-dialog
    ref="dialog"
    animationMode
    title="组件配置"
    width="min(440px, 98vw)"
    height="min(520px, 90vh)"
    customClass="component-dialog"
    :closeOnClickOutside="false"
    listenWindowSizeChange
    appendToBody
    v-bind="dialogOptions"
  >
    <StandardForm
      :formData="state.formData"
      :formConf="state.formConf"
      ref="form"
      label-width="100px"
    ></StandardForm>
    <template #footer>
      <div class="footer" style="text-align: right; padding: 12px">
        <button type="button" class="btn" @click="close">取消</button>
        <button type="button" class="btn btn-primary" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue'
import { useStore } from '@/store'
import StandardForm from '@/plugins/standard-form'
import Setting from '@/materials/setting'
import { clone } from '@/utils'
import useDialogOption from '@/hooks/useDialogOption'
export default defineComponent({
  name: 'ComponentDialog',
  components: {
    StandardForm
  },
  setup() {
    const store = useStore()
    const dialog = ref()

    const state = reactive({
      formConf: {},
      formData: {}
    })

    const form = ref()

    let componentOptions: ComponentOptions

    const open = async (params: ComponentOptions) => {
      componentOptions = params
      const material = params.material
      state.formData = params.componentSetting
        ? JSON.parse(JSON.stringify(params.componentSetting))
        : JSON.parse(JSON.stringify(Setting[material].formData))
      state.formConf = clone(
        typeof Setting[material].formConf === 'function'
          ? (Setting[material].formConf as any)(state.formData)
          : Setting[material].formConf
      )
      dialog.value.open()
    }

    const close = () => {
      dialog.value.close()
    }
    const submit = () => {
      form.value.validate((valid: boolean) => {
        if (valid) {
          const result = {
            ...componentOptions,
            componentSetting: toRaw(state.formData)
          }
          store.editComponent(result)
          close()
        } else {
          return false
        }
      })
    }
    const dialogOptions = useDialogOption()

    return {
      dialog,
      open,
      close,
      state,
      submit,
      form,
      dialogOptions
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
<style scoped>
.component-dialog .dialog-body {
  padding: 0 20px !important;
}
</style>
