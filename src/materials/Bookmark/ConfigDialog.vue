<template>
  <easy-dialog
    v-model="dialogVisible"
    :title="state.formData.id ? $t('编辑书签'): $t('添加书签')"
    width="min(480px, 98vw)"
    height="min(520px, 90vh)"
    customClass="bookmark-config-dialog"
    @close="close"
  >
    <el-form ref="form" label-width="110px" :model="state.formData" :rules="state.formRules">
      <el-form-item :label="$t('类型')">
        <el-radio-group v-model="state.formData.type" :disabled="!!state.formData.id">
          <el-radio label="icon">{{$t('图标')}}</el-radio>
          <el-radio label="folder" :disabled="!!sourceParent">{{$t('文件夹')}}</el-radio>
          <el-radio label="file" :disabled="!!sourceParent">{{$t('从Chrome书签导入')}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="state.formData.type === 'icon'" :label="$t('网站地址')" prop="url">
        <el-input v-model="state.formData.url" :placeholder="$t('请输入网站地址')" @blur="handleLinkInputBlur"/>
      </el-form-item>
      <el-form-item v-if="state.formData.type !== 'file'" :label="state.formData.type === 'icon' ? $t('网站名称'): $t('文件夹名称')" prop="title">
        <el-input v-model="state.formData.title" :placeholder="state.formData.type === 'icon' ? $t('请输入网站名称'): $t('请输入文件夹名称')" />
      </el-form-item>
      <template v-if="state.formData.type === 'icon'">
        <el-form-item :label="$t('网站图标')" prop="iconType">
          <el-radio-group v-model="state.formData.iconType" @change="handleIconChange">
            <el-radio v-for="item in iconTypeList" :label="item.value" :key="item.value">{{$t(item.label)}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('图标地址')" prop="iconPath" v-if="state.formData.iconType === 'network'">
          <el-input v-model="state.formData.iconPath" :placeholder="$t('请输入图标地址')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('文本颜色')" prop="iconPath" v-if="state.formData.iconType === 'text'">
          <StandardColorPicker show-alpha v-model="state.formData.iconPath" />
        </el-form-item>
        <el-form-item :label="$t('图标文案')" prop="iconText" v-if="state.formData.iconType === 'text'">
          <el-input v-model="state.formData.iconText" maxlength="1" style="width: 80px"/>
          <span class="font-tips-text">{{ $t('仅限一个字') }}</span>
        </el-form-item>
      </template>
      <template v-if="state.formData.type !== 'file'">
        <el-form-item :label="$t('背景颜色')" prop="bgColor">
          <StandardColorPicker show-alpha v-model="state.formData.bgColor" />
        </el-form-item>
        <el-form-item :label="$t('图标预览')">
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
              <div v-if="state.formData.iconType === 'text'" :style="{ fontSize: iconSize, color: state.formData.iconPath }" class="no-icon">
                {{ state.formData.iconText || state.formData.title?.slice(0,1) }}
              </div>
              <div v-if="state.formData.iconType === 'api' && imgLoading" class="img-loading">
                <Icon name="loader-2" :size="iconSize" class="infinty-loading" />
              </div>
            </template>
            <svg v-if="state.formData.type === 'folder'" viewBox="0 0 1124 1024" :width="(iconSize || '32').replace('px','')" :height="(iconSize || '32').replace('px','')">
              <path d="M948.079775 106.337352H460.223099S394.153465 1.788394 355.688563 1.788394H181.435493a69.68969 69.68969 0 0 0-69.68969 69.704113v801.474704a69.718535 69.718535 0 0 0 69.68969 69.68969h766.629859a69.718535 69.718535 0 0 0 69.68969-69.68969V176.027042a69.718535 69.718535 0 0 0-69.68969-69.68969z" fill="#D0994B"></path>
              <path d="M111.745803 210.871887h906.023662v278.787606H111.745803z" fill="#E4E7E7"></path>
              <path d="M76.900958 280.561577h975.713352a69.68969 69.68969 0 0 1 69.704113 69.704113L1052.628732 942.656901a69.718535 69.718535 0 0 1-69.704112 69.689691H146.60507a69.718535 69.718535 0 0 1-69.704112-69.689691L7.211268 350.26569a69.68969 69.68969 0 0 1 69.68969-69.704113z" fill="#F4B459"></path>
            </svg>
          </div>
        </el-form-item>
      </template>
      <el-form-item v-if="state.formData.type === 'icon'" :label="$t('缓存图标')">
        <el-switch v-model="cacheIcon"></el-switch>
      </el-form-item>
      <el-form-item v-if="state.formData.type === 'file'" :label="$t('书签HTML')">
        <button type="button" class="btn btn-warning" @click="handleUploadBookmark">{{$t('导入文件')}}</button>
        <input type="file" accept=".html" style="display: none;" ref="htmlRef">
        <div v-if="transformBookmark.length" class="transform-tips">{{$t('解析书签文件成功，解析结果如下')}}</div>
        <div v-if="transformBookmark.length" class="transform-bookmark-wrapper">
          <template v-for="(item,index) in transformBookmark" :key="index">
            <details v-if="item.children" class="details">
              <summary>{{item.title}}</summary>
              <div v-for="(item1, index1) in item.children" :key="index1" class="sub-title">{{item1.title}}</div>
            </details>
            <div v-else class="title">{{item.title}}</div>
          </template>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button type="button" class="btn" @click="closeDialog">{{$t('取消')}}</button>
        <button type="button" class="btn btn-primary" :loading="loading" @click="submit">{{$t('确认')}}</button>
      </div>
    </template>
  </easy-dialog>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, watch, toRaw } from 'vue'
import { getBase64ByAjax, getTargetIconLink, getTargetIconV2 } from '@/utils/images'
import StandardColorPicker from '@/components/FormControl/StandardColorPicker.vue'
import { ElNotification } from 'element-plus'
import { apiURL } from '@/global'
import { uid } from '@/utils'
import $ from './zepto'
import { useI18n } from 'vue-i18n'
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

const emit = defineEmits(['add', 'edit', 'import'])
const props = defineProps({
  boxSize: String,
  boxRadius: String,
  iconSize: String
})
const dialogVisible = ref(false)
const form = ref()

const tempIconLink = ref('')
const cacheIcon = ref(true)
const loading = ref(false)
const imgLoading = ref(false)

const { t } = useI18n()

const state = reactive({
  formData: {
    id: '',
    type: 'icon',
    title: '',
    url: '',
    iconType: 'api',
    iconPath: '',
    iconText: '',
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
const sourceParent = ref<Bookmark | null>()
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
    if (state.formData.iconPath?.includes('data:image')) {
      state.formData.iconType = 'api'
      state.formData.iconPath = ''
    }
    tempIconLink.value = getTargetIconV2(state.formData.url)
    fetch(`${apiURL}/api/title?url=${encodeURIComponent(state.formData.url.replace(/http(s)?:\/\//, ''))}`).then(res => res.json()).then(data => {
      if (!state.formData.title) {
        state.formData.title = data.title
      }
    })
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
  if (state.formData.url && state.formData.iconType === 'api') {
    tempIconLink.value = getTargetIconV2(state.formData.url)
  }
}

const submit = () => {
  form.value.validate(async (valid: boolean) => {
    if (valid) {
      loading.value = true
      if (state.formData.type === 'icon') {
        try {
          if (cacheIcon.value && state.formData.iconType === 'api' && tempIconLink.value && state.formData.url) {
            const base64 = await getBase64ByAjax(getTargetIconV2(state.formData.url), 'image/x-icon')
            state.formData.iconType = 'network'
            state.formData.iconPath = base64
          } else if (state.formData.iconType === 'api' && tempIconLink.value && state.formData.url) {
            state.formData.iconType = 'network'
            state.formData.iconPath = await getTargetIconLink(state.formData.url)
          }
        } catch {
          ElNotification({
            title: t('提示'),
            type: 'error',
            message: t('无法获取到图标，使用文字图标代替')
          })
          state.formData.iconType = 'text'
          state.formData.iconPath = 'rgba(52,54,62,1)'
        }
      }
      if (state.formData.type === 'file') {
        if (!transformBookmark.value || transformBookmark.value.length === 0) return
        emit('import', toRaw(transformBookmark.value))
      } else {
        if (state.formData.id) {
          // 编辑
          emit('edit', { ...JSON.parse(JSON.stringify(state.formData)) }, toRaw(sourceParent.value))
        } else {
          // 添加
          state.formData.id = uid()
          emit('add', { ...JSON.parse(JSON.stringify(state.formData)) }, toRaw(sourceParent.value))
        }
      }
      loading.value = false
      closeDialog()
    } else {
      return false;
    }
  });
}

const open = (params?: Bookmark, parent?: Bookmark) => {
  loading.value = false
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
  if (parent) {
    sourceParent.value = parent
  }
  dialogVisible.value = true
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
  sourceParent.value = null
  transformBookmark.value = []
}
const closeDialog = () => {
  close()
  dialogVisible.value = false
}

const htmlRef = ref()
const transformBookmark = ref<any[]>([])
const handleUploadBookmark = () => {
  htmlRef.value.click()
  htmlRef.value.onchange = (e: InputEvent) => {
    const errorHandler = () => {
      ElNotification({
        title: t('异常'),
        type: 'error',
        message: t('识别文件错误，请检查文件')
      })
    }
    const el = e.currentTarget
    if (el) {
      const { files } = el as any
      const reader = new FileReader()
      reader.readAsText(files[0], 'UTF-8');
      reader.onload = (e1) => {
        const bookmarkData = e1.target?.result
        try {
          const main = $(bookmarkData).children('dt').first().children('dl').children('dt');
          const result: any[] = [];
          main.map((index: number, item: any) => {
            if ($(item).children().length === 1) {
              const title = $(item).children('a').text();
              const href = $(item).children('a').attr('href');
              const icon = $(item).children('a').attr('icon');
              result.push({ title, href, icon });
            } else if ($(item).children().length === 3) {
              const title = $(item).children('h3').text();
              const children: any[] = [];
              $(item).children('dl').children('dt').map((index: number, item1: any) => {
                if ($(item1).children().length === 1) {
                  const title = $(item1).children('a').text();
                  const href = $(item1).children('a').attr('href');
                  const icon = $(item1).children('a').attr('icon');
                  children.push({ title, href, icon });
                }
              });
              result.push({ title, children });
            }
          });
          if (!result || result.length === 0) {
            errorHandler()
          } else {
            transformBookmark.value = result
          }
        } catch {
          errorHandler()
        }
      }
      reader.onerror = () => errorHandler()
    }
  }
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
.transform-tips {
  padding: 10px 20px;
  margin: 10px 0;
  border-radius: 4px;
  background-color: #f0f9eb;
  color: #67c23a;
  font-size: 12px;
  line-height: 20px;
}
.transform-bookmark-wrapper {
  font-size: 12px;
  color: rgb(70, 70, 75);
  line-height: 20px;
  padding: 10px;
  border-radius: 4px;
  background: rgb(245, 245, 245);
  .title {
    padding-left: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sub-title {
    padding-left: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.font-tips-text {
  font-size: 12px;
  margin-left: 10px;
  color: #999;
}
</style>
