<template>
  <animation-dialog
    ref="dialog"
    animationMode
    :title="editId ? '编辑组件': '添加组件'"
    width="min(440px, 98vw)"
    height="min(520px, 90vh)"
    appendToBody
    :closeOnClickOutside="false"
    listenWindowSizeChange
    animation-in="flipInY"
    customClass="base-config-dialog"
    @beforeClose="beforeClose">
    <WarnLock />
    <el-form ref="form" label-position="top" :model="state.formData">
      <el-form-item label="物料组件">
        <el-select v-model="state.formData.material" style="width: 250px" :disabled="!!editId">
          <el-option
            v-for="item in materialList"
            :key="item.value"
            :value="item.value"
            :label="item.label"
            style="width: 250px">
            <span style="float: left">{{ item.label }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.text }}</span>
          </el-option>
        </el-select>
        <Tips content="🤔Wait for more..." />
      </el-form-item>
      <el-form-item label="定位模式">
        <el-select v-model="state.formData.position" :disabled="!!editId" style="width: 250px">
          <el-option label="默认模式" :value="1" style="width: 250px"></el-option>
          <el-option label="Fixed模式" :value="2" style="width: 250px"></el-option>
        </el-select>
        <el-tooltip effect="dark" placement="bottom">
          <i class="tips el-icon-warning-outline"></i>
          <template #content>
            <div style="line-height:1.5">
              <p>默认模式跟随文档流布局，组件大小响应式，编辑时可更改顺序</p>
              <p>Fixed模式使用会让组件固定在屏幕相应位置，编辑时可更改位置</p>
            </div>
          </template>
        </el-tooltip>
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
          <Tips content="Fixed定位方向属性，例如想固定到右下角请选右下" />
        </div>
      </el-form-item>
      <el-form-item label="组件尺寸">
        <div class="form-row-control">
          <div class="label">Width</div>
          <div class="content">
            <el-input-number
              v-model="state.formData.sizeWidth"
              controls-position="right"
              :min="state.formData.sizeWidthUnit === 1 ? 1: 40"
              :max="state.formData.sizeWidthUnit === 1 ? 24: 1920"
              style="width:100px" />
            <el-select style="width:74px;margin-left:4px" v-model="state.formData.sizeWidthUnit" @change="handleSizeUnitChange">
              <el-option :value="1" label="FR"></el-option>
              <el-option :value="2" label="PX"></el-option>
            </el-select>
            <el-tooltip effect="dark" placement="bottom">
            <i class="tips el-icon-warning-outline"></i>
            <template #content>
              <div style="line-height:1.5">
                <p>PX为固定宽高模式</p>
                <p>FR为响应式设计风格, 单位为屏幕栅格数</p>
                <p>Screen&lt;720px时, 屏幕满屏为12栏</p>
                <p>Screen&lt;1920px时, 屏幕满屏为24栏</p>
                <p>Screen&gt;1920px时, 屏幕满屏为36栏</p>
              </div>
            </template>
          </el-tooltip>
          </div>
        </div>
        <div class="form-row-control">
          <div class="label">Height</div>
          <div class="content">
            <el-input-number
              v-model="state.formData.sizeHeight"
              controls-position="right"
              :min="state.formData.sizeHeightUnit === 1 ? 1: 40"
              :max="state.formData.sizeHeightUnit === 1 ? 24: 1920"
              style="width:100px" />
            <el-select style="width:74px;margin-left:4px" v-model="state.formData.sizeHeightUnit" @change="handleSizeUnitChange">
              <el-option :value="1" label="FR"></el-option>
              <el-option :value="2" label="PX"></el-option>
            </el-select>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="背景">
        <BackgroundSelector
          v-model:background="state.formData.background"
          :sizeWidth="state.formData.sizeWidth"
          :sizeHeight="state.formData.sizeHeight" />
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
              style="width: 100px">
            </el-input-number>
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
              placeholder="请输入box-shadow值"></el-input>
          </div>
          <Tips content="基于CSS3的box-shadow属性，应输入合法的CSS盒子阴影代码片段" />
        </div>
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
import { computed, defineComponent, reactive, ref } from 'vue'
import AnimationDialog from '@howdyjs/animation-dialog'
import BackgroundSelector from '@/components/FormControl/BackgroundSelector.vue'
import BackgroundFilterSelector from '@/components/FormControl/BackgroundFilterSelector.vue'
import WarnLock from '@/components/FormControl/WarnLock.vue'
import PositionSelector from '@/plugins/position-selector'
import Tips from '@/components/Tools/Tips.vue'
import { MATERIAL_LIST_MAP } from '@/constanst'
import { useStore } from 'vuex'
import { ElNotification } from 'element-plus';
// import { baseSetting } from '@/materials/setting'
const DEFAULT_SETTING: ComponentOptions = {
  position: 1,
  affixInfo: {
    mode: 1,
    x: 10,
    y: 10
  },
  sizeWidth: 4,
  sizeWidthUnit: 1,
  sizeHeight: 4,
  sizeHeightUnit: 1,
  background: 'transparent',
  backgroundFilter: 'brightness(0.9)',
  material: 1,
  borderRadius: 4,
  boxShadow: '0 0 4px #89909c'
}
export default defineComponent({
  name: 'BaseConfig',
  components: {
    AnimationDialog,
    BackgroundSelector,
    BackgroundFilterSelector,
    WarnLock,
    PositionSelector,
    Tips
  },
  setup() {
    const store = useStore()

    const form = ref()
    const state = reactive({
      formData: JSON.parse(JSON.stringify(DEFAULT_SETTING))
    })

    const editId = ref('')

    const dialog = ref()
    const open = (_editId: string) => {
      dialog.value.open()
      if (_editId) {
        const _getSetting = store.getters.getComponentSetting(_editId)
        state.formData = { ..._getSetting }
        editId.value = _editId
      } else {
        editId.value = ''
        state.formData = {
          ...JSON.parse(JSON.stringify(DEFAULT_SETTING)),
          boxShadow: store.state.global.background.includes('http') ? '' : DEFAULT_SETTING.boxShadow
        }
      }
      setTimeout(() => {
        // document.querySelector('.page')?.classList.add('page-to-blur')
        const dialogBody = document.querySelector('.base-config-dialog .dialog-body')
        if (dialogBody) dialogBody.scrollTop = 0
      })
    }
    const close = () => {
      dialog.value.close()
    }

    const beforeClose = () => {
      document.querySelector('.page')?.classList.remove('page-to-blur')
    }

    const submit = () => {
      if (editId.value) {
        store.commit('editComponent', {
          ...state.formData,
          id: editId.value
        })
      } else {
        store.commit('addComponent', {
          ...state.formData,
          id: Math.random().toString(32).slice(2)
        })
      }
      close()
      state.formData = {
        ...JSON.parse(JSON.stringify(DEFAULT_SETTING)),
        boxShadow: store.state.global.background.includes('http') ? '' : DEFAULT_SETTING.boxShadow
      }
      if (store.state.isLock) {
        store.commit('updateIsLock', false)
        ElNotification({
          title: '提示',
          message: '已自动进入编辑模式，编辑模式可进行组件拖拽与右键菜单配置'
        })
      }
    }

    const materialList = Object.keys(MATERIAL_LIST_MAP).map(key => {
      const item = (MATERIAL_LIST_MAP as any)[key]
      return {
        value: ~~key,
        label: item.label,
        text: item.text
      }
    })
    const handleSizeUnitChange = () => {
      state.formData.sizeWidth = state.formData.sizeWidthUnit === 2 ? Math.max(40, state.formData.sizeWidth) : Math.min(24, state.formData.sizeWidth)
      state.formData.sizeHeight = state.formData.sizeHeightUnit === 2 ? Math.max(40, state.formData.sizeHeight) : Math.min(24, state.formData.sizeHeight)
    }

    const affixX = computed(() => [1, 3].includes(state.formData.affixInfo.mode) ? 'LEFT' : 'RIGHT')
    const affixY = computed(() => [1, 2].includes(state.formData.affixInfo.mode) ? 'TOP' : 'BOTTOM')
    const handleResetAffix = () => {
      state.formData.affixInfo.x = DEFAULT_SETTING.affixInfo?.x
      state.formData.affixInfo.y = DEFAULT_SETTING.affixInfo?.y
    }

    return {
      dialog,
      form,
      state,
      submit,
      materialList,
      open,
      close,
      editId,
      handleSizeUnitChange,
      affixX,
      affixY,
      handleResetAffix,
      beforeClose
    }
  }
})
</script>
<style lang="scss" scoped>
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
    width: 72px;
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
:deep {
 .el-form-item__label {
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
</style>
