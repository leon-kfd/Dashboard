<template>
  <div
    class="engine-config"
    style="margin-left: -100px; padding-bottom: 10px; border-bottom: 1px solid #ccc"
  >
    <div class="warning">
      {{$t('searchConfigTips')}}
    </div>
    <div class="content">
      <button type="button" class="btn btn-primary btn-small btn-add" @click="handleAddNewEngine">
        {{$t('添加')}}
      </button>
      <div class="text s-title">{{$t('当前引擎组')}}</div>
      <div class="current-engine-wrapper">
        <Draggable
          v-model="cloneEngineList"
          class="now-engine-list engine-list"
          item-key="name"
          group="people"
          @choose="handleDragChoose"
          @unchoose="handleDragUnchoose"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <div
              class="engine-list-item"
              @dblclick="handleEditEngine(element)"
              :title="element.iconType !== 'local' ? $t('双击重新编辑') : ''"
            >
              <img
                v-if="element.iconType === 'local' || element.iconType === 'network'"
                :src="element.iconPath"
                alt="icon"
                width="24"
                height="24"
              />
              <img
                v-if="element.iconType === 'api'"
                :src="getTargetIcon(element.link)"
                alt="icon"
                width="24"
                height="24"
              />
              <div v-if="element.iconType === 'text'" class="no-icon">
                {{ element.name.slice(0, 1) }}
              </div>
              <div class="text">{{ element.name }}</div>
            </div>
          </template>
        </Draggable>
      </div>
      <div class="text s-title">{{$t('备用引擎组')}}</div>
      <div class="backup-engine-wrapper">
        <Draggable
          v-model="cloneBackupEngineList"
          item-key="name"
          group="people"
          class="backupEngineList engine-list"
          @end="handleDragEnd"
        >
          <template #item="{ element }">
            <div class="engine-list-item">
              <img
                v-if="element.iconType === 'local' || element.iconType === 'network'"
                :src="element.iconPath"
                alt="icon"
                width="24"
                height="24"
              />
              <img
                v-if="element.iconType === 'api'"
                :src="getTargetIcon(element.link)"
                alt="icon"
                width="24"
                height="24"
              />
              <div v-if="element.iconType === 'text'" class="no-icon">
                {{ element.name.slice(0, 1) }}
              </div>
              <div class="text">{{ element.name }}</div>
            </div>
          </template>
        </Draggable>
        <div v-if="showDeleteArea" class="delete-area">{{$t('拖拽至此处删除')}}</div>
      </div>
    </div>
  </div>
  <easy-dialog
    v-model="engineDialogVisible"
    :title="`${state.formData._id ? $t('编辑') : $t('添加')}${$t('自定义引擎')}`"
    width="min(380px, 90vw)"
    height="min(460px, 80vh)"
    customClass="add-engine-dialog"
  >
    <el-form ref="form" label-width="90px" :model="state.formData" :rules="state.formRules">
      <el-form-item :label="$t('引擎名称')" prop="name">
        <el-input v-model="state.formData.name" :placeholder="$t('请输入引擎名称')" />
      </el-form-item>
      <el-form-item :label="$t('引擎地址')" prop="link">
        <div class="form-control">
          <el-input
            v-model="state.formData.link"
            :placeholder="$t('请输入引擎地址')"
            @blur="handleLinkInputBlur"
          />
          <Tips>
            <div class="tips">
              {{$t('engineConfigTips1')}} <b>[0]</b> {{$t('engineConfigTips2')}}
            </div>
            <div class="tips">{{$t('例如')}}: <b>https://juejin.im/search?query=[0]&type=all</b></div>
          </Tips>
        </div>
      </el-form-item>
      <el-form-item :label="$t('引擎图标')" prop="iconType">
        <el-radio-group v-model="state.formData.iconType">
          <el-radio v-for="item in iconTypeList" :label="item.value" :key="item.value">{{
            $t(item.label)
          }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('图标地址')" prop="iconPath" v-if="state.formData.iconType === 'network'">
        <el-radio-group v-model="state.formData.iconType">
          <el-input v-model="state.formData.iconPath" :placeholder="$t('请输入图标地址')"></el-input>
        </el-radio-group>
      </el-form-item>
      <el-form-item :label="$t('图标预览')">
        <div class="icon-img-preview-box">
          <template v-if="showIconPreview">
            <img
              v-if="state.formData.iconType === 'network'"
              :src="state.formData.iconPath"
              alt="icon"
              width="24"
              height="24"
            />
            <img
              v-if="state.formData.iconType === 'api'"
              :src="tempIconLink"
              alt="icon"
              width="24"
              height="24"
            />
            <div v-if="state.formData.iconType === 'text'" class="no-icon">
              {{ state.formData.name.slice(0, 1) }}
            </div>
          </template>
          <div v-else class="icon-img-preview"></div>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="footer" style="text-align: right; padding: 12px">
        <button type="button" class="btn" @click="close">{{$t('取消')}}</button>
        <button type="button" class="btn btn-primary" @click="submit">{{$t('确认')}}</button>
      </div>
    </template>
  </easy-dialog>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, nextTick, reactive, computed, toRaw } from 'vue'
import Draggable from 'vuedraggable'
import { getTargetIcon } from '@/utils/images'
import Tips from '@/components/Tools/Tips.vue'
import { apiURL } from '@/global'
import { uid } from '@/utils'
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
export default defineComponent({
  name: 'EngineConfig',
  components: {
    Draggable,
    Tips
  },
  props: {
    engineList: {
      type: Array,
      required: true
    },
    backupEngineList: {
      type: Array,
      required: true
    }
  },
  emits: ['update'],
  setup(props, { emit }) {
    const dragDisabled = ref(false)
    const showDeleteArea = ref(false)
    const cloneEngineList = ref([] as any[])
    const cloneBackupEngineList = ref([] as any[])

    const tempIconLink = ref('')

    const engineDialogVisible = ref(false)

    const { t } = useI18n()

    onMounted(() => {
      cloneEngineList.value = JSON.parse(JSON.stringify(props.engineList))
      cloneBackupEngineList.value = JSON.parse(JSON.stringify(props.backupEngineList))
    })

    const handleDragChoose = (e: any) => {
      const { oldIndex } = e
      const { iconType } = cloneEngineList.value[oldIndex]
      if (iconType !== 'local') {
        showDeleteArea.value = true
      }
    }
    const handleDragUnchoose = async () => {
      await nextTick()
      showDeleteArea.value = false
    }
    const handleDragEnd = (e: any) => {
      const { originalEvent } = e
      let pointEl
      if (originalEvent.type === 'touchend') {
        const { clientX, clientY } = originalEvent.changedTouches[0]
        pointEl = document.elementFromPoint(clientX, clientY)
      } else {
        const { clientX, clientY } = originalEvent
        pointEl = document.elementFromPoint(clientX, clientY)
      }
      if (pointEl?.className === 'delete-area') {
        if (window.confirm(t('是否删除该自定义引擎'))) {
          const { newIndex } = e
          cloneEngineList.value.splice(newIndex, 1)
        }
      }
      emit('update', {
        engineList: cloneEngineList.value,
        backupEngineList: cloneBackupEngineList.value
      })
    }

    const state = reactive({
      formData: {
        _id: '',
        name: '',
        link: '',
        iconType: 'api',
        iconPath: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入引擎名称', trigger: 'blur' }],
        link: [{ required: true, message: '请输入引擎地址', trigger: 'blur' }],
        iconType: [{ required: true, message: '请选择图标类型', trigger: 'change' }],
        iconPath: [{ validator: checkIconPath, trigger: 'blur' }]
      }
    })
    function checkIconPath(rule: any, value: string, callback: any) {
      if (state.formData.iconType === 'network' && !value) {
        callback(new Error('请输入图标地址'))
      } else {
        callback()
      }
    }
    const form = ref()
    const showIconPreview = computed(() => {
      return (
        (state.formData.iconType === 'api' && state.formData.link) ||
        (state.formData.iconType === 'network' && state.formData.iconPath) ||
        (state.formData.iconType === 'text' && state.formData.name)
      )
    })
    const handleAddNewEngine = () => {
      state.formData = {
        _id: '',
        name: '',
        link: '',
        iconType: 'api',
        iconPath: ''
      }
      engineDialogVisible.value = true
    }
    const close = () => {
      form.value.resetFields()
      state.formData = {
        _id: '',
        name: '',
        link: '',
        iconType: 'api',
        iconPath: ''
      }
      engineDialogVisible.value = false
    }
    const submit = () => {
      form.value.validate(async (valid: boolean) => {
        if (valid) {
          if (state.formData.iconType === 'api' && tempIconLink.value) {
            try {
              const res = await fetch(
                `${apiURL}/api/icon?url=${encodeURIComponent(state.formData.link)}&type=link`
              )
              const iconPath = await res.text()
              if (iconPath) {
                state.formData.iconType = 'network'
                state.formData.iconPath = iconPath
              }
            } catch {
              //
            }
          }
          if (state.formData._id) {
            // 编辑
            const index = cloneEngineList.value.findIndex((item) => item._id === state.formData._id)
            if (~index) {
              cloneEngineList.value[index] = { ...toRaw(state.formData) }
            }
          } else {
            // 添加
            state.formData._id = uid()
            cloneEngineList.value.push({ ...toRaw(state.formData) })
          }
          emit('update', {
            engineList: cloneEngineList.value,
            backupEngineList: cloneBackupEngineList.value
          })
          close()
        } else {
          return false
        }
      })
    }

    const handleLinkInputBlur = () => {
      tempIconLink.value = getTargetIcon(state.formData.link)
    }

    const handleEditEngine = (item: any) => {
      const { _id, name, link, iconType, iconPath } = item
      if (iconType === 'local') return
      state.formData = { _id, name, link, iconType, iconPath }
      engineDialogVisible.value = true
    }

    return {
      engineDialogVisible,
      dragDisabled,
      showDeleteArea,
      cloneEngineList,
      cloneBackupEngineList,
      handleDragChoose,
      handleDragUnchoose,
      handleDragEnd,
      handleAddNewEngine,
      handleEditEngine,
      iconTypeList,
      state,
      form,
      showIconPreview,
      close,
      submit,
      getTargetIcon,
      tempIconLink,
      handleLinkInputBlur
    }
  }
})
</script>
<style lang="scss" scoped>
.warning {
  padding: 5px 10px;
  font-size: 12px;
  box-sizing: border-box;
  color: #ff933b;
  border: 1px solid #ffc392;
  background: rgb(245, 226, 205);
  border-radius: 3px;
  margin-bottom: 8px;
  line-height: 1.2;
}
.content {
  position: relative;
  .text {
    font-size: 14px;
    color: #778;
    margin: 0 10px;
  }
  .s-title {
    margin-bottom: 8px;
    padding-left: 4px;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      left: -8px;
      height: 16px;
      top: calc(50% - 8px);
      border-left: 4px solid $color-primary;
    }
  }
  .btn-add {
    position: absolute;
    right: 0;
    top: 4px;
    z-index: 99;
  }
}
.engine-list {
  display: flex;
  padding: 5px;
  flex-wrap: wrap;
  .engine-list-item {
    padding: 5px 0;
    cursor: pointer;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    user-select: none;
    .text {
      line-height: 18px;
      font-size: 12px;
      color: #889;
      width: 100%;
      text-align: center;
    }
    .no-icon {
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #abb;
      color: #fff;
      font-weight: bold;
      font-size: 16px;
    }
    &:hover {
      background: rgba(0,0,0,0.04);
    }
  }
}
.backup-engine-wrapper {
  position: relative;
  .delete-area {
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    justify-content: center;
    align-items: center;
    background: #cc4462;
    color: #fff;
    font-size: 14px;
  }
}
:deep(.el-radio-group .el-radio) {
  line-height: 32px;
}
.form-control {
  display: flex;
  align-items: center;
  .tips {
    font-size: 18px;
    margin-left: 8px;
    cursor: pointer;
  }
}
.icon-img-preview-box {
  display: flex;
  align-items: center;
  height: 32px;
  .icon-img-preview {
    width: 24px;
    height: 24px;
    background: #ccc;
  }
  .no-icon {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #abb;
    color: #fff;
    font-weight: bold;
    font-size: 16px;
  }
}
</style>
<style scoped>
.add-engine-dialog .dialog-body {
  padding: 0 20px !important;
}
</style>
