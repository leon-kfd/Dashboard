<template>
  <easy-dialog
    v-model="dialogVisible"
    :title="$t('全局设置')"
    width="min(480px, 98vw)"
    height="min(520px, 90vh)"
    customClass="global-config-dialog"
    @close="close"
  >
    <WarnLock />
    <el-form ref="form" label-position="top">
      <el-form-item :label="$t('壁纸')">
        <BackgroundSelector
          v-model:background="state.formData.background"
          isFullScreen
          recommendVideo
        />
        <BackgroundFilterSelector
          v-if="state.formData.background.includes('url')"
          v-model:filter="state.formData.backgroundFilter"
          isFullScreen
        />
      </el-form-item>
      <el-form-item :label="$t('杂项')">
        <div class="form-row-control">
          <div class="label">{{ $t('语言') }}</div>
          <div class="content">
            <el-select v-model="state.formData.lang">
              <el-option
                v-for="lang in langList"
                :label="lang.label"
                :value="lang.value"
                :key="lang.value"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="form-row-control">
          <div class="label">{{ $t('组件间隔') }}</div>
          <div class="content flex-center-y">
            <el-input-number
              v-model="state.formData.gutter"
              controls-position="right"
              :min="0"
              :max="50"
              style="width: 100px"
            >
            </el-input-number>
            <span class="font-control">px</span>
          </div>
        </div>
        <div class="form-row-control">
          <div class="label">{{ $t('全局字体') }}</div>
          <div class="content">
            <div>
              <div class="flex-center-y">
                <FontSelector
                  v-model="state.formData.globalFontFamily"
                  show-refresh
                  :show-harmony-font="state.formData.loadHarmonyOSFont"
                  style="width: 100%"
                />
              </div>
              <div class="flex-center-y" style="width: 242px;justify-content: space-between;margin: 4px 0 8px">
                <el-checkbox v-model="state.formData.loadHarmonyOSFont">
                  加载鸿蒙字体(外部)
                </el-checkbox>
                <Tips :content="$t('勾选此项会在页面进入后加载鸿蒙字体,然后可以在字体选择器中选择或输入HarmonyOS_Regular,初次设置需刷新页面')" />
              </div>
            </div>
          </div>
        </div>
        <div class="form-row-control">
          <div class="label">{{ $t('网站标题') }}</div>
          <div class="content flex-center-y">
            <el-input
              v-model="state.formData.siteTitle"
              :placeholder="$t('自定义网站的标题')"
              clearable
            ></el-input>
            <Tips :content="$t('siteTitleTips')" />
          </div>
        </div>
        <div class="form-row-control">
          <div class="label ellipsis" :title="$t('禁用动画')">{{ $t('禁用动画') }}</div>
          <div class="content flex-center-y">
            <el-switch v-model="state.formData.disabledDialogAnimation" style="width: 214px" />
            <Tips :content="$t('disabledDialogAnimationTips')" />
          </div>
        </div>
        <div class="form-row-control">
          <div class="label ellipsis" :title="$t('菜单按钮')">{{ $t('菜单按钮') }}</div>
          <div class="content flex-center-y">
            <el-switch v-model="state.formData.showMenuBtn" style="width: 214px" />
            <Tips :content="$t('showMenuBtnTips')" />
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('全局CSS注入')">
        <el-input
          v-model="state.formData.css"
          type="textarea"
          rows="8"
          :placeholder="$t('injectCSSPlaceholder')"
        />
      </el-form-item>
      <el-form-item :label="$t('全局JS注入')">
        <el-input
          v-model="state.formData.js"
          type="textarea"
          rows="4"
          :placeholder="$t('injectJSPlaceholder')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer" style="text-align: right; padding: 12px">
        <button type="button" class="btn" @click="close">{{ $t('取消') }}</button>
        <button type="button" class="btn btn-primary" @click="submit">{{ $t('确认') }}</button>
      </div>
    </template>
  </easy-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch, reactive, defineAsyncComponent } from 'vue'
import BackgroundSelector from '@/components/FormControl/BackgroundSelector.vue'
import BackgroundFilterSelector from '@/components/FormControl/BackgroundFilterSelector.vue'
import WarnLock from '@/components/FormControl/WarnLock.vue'
import Tips from '@/components/Tools/Tips.vue'
import { useStore } from '@/store'
import { langList } from '@/lang'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'GlobalConfig',
  components: {
    BackgroundSelector,
    BackgroundFilterSelector,
    WarnLock,
    Tips,
    FontSelector: defineAsyncComponent(() => import('@/components/FormControl/FontSelector.vue'))
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const store = useStore()

    const { locale } = useI18n()

    const state = reactive({
      formData: {
        ...store.global
      }
    })

    const dialogVisible = ref(false)

    watch(
      () => props.visible,
      (val) => {
        if (val) {
          dialogVisible.value = true
          state.formData = {
            ...store.global
          }
        } else {
          dialogVisible.value = false
        }
      }
    )
    const close = () => {
      dialogVisible.value = false
      emit('update:visible', false)
    }

    const submit = () => {
      store.updateGlobal(state.formData)
      document.title = state.formData.siteTitle || 'Howdz 起始页'
      close()
    }

    watch(
      () => store.global.css,
      (val) => {
        const injectCSSEl = document.querySelector('#injectCSS')
        if (injectCSSEl) {
          injectCSSEl.innerHTML = val || ''
        }
      },
      {
        immediate: true
      }
    )

    watch(
      () => store.global.js,
      (val) => {
        const injectJSEl = document.querySelector('#injectJS')
        if (injectJSEl) {
          injectJSEl.innerHTML = val || ''
        }
      },
      {
        immediate: true
      }
    )

    watch(
      () => store.global.lang,
      (val) => {
        if (val) locale.value = val
      },
      {
        immediate: true
      }
    )

    watch(
      () => store.global.globalFontFamily,
      (val) => {
        document.body.style.fontFamily = val === 'HarmonyOS_Regular' ? 'HarmonyOS_Regular' : 'Helvetica Neue, Microsoft YaHei, Arial, sans-serif'
      },
      {
        immediate: true
      }
    )

    return {
      close,
      submit,
      state,
      langList,
      dialogVisible
    }
  }
})
</script>
<style lang="scss" scoped>
:deep(.el-form-item__label) {
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
    background: rgba($color-warning, 0.2);
  }
}
.font-control {
  margin-left: 8px;
  font-weight: bold;
}
</style>

<style lang="scss">
.global-config-dialog .easy-dialog-body {
  padding: 5px 20px !important;
}
</style>
