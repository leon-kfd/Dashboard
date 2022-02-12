<template>
  <animation-dialog
    ref="dialog"
    animationMode
    title="全局配置"
    width="min(440px, 98vw)"
    height="min(520px, 90vh)"
    appendToBody
    :closeOnClickOutside="false"
    :listenWindowSizeChange="true"
    v-bind="dialogOptions"
    @beforeClose="close">
    <WarnLock />
    <el-form ref="form" label-position="top">
      <el-form-item label="壁纸">
        <BackgroundSelector v-model:background="state.formData.background" isFullScreen recommendVideo />
        <BackgroundFilterSelector v-if="state.formData.background.includes('url')" v-model:filter="state.formData.backgroundFilter" />
      </el-form-item>
      <el-form-item label="杂项">
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
          <div class="label">全局字体</div>
          <div class="content flex-center-y">
            <FontSelector v-model="state.formData.globalFontFamily" show-refresh style="width: 100%" />
          </div>
        </div>
        <div class="form-row-control">
          <div class="label">网站标题</div>
          <div class="content flex-center-y">
            <el-input v-model="state.formData.siteTitle" placeholder="自定义网站的标题" clearable></el-input>
            <Tips content="自定义网站的标题，刷新页面仍生效" />
          </div>
        </div>
        <div class="form-row-control">
          <div class="label">禁用弹窗动画</div>
          <div class="content flex-center-y">
            <el-switch v-model="state.formData.disabledDialogAnimation" style="width: 150px"></el-switch>
            <Tips content="在一些低性能的机器上可禁用弹窗动画以优化性能" />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="全局CSS注入">
        <el-input
          v-model="state.formData.css"
          type="textarea"
          rows="4"
          placeholder="请输入合法的CSS代码，此处写入CSS代码会插入到网页中，以覆盖默认样式" />
      </el-form-item>
      <el-form-item label="全局JS注入">
        <el-input
          v-model="state.formData.js"
          type="textarea"
          rows="4"
          placeholder="如非必要，并不建议往网页注入JavaScript代码" />
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
import Tips from '@/components/Tools/Tips.vue'
import { useStore } from 'vuex'
import useDialogOption from '@/hooks/useDialogOption'
export default defineComponent({
  name: 'GlobalConfig',
  components: {
    BackgroundSelector,
    BackgroundFilterSelector,
    WarnLock,
    Tips,
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
      store.dispatch('updateGlobal', state.formData)
      document.title = state.formData.siteTitle || 'Howdz起始页'
      close()
    }

    watch(() => store.state.global.css, (val) => {
      const injectCSSEl = document.querySelector('#injectCSS')
      if (injectCSSEl) {
        injectCSSEl.innerHTML = val
      }
    }, {
      immediate: true
    })

    watch(() => store.state.global.js, (val) => {
      const injectJSEl = document.querySelector('#injectJS')
      if (injectJSEl) {
        injectJSEl.innerHTML = val
      }
    }, {
      immediate: true
    })

    const dialogOptions = useDialogOption()

    return {
      dialog,
      close,
      submit,
      state,
      dialogOptions
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
      bottom: 0;
      height: 8px;
      background: rgba($color-warning, .2);
    }
 }
}
.font-control {
  margin-left: 8px;
  font-weight: bold;
}
</style>
