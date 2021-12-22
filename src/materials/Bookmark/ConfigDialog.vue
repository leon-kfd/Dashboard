<template>
  <animation-dialog
    ref="dialog"
    customWrapperClass="backdrop-blur"
    animationMode
    title="添加书签"
    width="min(480px, 98vw)"
    height="min(520px, 90vh)"
    :closeOnClickOutside="false"
    :listenWindowSizeChange="true"
    appendToBody
    animation-in="flipInY"
  >
    <el-form ref="form" label-width="80px" :model="state.formData" :rules="state.formRules">
      <el-form-item label="网站名称" prop="title">
        <el-input v-model="state.formData.title" placeholder="请输入网站名称" />
      </el-form-item>
      <el-form-item label="网站地址" prop="url">
        <div class="form-control">
          <el-input v-model="state.formData.url" placeholder="请输入网站地址" @blur="handleLinkInputBlur"/>
        </div>
      </el-form-item>
      <el-form-item label="网站图标" prop="iconType">
        <el-radio-group v-model="state.formData.iconType">
          <el-radio v-for="item in iconTypeList" :label="item.value" :key="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="图标地址" prop="iconPath" v-if="state.formData.iconType === 'network'">
        <el-radio-group v-model="state.formData.iconType">
          <el-input v-model="state.formData.iconPath" placeholder="请输入图标地址"></el-input>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="文本颜色" prop="iconPath" v-if="state.formData.iconType === 'text'">
        <StandardColorPicker v-model="state.formData.iconPath" />
      </el-form-item>
      <el-form-item label="背景颜色" prop="bgColor">
        <StandardColorPicker v-model="state.formData.bgColor" />
      </el-form-item>
      <el-form-item label="图标预览">
        <div class="icon-img-preview-box" :style="{ width: boxSize, height: boxSize, borderRadius, background: state.formData.bgColor }">
          <template v-if="showIconPreview">
            <img
              v-if="state.formData.iconType==='network'"
              :src="state.formData.iconPath"
              alt="icon"
              :style="{ width: iconSize, height: iconSize }">
            <img
              v-if="state.formData.iconType === 'api'"
              :src="tempIconLink"
              alt="icon"
              :style="{ width: iconSize, height: iconSize }" >
            <div v-if="state.formData.iconType === 'text'" :style="{ fontSize: iconSize, color: state.formData.iconPath }" class="no-icon">{{state.formData.title.slice(0,1)}}</div>
          </template>
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

<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { getTargetIcon } from '@/utils/images'
import StandardColorPicker from '@/components/FormControl/StandardColorPicker.vue'
import { apiURL } from '@/global'
const iconTypeList = [
  {
    label: 'API获取',
    value: 'api'
  },
  {
    label: '文字图标',
    value: 'text'
  },
  {
    label: '网络图片',
    value: 'network'
  }
]

const emit = defineEmits(['add'])
const props = defineProps({
  boxSize: String,
  boxRadius: String,
  iconSize: String
})
const dialog = ref()
const form = ref()

const tempIconLink = ref('')

const state = reactive({
  formData: {
    id: '',
    title: '',
    url: '',
    iconType: 'api',
    iconPath: '',
    bgColor: 'rgba(241, 243, 244, 1)'
  } as Bookmark,
  formRules: {
    title: [{ required: true, message: '请输入网站标题', trigger: 'blur' }],
    url: [{ required: true, message: '请输入网站地址', trigger: 'blur' }],
    iconType: [{ required: true, message: '请选择图标类型', trigger: 'change' }],
    iconPath: [{ validator: checkIconPath, trigger: 'blur' }]
  }
})
function checkIconPath (rule: any, value: string, callback: any) {
  if (state.formData.iconType === 'network' && !value) {
    callback(new Error('请输入图标地址'))
  } else {
    callback()
  }
}
const showIconPreview = computed(() => {
  return (state.formData.iconType === 'api' && state.formData.url) ||
  (state.formData.iconType === 'network' && state.formData.iconPath) ||
  (state.formData.iconType === 'text' && state.formData.title)
})

const handleLinkInputBlur = () => {
  tempIconLink.value = getTargetIcon(state.formData.url)
}

const submit = () => {
  form.value.validate(async (valid: boolean) => {
    if (valid) {
      if (state.formData.iconType === 'api' && tempIconLink.value) {
        try {
          const res = await fetch(`${apiURL}/api/icon?url=${encodeURIComponent(state.formData.url)}&type=link`)
          const iconPath = await res.text()
          if (iconPath) {
            state.formData.iconType = 'network'
            state.formData.iconPath = iconPath
          }
        } catch {
          //
        }
      }
      if (state.formData.id) {
        // 编辑
      } else {
        // 添加
        state.formData.id = Math.random().toString(16).slice(2)
        emit('add', { ...JSON.parse(JSON.stringify(state.formData)) })
      }
      close()
    } else {
      return false;
    }
  });
}

const open = (params: Bookmark) => {
  if (params) {
    // edit
  }
  dialog.value.open()
}
const close = () => {
  form.value.resetFields()
  state.formData = {
    id: '',
    title: '',
    url: '',
    iconType: 'api',
    iconPath: '',
    bgColor: 'rgba(241, 243, 244, 1)'
  }
  dialog.value.close()
}
</script>

<style lang="scss" scoped>
.icon-img-preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  .no-icon {
    color: #fff;
    font-weight: bold;
  }
}
</style>
