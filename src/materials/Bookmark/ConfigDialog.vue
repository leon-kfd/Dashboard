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
    @close="close"
  >
    <el-form ref="form" label-width="100px" :model="state.formData" :rules="state.formRules">
      <el-form-item label="类型">
        <el-radio-group v-model="state.formData.type">
          <el-radio label="icon">图标</el-radio>
          <el-radio label="folder">文件夹</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="state.formData.type === 'icon'" label="网站地址" prop="url">
        <div class="form-control">
          <el-input v-model="state.formData.url" placeholder="请输入网站地址" @blur="handleLinkInputBlur"/>
        </div>
      </el-form-item>
      <el-form-item :label="state.formData.type === 'icon' ? '网站名称': '文件夹名称'" prop="title">
        <el-input v-model="state.formData.title" :placeholder="state.formData.type === 'icon' ? '请输入网站名称': '请输入文件夹名称'" />
      </el-form-item>
      <template v-if="state.formData.type === 'icon'">
        <el-form-item label="网站图标" prop="iconType">
          <el-radio-group v-model="state.formData.iconType" @change="handleIconChange">
            <el-radio v-for="item in iconTypeList" :label="item.value" :key="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="图标地址" prop="iconPath" v-if="state.formData.iconType === 'network'">
          <el-input v-model="state.formData.iconPath" placeholder="请输入图标地址"></el-input>
        </el-form-item>
        <el-form-item label="文本颜色" prop="iconPath" v-if="state.formData.iconType === 'text'">
          <StandardColorPicker show-alpha v-model="state.formData.iconPath" />
        </el-form-item>
      </template>
      <el-form-item label="背景颜色" prop="bgColor">
        <StandardColorPicker show-alpha v-model="state.formData.bgColor" />
      </el-form-item>
      <el-form-item label="图标预览">
        <div class="icon-img-preview-box" :style="{ width: boxSize, height: boxSize, borderRadius: boxRadius, background: state.formData.bgColor }">
          <template v-if="state.formData.type === 'icon' && showIconPreview">
            <img
              v-if="state.formData.iconType==='network'"
              :src="state.formData.iconPath"
              :style="{ width: iconSize, height: iconSize }">
            <img
              v-if="state.formData.iconType === 'api' && tempIconLink"
              :src="tempIconLink"
              :style="{ width: iconSize, height: iconSize }"
              @load="imgLoading = false"
              @error="imgLoading = false">
            <div v-if="state.formData.iconType === 'text'" :style="{ fontSize: iconSize, color: state.formData.iconPath }" class="no-icon">{{state.formData.title?.slice(0,1)}}</div>
            <div v-if="imgLoading" class="img-loading">
              <i class="el-icon-loading" :style="{ fontSize: iconSize }"></i>
            </div>
          </template>
          <svg v-if="state.formData.type === 'folder'" viewBox="0 0 1124 1024" :width="(iconSize || '32').replace('px','')" :height="(iconSize || '32').replace('px','')">
            <path d="M948.079775 106.337352H460.223099S394.153465 1.788394 355.688563 1.788394H181.435493a69.68969 69.68969 0 0 0-69.68969 69.704113v801.474704a69.718535 69.718535 0 0 0 69.68969 69.68969h766.629859a69.718535 69.718535 0 0 0 69.68969-69.68969V176.027042a69.718535 69.718535 0 0 0-69.68969-69.68969z" fill="#D0994B"></path>
            <path d="M111.745803 210.871887h906.023662v278.787606H111.745803z" fill="#E4E7E7"></path>
            <path d="M76.900958 280.561577h975.713352a69.68969 69.68969 0 0 1 69.704113 69.704113L1052.628732 942.656901a69.718535 69.718535 0 0 1-69.704112 69.689691H146.60507a69.718535 69.718535 0 0 1-69.704112-69.689691L7.211268 350.26569a69.68969 69.68969 0 0 1 69.68969-69.704113z" fill="#F4B459"></path>
          </svg>
        </div>
      </el-form-item>
      <el-form-item v-if="state.formData.type === 'icon'" label="缓存图标">
        <el-switch v-model="cacheIcon"></el-switch>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button type="button" class="btn" @click="closeDialog">取消</button>
        <button type="button" class="btn btn-primary" :loading="loading" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch } from 'vue'
import { getTargetIcon, getTransparentIcon, getTargetIconLink } from '@/utils/images'
import StandardColorPicker from '@/components/FormControl/StandardColorPicker.vue'
import { ElNotification, NotifyPartial } from 'element-plus'
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

const emit = defineEmits(['add', 'edit'])
const props = defineProps({
  boxSize: String,
  boxRadius: String,
  iconSize: String
})
const dialog = ref()
const form = ref()

const tempIconLink = ref('')
const cacheIcon = ref(true)
const loading = ref(false)
const imgLoading = ref(false)

const state = reactive({
  formData: {
    id: '',
    type: 'icon',
    title: '',
    url: '',
    iconType: 'api',
    iconPath: '',
    bgColor: 'rgba(241, 243, 244, 1)',
    children: []
  } as Bookmark,
  formRules: {
    title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
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
  return (state.formData.iconType === 'api' && tempIconLink.value) ||
  (state.formData.iconType === 'network' && state.formData.iconPath) ||
  (state.formData.iconType === 'text' && state.formData.title)
})

const handleLinkInputBlur = () => {
  if (state.formData.url) {
    tempIconLink.value = getTargetIcon(state.formData.url)
  } else {
    tempIconLink.value = ''
  }
}

watch(() => tempIconLink.value, (val) => {
  if (val) {
    imgLoading.value = true
  } else {
    imgLoading.value = false
  }
})

const handleIconChange = () => {
  if (state.formData.iconType === 'text') {
    state.formData.iconPath = 'rgba(48,50,56,1)'
  } else {
    state.formData.iconPath = ''
  }
}

const submit = () => {
  form.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      try {
        if (cacheIcon.value && state.formData.iconType === 'api' && tempIconLink.value && state.formData.url) {
          const base64 = await getTransparentIcon(state.formData.url)
          state.formData.iconType = 'network'
          state.formData.iconPath = base64
        } else if (state.formData.iconType === 'api' && tempIconLink.value && state.formData.url) {
          state.formData.iconType = 'network'
          state.formData.iconPath = await getTargetIconLink(state.formData.url)
        }
      } catch {
        (ElNotification as NotifyPartial)({
          title: '提示',
          type: 'error',
          message: '无法获取到图标，使用文字图标代替'
        })
        state.formData.iconType = 'text'
        state.formData.iconPath = 'rgba(52,54,62,1)'
      }
      if (state.formData.id) {
        // 编辑
        emit('edit', { ...JSON.parse(JSON.stringify(state.formData)) })
      } else {
        // 添加
        state.formData.id = Math.random().toString(16).slice(2)
        emit('add', { ...JSON.parse(JSON.stringify(state.formData)) })
      }
      loading.value = false
      closeDialog()
    } else {
      return false;
    }
  });
}

const open = (params: Bookmark) => {
  if (params) {
    // edit
    state.formData = {
      id: params.id,
      type: params.type,
      title: params.title,
      url: params.url,
      iconType: params.iconType,
      iconPath: params.iconPath,
      bgColor: params.bgColor,
      children: params.children || []
    }
  }
  dialog.value.open()
}
const close = () => {
  form.value.resetFields()
  tempIconLink.value = ''
  state.formData = {
    id: '',
    type: 'icon',
    title: '',
    url: '',
    iconType: 'api',
    iconPath: '',
    bgColor: 'rgba(241, 243, 244, 1)',
    children: []
  }
}
const closeDialog = () => {
  close()
  dialog.value.close()
}

defineExpose({
  open,
  close
})
</script>

<style lang="scss" scoped>
.icon-img-preview-box {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .no-icon {
    font-weight: bold;
  }

  .img-loading {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
