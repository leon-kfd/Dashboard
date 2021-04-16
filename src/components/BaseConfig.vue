<template>
  <animation-dialog
    ref="dialog"
    animationMode
    :title="editId ? '编辑组件': '添加组件'"
    width="min(440px, 98vw)"
    height="min(520px, 90vh)"
    customClass="base-config-dialog"
    :closeOnClickOutside="false"
    listenWindowSizeChange
    animation-in="flipInY">
    <WarnLock />
    <el-form ref="form" label-position="top" :model="state.formData">
      <el-form-item label="物料组件">
        <el-select v-model="state.formData.material" style="width: 250px" :disabled="!!editId" @change="handleMaterialChange">
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
        <div class="form-control">
          <el-input-number
            v-model="state.formData.sizeWidth"
            controls-position="right"
            :min="minWidth"
            :max="24"
            style="width:100px" />
          <svg
            class="divider"
            viewBox="0 0 1024 1024"
            width="20"
            height="20">
            <path d="M755.2 832L512 588.8 268.8 832 192 755.2 435.2 512 192 268.8 268.8 192 512 435.2 755.2 192 832 268.8 588.8 512l243.2 243.2-76.8 76.8z" fill="#292929"></path>
          </svg>
          <el-input-number
            v-model="state.formData.sizeHeight"
            controls-position="right"
            :min="1"
            :max="24"
            style="width:100px" />
          <el-tooltip effect="dark" placement="bottom">
            <i class="tips el-icon-warning-outline"></i>
            <template #content>
              <div style="line-height:1.5">
                <p>响应式设计风格, 单位为屏幕栅格数</p>
                <p>Screen&lt;720px时, 屏幕满屏为12栏</p>
                <p>Screen&lt;1920px时, 屏幕满屏为24栏</p>
                <p>Screen&gt;1920px时, 屏幕满屏为36栏</p>
              </div>
            </template>
          </el-tooltip>
        </div>
      </el-form-item>
      <el-form-item label="背景">
        <BackgroundSelector
          v-model:background="state.formData.background"
          :sizeWidth="state.formData.sizeWidth"
          :sizeHeight="state.formData.sizeHeight" />
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
import BackgroundSelector from './BackgroundSelector.vue'
import WarnLock from '@/components/WarnLock.vue'
import PositionSelector from '@/plugins/position-selector'
import Tips from '@/components/Tips.vue'
import { MATERIAL_LIST_MAP } from '@/constanst'
import { useStore } from 'vuex'
import { ElNotification } from 'element-plus';
import { baseSetting } from '@/materials/setting'
const DEFAULT_SETTING: ComponentOptions = {
  position: 1,
  affixInfo: {
    mode: 1,
    x: 10,
    y: 10
  },
  sizeWidth: 4,
  sizeHeight: 4,
  background: 'transparent',
  material: 1,
  borderRadius: 4,
  boxShadow: '0 0 4px #89909c'
}
export default defineComponent({
  name: 'BaseConfig',
  components: {
    AnimationDialog,
    BackgroundSelector,
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
    }
    const close = () => {
      dialog.value.close()
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
    const minWidth = ref(1)
    const handleMaterialChange = (val:number) => {
      const label = (MATERIAL_LIST_MAP as any)[val].label
      if (label && baseSetting[label]) {
        minWidth.value = baseSetting[label].minWidth || 1
        if (state.formData.sizeWidth < minWidth.value) {
          state.formData.sizeWidth = minWidth.value
        }
      } else {
        minWidth.value = 1
      }
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
      minWidth,
      handleMaterialChange,
      affixX,
      affixY,
      handleResetAffix
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
    width: 64px;
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
    font-size: 14px;
 }
}
</style>
<style>
.base-config-dialog .dialog-body{
  padding: 5px 20px !important;
}
</style>
