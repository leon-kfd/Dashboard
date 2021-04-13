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
    animation-in="flipInY">
    <StandardForm
      :formData="state.formData"
      :formConf="state.formConf"
      ref="form"
      label-width="100px"></StandardForm>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button class="btn" @click="close">取消</button>
        <button class="btn btn-primary" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRaw } from 'vue'
import { useStore } from 'vuex'
import AnimationDialog from '@howdyjs/animation-dialog'
import StandardForm from '@/plugins/standard-form'
import { MATERIAL_LIST_MAP } from '@/constanst'
import Setting from '@/materials/setting'
import { clone } from '@/utils'
export default defineComponent({
  name: 'ComponentDialog',
  components: {
    AnimationDialog,
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

    // flag to let standard-form force update.
    const flag = ref(false)

    let componentOptions: ComponentOptions

    const open = async (params: ComponentOptions) => {
      componentOptions = params
      const material = MATERIAL_LIST_MAP[params.material as keyof typeof MATERIAL_LIST_MAP].label
      state.formData = params.componentSetting ? JSON.parse(JSON.stringify(params.componentSetting)) : JSON.parse(JSON.stringify(Setting[material].formData))
      state.formConf = clone(typeof Setting[material].formConf === 'function' ? (Setting[material].formConf as any)(state.formData) : Setting[material].formConf)
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
          store.commit('editComponent', result)
          close()
        } else {
          return false;
        }
      });
    }
    return {
      dialog,
      open,
      close,
      state,
      flag,
      submit,
      form
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
<style scoped>
.component-dialog .dialog-body{
  padding: 0 20px !important;
}
</style>
