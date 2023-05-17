<template>
  <div
    class="wrapper material-collection"
    :style="{
      ...positionCSS,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily
    }"
  >
    <div class="keyboard-mode" :style="{ maxWidth: componentSetting.keyboardMaxWidth + 'px' }">
      <div
        class="keys-wrapper"
        v-for="(item, key) in keyboardMap"
        :key="key"
        :class="{ hidden: item.span }"
        :style="{
          width: `${item.span ? item.span * 4.5 : 9}%`,
          padding: `${componentSetting.keyGutter}px`
        }"
      >
        <div
          class="keys-box"
          @click="handleKeyClick($event, key)"
          :style="{
            background: componentSetting.keyBackground,
            borderRadius: componentSetting.keyBorderRadius
          }"
        >
          <div class="keys">
            <div class="keys-name">{{ key }}</div>
            <div
              v-if="userSettingKeyMap[key]"
              class="edit-icon-box"
              @click.stop="showDialog($event, key)"
            >
              <svg viewBox="0 0 24 24" width="12" height="12">
                <path d="M4.5 10.5C3.675 10.5 3 11.175 3 12C3 12.825 3.675 13.5 4.5 13.5C5.325 13.5 6 12.825 6 12C6 11.175 5.325 10.5 4.5 10.5ZM19.5 10.5C18.675 10.5 18 11.175 18 12C18 12.825 18.675 13.5 19.5 13.5C20.325 13.5 21 12.825 21 12C21 11.175 20.325 10.5 19.5 10.5ZM12 10.5C11.175 10.5 10.5 11.175 10.5 12C10.5 12.825 11.175 13.5 12 13.5C12.825 13.5 13.5 12.825 13.5 12C13.5 11.175 12.825 10.5 12 10.5Z"></path>
              </svg>
            </div>
            <div v-if="!userSettingKeyMap[key]" class="plus-box">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
              </svg>
            </div>
            <div v-if="userSettingKeyMap[key]" class="icon-box">
              <img
                class="icon"
                :src="userSettingKeyMap[key].icon || getTargetIconV2(userSettingKeyMap[key].url)"
                alt="link"
                @error="handleImgError($event, key)"
              />
              <div class="no-icon" style="visibility: hidden">
                {{ userSettingKeyMap[key].remark.slice(0, 1) }}
              </div>
            </div>
            <div v-if="userSettingKeyMap[key] && userSettingKeyMap[key].remark" class="mark-text">
              {{ userSettingKeyMap[key].remark }}
            </div>
          </div>
        </div>
      </div>
      <div class="keys-wrapper" :style="{ width: '9.08%', padding: `${componentSetting.keyGutter}px` }">
        <div
          class="keys-box"
          :style="{
            background: componentSetting.keyBackground,
            borderRadius: componentSetting.keyBorderRadius
          }"
        >
          <div class="keys"></div>
        </div>
      </div>
    </div>
    <easy-dialog
      v-model="dialogVisible"
      width="400px"
      height="400px"
      closeOnClickOutside
      @close="handleDialogClose"
    >
      <div class="edit-content" v-show="editState.editingActive" @keydown.stop="">
        <div class="editing-key">{{ editState.editingInfo.key }}</div>
        <el-form ref="form" label-width="110px">
          <el-form-item :label="$t('网站地址')">
            <el-input v-model="editState.editingInfo.url" :placeholder="$t('请输入网站地址')" @blur="onBlurNetURL"/>
          </el-form-item>
          <el-form-item :label="$t('网站名称')">
            <el-input v-model="editState.editingInfo.remark" :placeholder="$t('请输入网站名称')" />
          </el-form-item>
          <el-form-item :label="$t('网站图标')">
            <el-radio-group v-model="editState.editingInfo.iconType" @change="onChangeIconType">
              <el-radio v-for="item in iconTypeList" :label="item.value" :key="item.value">{{$t(item.label)}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('图标地址')" v-if="editState.editingInfo.iconType === 'network'">
            <el-input v-model="editState.editingInfo.iconLink" :placeholder="$t('请输入图标地址')" @blur="onBlurIconLink"></el-input>
          </el-form-item>
          <el-form-item :label="$t('图标预览')">
            <div class="icon-img-preview-box">
              <img v-if="iconPreview" :src="iconPreview" alt="icon-preview" />
            </div>
          </el-form-item>
        </el-form>
      </div>
      <template #footer>
        <div class="footer" style="text-align: right; padding: 12px">
          <button
            type="button"
            class="btn"
            :disabled="!editState.editingInfo.url && !editState.editingInfo.remark"
            @click="clearEidtInfo"
          >
            {{$t('清空')}}
          </button>
          <button
            type="button"
            class="btn btn-primary"
            :loading="saveLoading"
            @click="handleUserKeySave"
          >
            {{$t('确认')}}
          </button>
        </div>
      </template>
    </easy-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, reactive, ref, toRaw, unref } from 'vue'
import { keyboardMap } from './utils'
import { useStore } from '@/store'
import { getBase64ByAjax, getTargetIconV2 } from '@/utils/images'
import { mapPosition } from '@/plugins/position-selector'
import { useI18n } from 'vue-i18n'
const props = defineProps({
  componentSetting: {
    type: Object,
    required: true
  },
  element: {
    type: Object,
    required: true
  },
  isAction: {
    type: Boolean,
    default: false
  }
})
const store = useStore()
const userSettingKeyMap = computed(() => props.componentSetting.userSettingKeyMap || {})

const positionCSS = computed(() => mapPosition(props.componentSetting.position))

const { t } = useI18n()

const iconTypeList = [
  {
    label: 'API获取',
    value: 'api'
  },
  {
    label: '网络图片',
    value: 'network'
  }
]

const editState = reactive({
  editingActive: false,
  editingInfo: {
    key: '',
    url: '',
    remark: '',
    iconType: 'api',
    iconLink: ''
  }
})

const iconPreview = ref('')

const handleKeyboardKeydown = (e: KeyboardEvent) => {
  if (!props.componentSetting.useKeyboardEvent) return
  if (!store.isLock) return
  if (
    document.querySelector('input:focus') ||
    document.querySelector('textarea:focus') ||
    document.querySelector('.ProseMirror-focused') ||
    document.querySelector('.action-popover')
  ) {
    return
  }
  const keyCode = e.keyCode
  const key = Object.keys(keyboardMap).find((key) => keyboardMap[key].keyCode === keyCode)
  if (key && userSettingKeyMap.value[key]) {
    pageJumpTo(userSettingKeyMap.value[key].url)
  }
}
onMounted(() => {
  document.addEventListener('keydown', handleKeyboardKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardKeydown)
})

const dialogVisible = ref(false)
const handleKeyClick = ($event: MouseEvent, key: string) => {
  if (key && userSettingKeyMap.value[key]) {
    pageJumpTo(userSettingKeyMap.value[key].url)
  } else {
    // dialogVisible.value = true
    // editState.editingInfo.key = key
    // setTimeout(() => {
    //   editState.editingActive = true
    // }, 200)
    showDialog($event, key)
  }
}
const handleDialogClose = () => {
  editState.editingInfo.key = ''
  editState.editingInfo.url = ''
  editState.editingInfo.remark = ''
  editState.editingInfo.iconType = 'api'
  editState.editingInfo.iconLink = ''
  editState.editingActive = false
}
const showDialog = ($event: MouseEvent, key: string) => {
  dialogVisible.value = true
  editState.editingInfo.key = key
  const { url, remark, iconType, iconLink } = userSettingKeyMap.value[key] || {}
  editState.editingInfo.url = url
  editState.editingInfo.remark = remark
  editState.editingInfo.iconType = iconType || 'api'
  editState.editingInfo.iconLink = iconLink
  onChangeIconType()
  setTimeout(() => {
    editState.editingActive = true
  }, 200)
}
const clearEidtInfo = () => {
  if (editState.editingInfo.url && editState.editingInfo.remark) {
    if (confirm(t('确定清除该按键绑定的网页吗?'))) {
      editState.editingInfo.url = ''
      editState.editingInfo.remark = ''
      const _userSettingKeyMap = unref(userSettingKeyMap)
      delete _userSettingKeyMap[editState.editingInfo.key]
      updateUserSettingKeyMap(_userSettingKeyMap)
      handleDialogClose()
      dialogVisible.value = false
    }
  }
}

const onBlurNetURL = () => {
  if (editState.editingInfo.url && editState.editingInfo.iconType === 'api') {
    iconPreview.value = getTargetIconV2(editState.editingInfo.url)
  }
}
const onBlurIconLink = () => {
  if (editState.editingInfo.url && editState.editingInfo.iconType === 'network') {
    iconPreview.value = editState.editingInfo.iconLink
  }
}
const onChangeIconType = () => {
  iconPreview.value = ''
  onBlurNetURL()
  onBlurIconLink()
}

const saveLoading = ref(false)
const handleUserKeySave = async () => {
  if (!editState.editingInfo.url || !editState.editingInfo.remark) return
  if (/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(editState.editingInfo.url)) {
    if (
      !/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(
        editState.editingInfo.url
      )
    ) {
      editState.editingInfo.url = 'https://' + editState.editingInfo.url
    }
    saveLoading.value = true
    let icon = ''
    if (editState.editingInfo.iconType === 'network') {
      icon = editState.editingInfo.iconLink
    } else {
      try {
        icon = await getBase64ByAjax(getTargetIconV2(editState.editingInfo.url))
      } catch {
        //
        icon = getTargetIconV2(editState.editingInfo.url)
      }
      editState.editingInfo.iconType = 'api'
    }
    const _userSettingKeyMap = JSON.parse(JSON.stringify(userSettingKeyMap.value))
    _userSettingKeyMap[editState.editingInfo.key] = {
      url: editState.editingInfo.url,
      remark: editState.editingInfo.remark,
      icon,
      iconType: editState.editingInfo.iconType,
      iconLink: editState.editingInfo.iconLink
    }
    updateUserSettingKeyMap(_userSettingKeyMap)
    resetImgError(editState.editingInfo.key)
    setTimeout(() => {
      handleDialogClose()
      saveLoading.value = false
      dialogVisible.value = false
    }, 400)
  } else {
    window.alert(t('URL地址不正确'))
  }
}
const handleImgError = (e: any, key: string) => {
  const el = e.currentTarget
  el.classList.add(`has-error-${key}`)
  el.style.visibility = 'hidden'
  el.nextElementSibling.style.visibility = 'inherit'
}
const resetImgError = (key: string) => {
  const el = document.querySelector(`.material-collection img.has-error-${key}`) as HTMLElement
  if (el) {
    el.classList.remove(`has-error-${key}`)
    el.style.visibility = 'visible';
    (el.nextElementSibling as HTMLElement).style.visibility = 'hidden'
  }
}

const updateUserSettingKeyMap = (_userSettingKeyMap: Record<string, any>) => {
  const element = JSON.parse(JSON.stringify(toRaw(props.element)))
  if (props.isAction) {
    element.actionSetting.actionClickValue.componentSetting.userSettingKeyMap =
      _userSettingKeyMap
    store.updateActionElement(element)
  } else {
    element.componentSetting.userSettingKeyMap = _userSettingKeyMap
  }
  store.editComponent(element)
}

const pageJumpTo = (target: string) => {
  if (props.componentSetting.jumpType === 2) {
    window.location.href = target
  } else {
    window.open(target)
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  position: relative;
}
.keyboard-mode {
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  overflow: hidden;
  position: relative;
  max-width: 1080px;
  min-width: 720px;
  .keys-wrapper {
    box-sizing: border-box;
    padding: 8px;
    .keys-box {
      width: 100%;
      padding-bottom: 100%;
      background: rgba(255, 255, 255, 0.9);
      position: relative;
      border-radius: 4px;
      cursor: pointer;
      box-shadow: 0 0 5px #767676;
      transition: box-shadow 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
      overflow: hidden;
      user-select: none;
      &.is-open {
        visibility: hidden;
      }
      &:hover {
        box-shadow: 0 0 10px #767676;
        transition: all 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
      }
      .keys {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        .keys-name {
          position: absolute;
          top: 4px;
          left: 4px;
          font-weight: bold;
          font-size: 12px;
          color: #262626;
        }
        .icon-box,
        .plus-box {
          position: absolute;
          width: 50%;
          height: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: space-around;
        }
        .icon-box {
          top: calc(50% - 5px);
          border-radius: 50%;
          position: relative;
          display: block;
          .icon {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 84%;
            height: 84%;
            transform: translate(-50%, -50%);
            z-index: 99;
          }
          .no-icon {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: #abb;
            color: #fff;
            font-weight: bold;
            font-size: 16px;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
        .plus-box {
          top: 50%;
          svg path {
            fill: #aaa;
          }
        }
        .mark-text {
          position: absolute;
          width: 100%;
          bottom: 4px;
          line-height: 20px;
          text-align: center;
          padding: 0 6px;
          height: 20px;
          font-size: 12px;
          color: #363636;
          font-weight: 500;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
        .edit-icon-box {
          position: absolute;
          right: 1px;
          top: 1px;
          border-radius: 4px;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 2;
          svg path {
            fill: #464646;
          }
          &:hover {
            background: rgba(0,0,0,0.04);
          }
        }
      }
    }
    &.hidden {
      .keys-box {
        height: 0;
        padding-bottom: 0;
        visibility: hidden;
      }
    }
  }
}
.edit-content {
  overflow: hidden;
  padding-right: 20px;
  .editing-key {
    font-size: 36px;
    font-weight: bold;
    padding-top: 10px;
    padding-bottom: 15px;
  }
  .row-input {
    margin: 35px 0;
    position: relative;
    input {
      width: 100%;
      box-sizing: border-box;
      outline: none;
      border: none;
      height: 32px;
      line-height: 32px;
      box-shadow: 0 2px 0 #ccc;
      padding: 0 4px;
      font-size: 18px;
      color: #363640;
      appearance: none;
      border-radius: 0;
    }
    .label {
      position: absolute;
      top: 3px;
      left: 5px;
      font-size: 18px;
      color: #767682;
      font-weight: bold;
      pointer-events: none;
      transition: all 0.4s;
    }
    input:focus + .label {
      transform: translate(-8px, -24px) scale(0.8);
      font-weight: bold;
      color: $color-primary;
      transition: all 0.4s;
    }
    &.active .label {
      transform: translate(-8px, -24px) scale(0.8);
      font-weight: bold;
      color: #262626;
      transition: all 0.4s;
    }
    .line {
      position: absolute;
      left: 0;
      width: 100%;
      border-bottom: 2px solid $color-primary;
      transform: scale(0);
      transition: transform 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
    input:focus ~ .line {
      transform: scale(1);
      transition: transform 0.4s cubic-bezier(0.075, 0.82, 0.165, 1);
    }
  }
}
.icon-img-preview-box {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: #f2f2f2;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 24px;
    height: 24px;
  }
}
</style>
