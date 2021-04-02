<template>
  <div class="setting-btn" @click="handleOpenSetting">添加组件</div>
  <animation-dialog 
    ref="dialog" 
    :animationMode="true" 
    title="添加组件" 
    width="400px" 
    height="500px" 
    :closeOnClickOutside="false" 
    :listenWindowSizeChange="true">
    <el-form ref="form" label-width="100px" label-position="top">
      <el-form-item label="Material">
        <el-select v-model="formData.material" style="width: 150px">
          <el-option v-for="item in materialList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Size">
        <div class="form-control">
          <el-input-number v-model="formData.sizeWidth" controls-position="right" :min="1" :max="24" style="width:100px" />
          <svg class="divider" viewBox="0 0 1024 1024" width="20" height="20">
            <path d="M755.2 832L512 588.8 268.8 832 192 755.2 435.2 512 192 268.8 268.8 192 512 435.2 755.2 192 832 268.8 588.8 512l243.2 243.2-76.8 76.8z" fill="#292929"></path>
          </svg>
          <el-input-number v-model="formData.sizeHeight" controls-position="right" :min="1" :max="24" style="width:100px" />
        </div>
      </el-form-item>
      <el-form-item label="Background">
        <BackgroundSelector 
          v-model:background="formData.background" 
          :sizeWidth="formData.sizeWidth" 
          :sizeHeight="formData.sizeHeight" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button class="btn" @click="handleCloseSetting">取消</button>
        <button class="btn btn-primary" @click="handleAddComponent">添加</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import AnimationDialog from '@howdyjs/animation-dialog'
import BackgroundSelector from './BackgroundSelector.vue'
import { MATERIAL_LIST_MAP } from '@/constanst'
import { map2List } from '@/utils'
const DEFAULT_SETTING = {
  sizeWidth: 4,
  sizeHeight: 4,
  background: 'transparent',
  material: 1
}
export default defineComponent({
  name: 'Setting',
  components: {
    AnimationDialog,
    BackgroundSelector
  },
  emits: ['add'],
  setup(props, { emit }) {
    const dialog = ref()
    const handleOpenSetting = () => {
      dialog.value.open()
    }
    const handleCloseSetting = () => {
      dialog.value.close()
    }

    const formData = reactive({ ...DEFAULT_SETTING})

    const handleAddComponent = () => {
      emit('add', formData)
      handleCloseSetting()
      Object.assign(formData, DEFAULT_SETTING)
    }

    const materialList = map2List(MATERIAL_LIST_MAP, true)
    
    return {
      dialog,
      handleOpenSetting,
      handleCloseSetting,
      formData,
      handleAddComponent,
      materialList
    }
  }
})
</script>
<style lang="scss" scoped>
.setting-btn {
  position: fixed;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
}
.form-control {
  display: flex;
  align-items: center;
  .divider {
    margin: 0 10px
  }
}
:deep {
 .el-form-item__label {
    color: rgb(43, 43, 43);
    font-weight: bold;
    line-height: 1 !important;
    font-size: 16px;
 }
}
</style>
