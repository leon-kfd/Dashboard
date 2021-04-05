<template>
  <animation-dialog 
    ref="dialog" 
    :animationMode="true" 
    :title="editId ? '编辑组件': '添加组件'" 
    width="400px" 
    height="500px" 
    customClass="setting-dialog"
    :closeOnClickOutside="false" 
    :listenWindowSizeChange="true"
    animation-in="flipInY">
    <el-form ref="form" label-width="100px" label-position="top" :model="formData">
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
import { MATERIAL_LIST_MAP } from '@/constanst'
import { map2List } from '@/utils'
import { useStore } from 'vuex'
const DEFAULT_SETTING: ComponentOptions = {
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
  setup(props, { emit }) {
    const store = useStore()

    const form = ref()
    const formData = reactive({ ...DEFAULT_SETTING})

    const editId = ref('')

    const dialog = ref()
    const open = (_editId: string) => {
      dialog.value.open()
      if (_editId) {
        const _getSetting = store.getters.getComponentSetting(_editId)
        Object.assign(formData, _getSetting)
        editId.value = _editId
      }
    }
    const close = () => {
      dialog.value.close()
    }

    const submit = () => {
      if (editId.value) {
        store.commit('editComponent', {
          ...formData,
          id: editId.value
        })
      } else {
        store.commit('addComponent', {
          ...formData,
          id: Math.random().toString(32).slice(2)
        })
      }
      close()
      Object.assign(formData, DEFAULT_SETTING)
    }

    const materialList = map2List(MATERIAL_LIST_MAP, true)
    
    return {
      dialog,
      form,
      formData,
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
<style>
.setting-dialog .dialog-body{
  padding: 0 20px !important;
}
@keyframes flipInY {
  from {
    transform: perspective(400px) scale(0.5) rotate3d(0, 1, 0, 90deg);
    animation-timing-function: ease-in;
    opacity: 0;
  }

  40% {
    transform: perspective(400px) scale(1) rotate3d(0, 1, 0, -20deg);
    animation-timing-function: ease-in;
  }

  60% {
    transform: perspective(400px) rotate3d(0, 1, 0, 10deg);
    opacity: 1;
  }

  80% {
    transform: perspective(400px) rotate3d(0, 1, 0, -5deg);
  }

  to {
    transform: perspective(400px);
  }
}
.animate__flipInY {
  -webkit-backface-visibility: visible !important;
  backface-visibility: visible !important;
  -webkit-animation-name: flipInY;
  animation-name: flipInY;
}
</style>