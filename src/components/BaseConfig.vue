<template>
  <animation-dialog
    ref="dialog"
    animationMode
    :title="editId ? '编辑组件': '添加组件'"
    width="min(800px, 98vw)"
    height="min(600px, 90vh)"
    appendToBody
    :closeOnClickOutside="false"
    listenWindowSizeChange
    customClass="base-config-dialog"
    v-bind="dialogOptions">
    <div class="main-config">
      <div class="base-config-wrapper">
        <div class="config-title">基础配置</div>
        <WarnLock />
        <div class="form-wrapper scrollbar1">
          <el-form ref="form" label-position="top" :model="state.formData">
            <el-form-item label="物料组件">
              <MaterialSelector v-model="state.formData.material" :disabled="!!editId" @change="updateComponentSetting(false)"/>
            </el-form-item>
            <el-form-item label="定位模式">
              <el-radio-group v-model="state.formData.position" :disabled="!!editId" style="margin-right: 8px;">
                <el-radio :label="1">栅格模式</el-radio>
                <el-radio :label="2">Fixed模式</el-radio>
              </el-radio-group>
              <Tips>
                <div style="line-height:1.5">
                  <p>栅格模式采用布局栅格化，组件大小响应式，编辑时可更改位置与大小</p>
                  <p>Fixed模式使用会让组件固定在屏幕相应位置，编辑时可更改位置</p>
                </div>
              </Tips>
            </el-form-item>
            <el-form-item label="Fixed方向" v-if="state.formData.position === 2">
              <div class="flex-center-y">
                <PositionSelector v-model="state.formData.affixInfo.mode" :mode="2" :showChineseText="false" @change="handleResetAffix"/>
                <div>
                  <div class="flex-center-y">
                    <div class="bold" style="width:68px;text-align: right;margin: 8px 4px 0">{{affixY}}</div>
                    <el-input-number v-model="state.formData.affixInfo.y" controls-position="right" style="width: 100px" />
                  </div>
                  <div class="flex-center-y">
                    <div class="bold" style="width:68px;text-align: right;margin: 0 4px;">{{affixX}}</div>
                    <el-input-number v-model="state.formData.affixInfo.x" controls-position="right" style="width: 100px" />
                  </div>
                </div>
                <Tips>
                  <div style="line-height:1.5">
                    <p>Fixed定位方向属性，例如想固定到右下角请选右下</p>
                    <p>在编辑模式下直接拖拽组件也可更改偏移参数。</p>
                  </div>
                </Tips>
              </div>
            </el-form-item>
            <el-form-item label="组件尺寸">
              <div class="form-row-control">
                <div class="label">Width</div>
                <div class="content">
                  <el-input-number
                    v-model="state.formData.w"
                    controls-position="right"
                    :min="state.formData.position === 1 ? 1: 40"
                    :max="state.formData.position === 1 ? 12: 1920"
                    style="width:100px" />
                  <span class="unit">{{state.formData.position === 1 ? 'FR' : 'PX'}}</span>
                  <Tips>
                    <div style="line-height:1.5">
                      <p>PX为固定宽高模式</p>
                      <p>FR为响应式设计风格, 单位为屏幕栅格数, 屏幕满屏宽为12份</p>
                      <p>在编辑模式下拖拽组件右下角箭头也可更改Size</p>
                    </div>
                  </Tips>
                </div>
              </div>
              <div class="form-row-control">
                <div class="label">Height</div>
                <div class="content">
                  <el-input-number
                    v-model="state.formData.h"
                    controls-position="right"
                    :min="state.formData.position === 1 ? 1: 40"
                    :max="state.formData.position === 1 ? 24: 1920"
                    style="width:100px" />
                  <span class="unit">{{state.formData.position === 1 ? 'FR' : 'PX'}}</span>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="背景">
              <BackgroundSelector
                v-model:background="state.formData.background"
                :w="state.formData.w"
                :h="state.formData.h"
                :positionMode="state.formData.position" />
              <BackgroundFilterSelector v-if="state.formData.background.includes('url')" v-model:filter="state.formData.backgroundFilter" />
            </el-form-item>
            <el-form-item label="其他配置">
              <div class="form-row-control">
                <div class="label">圆角</div>
                <div class="content">
                  <el-input-number
                    v-model="state.formData.borderRadius"
                    controls-position="right"
                    :min="0"
                    :max="100"
                    style="width: 100px" />
                  <span class="font-control">px</span>
                </div>
              </div>
              <div class="form-row-control">
                <div class="label">阴影</div>
                <div class="content">
                  <el-input
                    style="width: 100%"
                    v-model="state.formData.boxShadow"
                    clearable
                    placeholder="合法box-shadow, e.g(0 4px #89909c)" />
                </div>
                <Tips content="基于CSS3的box-shadow属性，应输入合法的CSS盒子阴影代码片段" />
              </div>
              <div class="form-row-control">
                <div class="label">zIndex</div>
                <div class="content">
                  <el-input-number
                    v-model="state.formData.zIndex"
                    controls-position="right"
                    :min="0"
                    :max="9999"
                    style="width: 100px" />
                </div>
                <Tips content="物料组件的层级Zindex, 若出现组件被阻挡可尝试更改此值" />
              </div>
              <div class="form-row-control">
                <div class="label">ID属性注入</div>
                <div class="content">
                  <el-input v-model="state.formData.customId" placeholder="组件自定义ID" clearable />
                </div>
                <Tips content="组件的自定义ID，一般用于注入CSS或JS代码操作" />
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="component-config-wrapper">
        <div class="config-title">组件配置<span class="material-text">#{{state.formData.material}}</span></div>
        <div class="form-wrapper scrollbar1" v-if="state.formData.componentSetting">
          <StandardForm
            :formData="state.formData.componentSetting"
            :formConf="state.componentFormConf"
            ref="form"
            label-width="100px"></StandardForm>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button class="btn" type="button" @click="close">取消</button>
        <button class="btn btn-primary" type="button" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue'
import MaterialSelector from '@/components/FormControl/MaterialSelector.vue'
import BackgroundSelector from '@/components/FormControl/BackgroundSelector.vue'
import BackgroundFilterSelector from '@/components/FormControl/BackgroundFilterSelector.vue'
import WarnLock from '@/components/FormControl/WarnLock.vue'
import PositionSelector from '@/plugins/position-selector'
import Tips from '@/components/Tools/Tips.vue'
import { useStore } from 'vuex'
import { ElNotification } from 'element-plus';
import { uid, clone } from '@/utils'
import useDialogOption from '@/hooks/useDialogOption'
import StandardForm from '@/plugins/standard-form'
import Setting from '@/materials/setting'
const DEFAULT_SETTING: ComponentOptions = {
  position: 1,
  affixInfo: {
    mode: 1,
    x: 10,
    y: 10
  },
  w: 6,
  h: 2,
  background: 'transparent',
  backgroundFilter: 'brightness(0.8)',
  material: 'Empty',
  borderRadius: 4,
  boxShadow: '',
  zIndex: 10,
  customId: ''
}
export default defineComponent({
  name: 'BaseConfig',
  components: {
    MaterialSelector,
    BackgroundSelector,
    BackgroundFilterSelector,
    WarnLock,
    PositionSelector,
    Tips,
    StandardForm
  },
  setup() {
    const store = useStore()

    const form = ref()
    const state = reactive({
      formData: JSON.parse(JSON.stringify(DEFAULT_SETTING)),
      componentFormConf: {}
    })

    const editId = ref('')

    const dialog = ref()
    const open = (_editId: string) => {
      dialog.value.open()
      if (_editId) {
        const _getSetting = store.getters.getComponentSetting(_editId)
        state.formData = { ..._getSetting }
        editId.value = _editId
        updateComponentSetting(true)
      } else {
        editId.value = ''
        state.formData = {
          ...JSON.parse(JSON.stringify(DEFAULT_SETTING)),
          boxShadow: store.state.global.background.includes('url') ? '' : DEFAULT_SETTING.boxShadow
        }
        updateComponentSetting()
      }
    }
    const close = () => {
      dialog.value.close()
    }

    const updateComponentSetting = (justFormOnly = false) => {
      if (!justFormOnly) {
        state.formData.componentSetting = JSON.parse(JSON.stringify(Setting[state.formData.material].formData))
      }
      state.componentFormConf = clone(typeof Setting[state.formData.material].formConf === 'function' ? (Setting[state.formData.material].formConf as any)(state.formData.componentSetting) : Setting[state.formData.material].formConf)
    }

    const submit = () => {
      if (editId.value) {
        store.dispatch('editComponent', {
          ...state.formData,
          i: editId.value
        })
      } else {
        store.dispatch('addComponent', {
          ...state.formData,
          i: uid()
        })
      }
      close()
      state.formData = {
        ...JSON.parse(JSON.stringify(DEFAULT_SETTING)),
        boxShadow: store.state.global.background.includes('http') ? '' : DEFAULT_SETTING.boxShadow
      }
      updateComponentSetting()
      if (store.state.isLock) {
        store.dispatch('updateIsLock', false)
        ElNotification({
          title: '提示',
          message: '已自动进入编辑模式，编辑模式可进行组件拖拽与右键菜单配置'
        })
      }
    }

    watch(() => state.formData.position, (val) => {
      if (editId.value) return
      if (val === 1) {
        state.formData.w = 6
        state.formData.h = 2
      } else {
        state.formData.w = 200
        state.formData.h = 200
      }
    })

    const affixX = computed(() => [1, 3].includes(state.formData.affixInfo.mode) ? 'LEFT' : 'RIGHT')
    const affixY = computed(() => [1, 2].includes(state.formData.affixInfo.mode) ? 'TOP' : 'BOTTOM')
    const handleResetAffix = () => {
      state.formData.affixInfo.x = DEFAULT_SETTING.affixInfo?.x
      state.formData.affixInfo.y = DEFAULT_SETTING.affixInfo?.y
    }

    const dialogOptions = useDialogOption(true)

    return {
      dialog,
      form,
      state,
      submit,
      open,
      close,
      editId,
      affixX,
      affixY,
      handleResetAffix,
      dialogOptions,
      updateComponentSetting
    }
  }
})
</script>
<style lang="scss" scoped>
.main-config {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  .base-config-wrapper,
  .component-config-wrapper {
    width: 50%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    padding-left: 10px;
    padding-right: 4px;
    .config-title {
      font-size: 20px;
      font-weight: bold;
      color: #3c2554;
      margin-bottom: 10px;
    }
    .form-wrapper {
      height: 100%;
      flex: 1;
      overflow-y: auto;
      padding-top: 5px;
      padding-right: 8px;
    }
  }
  .base-config-wrapper {
    border-right: 2px solid #eee;
  }
}
.form-control {
  @include flex-center-y;
  .divider {
    margin: 0 8px
  }
}
.form-row-control {
  @include flex-center-y;
  margin-bottom: 8px;
  .label {
    width: 84px;
    text-align: right;
    color: rgb(43, 43, 43);
    font-weight: bold;
    font-size: 14px;
    margin-right: 8px;
  }
}
.tips {
  font-size: 18px;
  margin-left: 8px;
  cursor: pointer;
}
.font-control {
  font-size: 14px;
  font-weight: bold;
  margin-left: 4px;
}
.unit {
  margin-left: 6px;
  font-size: 14px;
  color: #787885;
}
.base-config-wrapper {
  &:deep {
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
}
.material-text {
  font-size: 14px;
  text-transform: uppercase;
  color: #aaa;
  margin-left: 8px;
}

@media screen and (max-width: 900px) {
  .main-config {
    overflow: auto;
    height: auto;
    .base-config-wrapper,
    .component-config-wrapper {
      width: 100%;
      padding: 0 10px;
      border-right: none;
      margin-bottom: 20px;
    }
  }
}

</style>
<style lang="scss">
.animation-dialog-wrapper .base-config-dialog.dialog .dialog-body {
  padding: 0 10px !important;
  margin-top: -10px;
}
</style>
