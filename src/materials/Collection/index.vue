<template>
  <div class="wrapper material-collection" :style="{ ...positionCSS }">
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
              <svg class="icon" viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M231.08266667 509.49688889c-0.11377778 51.76888889-41.87022222 93.52533333-93.75288889 93.41155556-51.65511111-0.11377778-93.63911111-42.09777778-93.52533333-93.86666667 0-51.54133333 42.21155555-93.52533333 93.98044444-93.41155556 51.65511111 0.11377778 93.29777778 41.984 93.29777778 93.86666667z m656.49777778-93.75288889c51.76888889 0 93.86666667 41.87022222 93.86666666 93.52533333 0.11377778 51.65511111-41.87022222 93.75288889-93.63911111 93.75288889-51.88266667 0-93.75288889-41.64266667-93.75288889-93.52533333s41.64266667-93.75288889 93.52533334-93.75288889zM512.45511111 603.02222222c-51.65511111 0-93.98044445-42.43911111-93.75288889-93.75288889 0.34133333-51.76888889 42.21155555-93.52533333 93.98044445-93.52533333 51.65511111 0 93.86666667 42.21155555 93.63911111 93.75288889-0.11377778 51.65511111-42.09777778 93.52533333-93.86666667 93.52533333z"
                ></path>
              </svg>
            </div>
            <div v-if="!userSettingKeyMap[key]" class="plus-box">
              <svg class="icon" viewBox="0 0 1024 1024" width="20" height="20">
                <path
                  d="M896 469.333333H554.666667V128a42.666667 42.666667 0 0 0-85.333334 0v341.333333H128a42.666667 42.666667 0 0 0 0 85.333334h341.333333v341.333333a42.666667 42.666667 0 0 0 85.333334 0V554.666667h341.333333a42.666667 42.666667 0 0 0 0-85.333334z"
                ></path>
              </svg>
            </div>
            <div v-if="userSettingKeyMap[key]" class="icon-box">
              <img
                class="icon"
                :src="userSettingKeyMap[key].icon || getTargetIconV2(userSettingKeyMap[key].url)"
                alt="link"
                @error="handleImgError"
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
      <div class="keys-wrapper" style="width: 9.08%">
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
      width="300px"
      height="330px"
      closeOnClickOutside
      @close="handleDialogClose"
    >
      <div class="edit-content" v-show="editState.editingActive" @keydown.stop="">
        <div class="editing-key">{{ editState.editingInfo.key }}</div>
        <div class="row-input" :class="{ active: editState.editingInfo.url.length > 0 }">
          <input type="text" v-model="editState.editingInfo.url" />
          <div class="label">URL</div>
          <div class="line"></div>
        </div>
        <div class="row-input" :class="{ active: editState.editingInfo.remark.length > 0 }">
          <input type="text" v-model="editState.editingInfo.remark" />
          <div class="label">Remark</div>
          <div class="line"></div>
        </div>
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

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, reactive, ref, toRaw, unref } from 'vue'
import { keyboardMap } from './utils'
import { useStore } from '@/store'
import { coverAsync } from '@/utils'
import { getBase64ByAjax, getTargetIconV2 } from '@/utils/images'
import { mapPosition } from '@/plugins/position-selector'
import { useI18n } from 'vue-i18n'
export default defineComponent({
  name: 'Collection',
  props: {
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
  },
  setup(props) {
    const store = useStore()
    const userSettingKeyMap = computed(() => props.componentSetting.userSettingKeyMap || {})

    const positionCSS = computed(() => mapPosition(props.componentSetting.position))

    const { t } = useI18n()

    const editState = reactive({
      editingActive: false,
      editingInfo: {
        key: '',
        url: '',
        remark: ''
      }
    })

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
        dialogVisible.value = true
        editState.editingInfo.key = key
        setTimeout(() => {
          editState.editingActive = true
        }, 200)
      }
    }
    const handleDialogClose = () => {
      editState.editingInfo.key = ''
      editState.editingInfo.url = ''
      editState.editingInfo.remark = ''
      editState.editingActive = false
    }
    const showDialog = ($event: MouseEvent, key: string) => {
      dialogVisible.value = true
      editState.editingInfo.key = key
      const { url, remark } = userSettingKeyMap.value[key]
      editState.editingInfo.url = url
      editState.editingInfo.remark = remark
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
        let [err, icon] = await coverAsync(
          getBase64ByAjax(getTargetIconV2(editState.editingInfo.url))
        )
        if (err) {
          const url = new URL(editState.editingInfo.url)
          icon = `${url.origin}/favicon.ico`
        }
        const _userSettingKeyMap = JSON.parse(JSON.stringify(userSettingKeyMap.value))
        _userSettingKeyMap[editState.editingInfo.key] = {
          url: editState.editingInfo.url,
          remark: editState.editingInfo.remark,
          icon
        }
        updateUserSettingKeyMap(_userSettingKeyMap)
        setTimeout(() => {
          handleDialogClose()
          saveLoading.value = false
          dialogVisible.value = false
        }, 400)
      } else {
        window.alert(t('URL地址不正确'))
      }
    }
    const handleImgError = (e: any) => {
      const el = e.currentTarget
      el.style.visibility = 'hidden'
      el.nextElementSibling.style.visibility = 'inherit'
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

    return {
      keyboardMap,
      userSettingKeyMap,
      handleKeyClick,
      handleDialogClose,
      showDialog,
      editState,
      clearEidtInfo,
      handleImgError,
      handleUserKeySave,
      saveLoading,
      dialogVisible,
      positionCSS,
      getTargetIconV2
    }
  }
})
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
          font-size: 15px;
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
            fill: #9a9aa0;
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
          right: 2px;
          top: 2px;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: space-around;
          z-index: 2;
          svg path {
            fill: #262626;
          }
          &:hover {
            background: #f5f5f7da;
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
      top: 7px;
      left: 5px;
      font-size: 18px;
      color: #767682;
      font-weight: bold;
      pointer-events: none;
      transition: all 0.4s;
    }
    input:focus + .label {
      transform: translate(-8px, -22px) scale(0.8);
      font-weight: bold;
      color: $color-primary;
      transition: all 0.4s;
    }
    &.active .label {
      transform: translate(-8px, -22px) scale(0.8);
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
</style>
