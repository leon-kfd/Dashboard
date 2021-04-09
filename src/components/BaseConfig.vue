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
        <el-tooltip effect="dark" content="🤔Wait for more..." placement="bottom">
          <i class="tips el-icon-warning-outline"></i>
        </el-tooltip>
      </el-form-item>
      <el-form-item label="组件尺寸">
        <div class="form-control">
          <el-input-number
            v-model="state.formData.sizeWidth"
            controls-position="right"
            :min="1"
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
              v-model="state.formData.boxShadow"
              clearable
              style="width: 240px"
              placeholder="请输入CSS属性box-shadow值"></el-input>
          </div>
          <el-tooltip effect="dark" content="基于CSS3的box-shadow属性，应输入合法的CSS盒子阴影代码片段" placement="bottom">
            <i class="tips el-icon-warning-outline"></i>
          </el-tooltip>
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
import { defineComponent, reactive, ref } from 'vue'
import AnimationDialog from '@howdyjs/animation-dialog'
import BackgroundSelector from './BackgroundSelector.vue'
import { MATERIAL_LIST_MAP } from '@/constanst'
import { useStore } from 'vuex'
const DEFAULT_SETTING: ComponentOptions = {
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
    BackgroundSelector
  },
  setup() {
    const store = useStore()

    const form = ref()
    const state = reactive({
      formData: {
        ...DEFAULT_SETTING
      }
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
        state.formData = { ...DEFAULT_SETTING }
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
      state.formData = { ...DEFAULT_SETTING }
    }

    const materialList = Object.keys(MATERIAL_LIST_MAP).map(key => {
      const item = (MATERIAL_LIST_MAP as any)[key]
      return {
        value: ~~key,
        label: item.label,
        text: item.text
      }
    })

    return {
      dialog,
      form,
      state,
      submit,
      materialList,
      open,
      close,
      editId
    }
  }
})
</script>
<style lang="scss" scoped>
.form-control {
  display: flex;
  align-items: center;
  .divider {
    margin: 0 8px
  }
}
.form-row-control {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  .label {
    width: 64px;
    text-align: right;
    color: rgb(43, 43, 43);
    font-weight: bold;
    font-size: 14px;
    margin-right: 8px;
  }
  // .content {
  //   flex: 1
  // }
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
