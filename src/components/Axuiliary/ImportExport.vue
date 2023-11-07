<template>
  <div class="wrapper">
    <div class="export">
      <div class="title">{{$t('配置数据导出')}}</div>
      <el-form label-width="80px" label-position="top">
        <el-form-item :label="$t('导出方式')">
          <el-radio-group v-model="exportType">
            <el-radio :label="1">{{$t('生成随机密钥')}}</el-radio>
            <el-radio :label="2">{{$t('导出JSON文件')}}</el-radio>
          </el-radio-group>
          <div class="gen-key-wrapper" v-if="exportType === 1">
            <button
              type="button"
              class="btn btn-primary"
              style="margin: 0 0 4px"
              @click="genExportKey"
              :loading="genExportKeyLoading"
            >
              {{$t('生成密钥')}}
            </button>
            <div v-if="exportKey" class="key-wrapper">
              <span class="export-key">{{ exportKey }}</span>
              <button
                type="button"
                class="btn btn-small btn-primary"
                style="margin: 0"
                @click="handleCopyExportKey"
              >
                {{$t('复制')}}
              </button>
            </div>
            <el-alert
              v-if="exportKey"
              :title="$t('exportExpireTips')"
              type="warning"
              :closable="false"
              style="padding: 0 4px;margin-top: 8px"
            />
          </div>
          <div class="json-wrapper" v-if="exportType === 2">
            <button
              type="button"
              class="btn btn-primary"
              style="margin: 0 0 4px"
              @click="handleExportJson"
            >
              {{$t('导出JSON')}}
            </button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <hr class="hr" />
    <div class="import">
      <div class="title">{{$t('配置数据导入')}}</div>
      <el-form label-width="80px" label-position="top">
        <el-form-item :label="$t('导入方式')">
          <el-radio-group v-model="importType">
            <el-radio :label="1">{{$t('使用随机密钥')}}</el-radio>
            <el-radio :label="2">{{$t('导入JSON文件')}}</el-radio>
          </el-radio-group>
          <div class="import-key-wrapper" v-if="importType === 1">
            <input
              type="text"
              class="import-control"
              v-model="importKey"
              maxlength="5"
              placeholder="KEY"
            />
            <button
              type="button"
              class="btn btn-primary"
              :disabled="importKey.length !== 5"
              @click="handleImport"
              :loading="importKeyLoading"
            >
              {{$t('确定')}}
            </button>
          </div>
          <div class="json-wrapper" v-if="importType === 2">
            <button
              type="button"
              class="btn btn-primary"
              style="margin-left: 0"
              @click="handleUploadJSON"
            >
              {{$t('上传JSON文件')}}
            </button>
            <input type="file" accept=".json" style="display: none" ref="jsonRef" />
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useStore } from '@/store'
import md5 from 'js-md5'
import { saveAs } from 'file-saver'
import { apiURL } from '@/global'
import { ajaxPost, execCopy } from '@/utils'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { zip, unzip } from '@/utils/gzip'

const props = defineProps({
  visible: {
    type: Boolean
  }
})
const store = useStore()
const exportType = ref(1)
const exportKey = ref('')
const importType = ref(1)
const importKey = ref('')
const genExportKeyLoading = ref(false)
const importKeyLoading = ref(false)
const jsonRef = ref()

const { t } = useI18n()

watch(
  () => props.visible,
  (val) => {
    if (val) {
      exportKey.value = ''
    }
  }
)

const genExportKey = async () => {
  const {
    list,
    affix,
    global,
    showBackgroundEffect,
    showRefreshBtn,
    tabList,
    showTabSwitchBtn,
    enableKeydownSwitchTab
  } = store
  genExportKeyLoading.value = true
  try {
    const dataToString = JSON.stringify({
      list,
      affix,
      global,
      showBackgroundEffect,
      showRefreshBtn,
      tabList,
      showTabSwitchBtn,
      enableKeydownSwitchTab
    })
    const zipData = zip(dataToString)
    const toMd5 = md5(zipData)
    const format = parseInt(`0x${toMd5}`, 16).toString(36).toUpperCase().slice(0, 5)

    const { errCode } = await ajaxPost(`${apiURL}/saveExport`, {
      exportKey: format,
      exportValue: zipData
    })
    if (errCode === 200) {
      exportKey.value = format
    } else {
      exportKey.value = ''
      throw new Error('上传配置失败')
    }
  } catch (e) {
    //
    console.error(e)
    window.alert(t('生成密钥失败'))
  } finally {
    genExportKeyLoading.value = false
  }
}

const handleCopyExportKey = () => {
  if (execCopy(exportKey.value)) {
    ElNotification({
      title: t('提示'),
      type: 'success',
      message: t('密钥复制成功，请在其他设备导入密钥进行配置同步')
    })
  }
}

const handleExportJson = () => {
  try {
    const {
      list,
      affix,
      global,
      showBackgroundEffect,
      showRefreshBtn,
      tabList,
      showTabSwitchBtn,
      enableKeydownSwitchTab,
      backgroundEffectActive
    } = store
    const dataToString = JSON.stringify(
      {
        list,
        affix,
        global,
        showBackgroundEffect,
        showRefreshBtn,
        tabList,
        showTabSwitchBtn,
        enableKeydownSwitchTab,
        backgroundEffectActive
      },
      null,
      2
    )
    saveAs(
      new Blob([dataToString], { type: 'application/json,charset=utf-8;' }),
      'Dashboard.json'
    )
  } catch (e) {
    console.error(e)
  }
}

const updateConfig = (data: any) => {
  const {
    list,
    affix,
    global,
    showBackgroundEffect,
    showRefreshBtn,
    tabList,
    showTabSwitchBtn,
    enableKeydownSwitchTab,
    backgroundEffectActive
  } = data
  store.updateStates([
    { key: 'tabList', value: tabList },
    { key: 'list', value: list },
    { key: 'affix', value: affix },
    { key: 'showBackgroundEffect', value: showBackgroundEffect },
    { key: 'showRefreshBtn', value: showRefreshBtn },
    { key: 'showTabSwitchBtn', value: showTabSwitchBtn },
    { key: 'enableKeydownSwitchTab', value: enableKeydownSwitchTab },
    { key: 'backgroundEffectActive', value: backgroundEffectActive }
  ])
  store.updateGlobal(global)
  ElNotification({
    title: t('提示'),
    type: 'success',
    message: t('导入配置成功')
  })
}

const handleImport = async () => {
  if (/^[0-9A-Z]{5}$/.test(importKey.value)) {
    importKeyLoading.value = true
    try {
      const { errCode, data, message } = await ajaxPost(`${apiURL}/getImport`, {
        importKey: importKey.value
      })
      if (errCode === 200) {
        const result = unzip(data)
        const importValue = JSON.parse(result)
        if (confirm(t('已找到相应同步配置，配置会覆盖本地浏览器历史数据，是否继续？'))) {
          updateConfig(importValue)
        }
      } else {
        throw new Error(message)
      }
    } catch (e) {
      ElNotification({
        title: t('异常'),
        type: 'error',
        message: (e as Error).toString()
      })
    } finally {
      importKeyLoading.value = false
    }
  }
}

const handleUploadJSON = () => {
  jsonRef.value.click()
  jsonRef.value.onchange = (e: InputEvent) => {
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
      reader.readAsText(files[0], 'UTF-8')
      reader.onload = (e1) => {
        const jsonFileData = e1.target?.result
        try {
          const json = JSON.parse(jsonFileData as any)
          if (confirm(t('设别文件成功，配置会覆盖本地浏览器历史数据，是否继续？'))) {
            updateConfig(json)
          }
        } catch {
          errorHandler()
        }
      }
      reader.onerror = () => errorHandler()
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 10px;
  .export,
  .import {
    .title {
      color: $color-grey1;
      margin-bottom: 8px;
      position: relative;
      font-weight: bold;
      display: inline-block;
      &:after {
        position: absolute;
        content: '';
        left: 0;
        width: 100%;
        bottom: 0;
        height: 8px;
        background: rgba(233, 174, 49, 0.2);
      }
    }
    .gen-key-wrapper,
    .json-wrapper,
    .import-key-wrapper {
      margin: 10px 0;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      .export-key {
        font-weight: bold;
        margin: 0 4px;
        font-size: 20px;
        color: $color-dark;
        padding: 0 4px;
      }
      .key-wrapper {
        display: flex;
        align-items: center;
        margin-bottom: 4px;
      }
    }
    .gen-key-wrapper,
    .json-wrapper {
      width: 100%;
    }
    .import-key-wrapper {
      .import-control {
        height: 30px;
        padding: 0 10px;
        border: 2px solid #bbb;
        border-radius: none;
        box-shadow: none;
        outline: none;
        display: inline-flex;
        align-items: center;
        box-sizing: border-box;
        font-size: 16px;
        font-weight: bold;
        color: $color-dark;
        width: 120px;
        &:focus {
          border: 2px solid $color-primary;
        }
      }
    }
  }
  :deep(.el-form-item__label) {
    padding-bottom: 0;
  }
}
.hr {
  margin: 20px 0;
  border: 1px solid #ccc;
}
::-webkit-input-placeholder {
  color: rgb(197, 194, 194);
}
</style>
