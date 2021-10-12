<template>
  <animation-dialog
    ref="dialog"
    customWrapperClass="backdrop-blur"
    animationMode
    title="全局配置"
    width="min(440px, 98vw)"
    height="min(520px, 90vh)"
    appendToBody
    :closeOnClickOutside="false"
    :listenWindowSizeChange="true"
    animation-in="flipInY"
    @beforeClose="close">
    <WarnLock />
    <el-form ref="form" label-position="top">
      <el-form-item label="壁纸">
        <BackgroundSelector v-model:background="state.formData.background" isFullScreen recommendVideo />
        <BackgroundFilterSelector v-if="state.formData.background.includes('url')" v-model:filter="state.formData.backgroundFilter" />
      </el-form-item>
      <el-form-item label="全局CSS注入">
        <el-input
          v-model="css"
          type="textarea"
          rows="4"
          @change="handleChange"
          placeholder="请输入合法的CSS代码，此处写入CSS代码会插入到网页中，以覆盖默认样式"></el-input>
      </el-form-item>
      <el-form-item label="其他">
        <div class="form-row-control">
          <div class="label">组件间隔</div>
          <div class="content flex-center-y">
            <el-input-number
              v-model="state.formData.gutter"
              controls-position="right"
              :min="0"
              :max="50"
              style="width: 100px">
            </el-input-number>
            <span class="font-control">px</span>
          </div>
        </div>
        <div class="form-row-control">
          <div class="label">全局字体库</div>
          <div class="content">
            <FontSelector v-model="state.formData.globalFontFamily" show-refresh />
          </div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button type="button" class="btn" @click="close">取消</button>
        <button type="button" class="btn btn-primary" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive, defineAsyncComponent } from 'vue'
import BackgroundSelector from '@/components/FormControl/BackgroundSelector.vue'
import BackgroundFilterSelector from '@/components/FormControl/BackgroundFilterSelector.vue'
import WarnLock from '@/components/FormControl/WarnLock.vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'GlobalConfig',
  components: {
    BackgroundSelector,
    BackgroundFilterSelector,
    WarnLock,
    FontSelector: defineAsyncComponent(() => import('@/components/FormControl/FontSelector.vue')),
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
      formData: {
        ...store.state.global
      }
    })

    const css = ref('')

    watch(() => props.visible, (val) => {
      if (val) {
        dialog.value.open()
        state.formData = {
          ...store.state.global
        }
        css.value = state.formData.css
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

    const handleChange = (val: string) => {
      state.formData.css = val
    }
    watch(() => state.formData.css, (val) => {
      const injectCSSEl = document.querySelector('#injectCSS')
      if (injectCSSEl) {
        injectCSSEl.innerHTML = val
      }
    }, {
      immediate: true
    })

    return {
      dialog,
      close,
      submit,
      state,
      css,
      handleChange
    }
  }
})
</script>
<style lang="scss" scoped>
:deep {
 .el-form-item__label {
    display: inline-flex !important;
    color: rgb(43, 43, 43);
    font-weight: bold;
    line-height: 1 !important;
    font-size: 16px;
    position: relative;
    &:after {
      position: absolute;
      content: '';
      left: 0;
      width: 100%;
      bottom: 8px;
      height: 8px;
      background: rgba($--color-warning, .2);
    }
 }
}
.font-control {
  margin-left: 8px;
  font-weight: bold;
}
</style>
