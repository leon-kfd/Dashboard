<template>
  <div class="wrapper">
    <div class="export">
      <div class="title">配置数据导出</div>
      <el-form label-width="80px" label-position="top">
        <el-form-item label="导出方式">
          <el-radio-group v-model="exportType">
            <el-radio :label="1">生成随机密钥</el-radio>
            <el-radio :label="2">导出JSON文件</el-radio>
          </el-radio-group>
          <div class="gen-key-wrapper" v-if="exportType === 1">
            <button
              type="button"
              class="btn btn-primary"
              style="margin: 0 0 4px"
              @click="genExportKey"
              :loading="genExportKeyLoading">生成密钥</button>
            <div v-if="exportKey" class="key-wrapper">
              <span class="export-key">{{exportKey}}</span>
              <button type="button" class="btn btn-small btn-primary" style="margin: 0" @click="handleCopyExportKey">复制</button>
            </div>
          </div>
          <div class="json-wrapper" v-if="exportType === 2">
            <button type="button" class="btn btn-primary" style="margin: 0 0 4px" @click="handleExportJson">导出JSON</button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <hr class="hr">
    <div class="import">
      <div class="title">配置数据导入</div>
      <el-form label-width="80px" label-position="top">
        <el-form-item label="导入方式">
          <el-radio-group v-model="importType">
            <el-radio :label="1">使用随机密钥</el-radio>
            <el-radio :label="2">导入JSON文件</el-radio>
          </el-radio-group>
          <div class="import-key-wrapper" v-if="importType === 1">
            <input
              type="text"
              class="import-control"
              v-model="importKey"
              maxlength="5"
              placeholder="KEY">
            <button
              type="button"
              class="btn btn-primary"
              :disabled="importKey.length !== 5"
              @click="handleImport"
              :loading="importKeyLoading">确定</button>
          </div>
          <div class="json-wrapper" v-if="importType === 2">
            <button type="button" class="btn btn-primary" style="margin-left: 0;" @click="handleUploadJSON">上传JSON文件</button>
            <input type="file" accept=".json" style="display: none;" ref="jsonRef">
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'
import md5 from 'js-md5'
import { saveAs } from 'file-saver'
import { apiURL } from '@/global'
import { ajaxPost, execCopy } from '@/utils'
import { ElNotification } from 'element-plus';
export default defineComponent({
  name: 'ImportExport',
  props: {
    visible: {
      type: Boolean
    }
  },
  setup(props) {
    const store = useStore()
    const exportType = ref(1)
    const exportKey = ref('')
    const importType = ref(1)
    const importKey = ref('')
    const genExportKeyLoading = ref(false)
    const importKeyLoading = ref(false)
    const jsonRef = ref()

    watch(() => props.visible, (val) => {
      if (val) {
        exportKey.value = ''
      }
    })

    const genExportKey = async () => {
      const { list, affix, global, showBackgroundEffect, showRefreshBtn, tabList, showTabSwitchBtn, enableKeydownSwitchTab } = store.state
      genExportKeyLoading.value = true
      try {
        const dataToString = JSON.stringify({ list, affix, global, showBackgroundEffect, showRefreshBtn, tabList, showTabSwitchBtn, enableKeydownSwitchTab })
        const toMd5 = md5(dataToString)
        const format = parseInt(`0x${toMd5}`, 16).toString(36).toUpperCase().slice(0, 5)
        const { errCode } = await ajaxPost(`${apiURL}/saveExport`, {
          exportKey: format,
          exportValue: dataToString
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
        window.alert('生成密钥失败')
      } finally {
        genExportKeyLoading.value = false
      }
    }

    const handleCopyExportKey = () => {
      if (execCopy(exportKey.value)) {
        ElNotification({
          title: '提示',
          type: 'success',
          message: '密钥复制成功，请在其他设备导入密钥进行配置同步'
        })
      }
    }

    const handleExportJson = () => {
      try {
        const { list, affix, global, showBackgroundEffect, showRefreshBtn, tabList, showTabSwitchBtn, enableKeydownSwitchTab } = store.state
        const dataToString = JSON.stringify({ list, affix, global, showBackgroundEffect, showRefreshBtn, tabList, showTabSwitchBtn, enableKeydownSwitchTab }, null, 2)
        saveAs(new Blob([dataToString], { type: 'application/json,charset=utf-8;' }), 'Dashboard.json')
      } catch (e) {
        console.error(e)
      }
    }

    const updateConfig = (data: any) => {
      const { list, affix, global, showBackgroundEffect, showRefreshBtn, tabList, showTabSwitchBtn, enableKeydownSwitchTab } = data
      store.dispatch('updateStates', [
        { key: 'tabList', value: tabList },
        { key: 'list', value: list },
        { key: 'affix', value: affix },
        { key: 'showBackgroundEffect', value: showBackgroundEffect },
        { key: 'showRefreshBtn', value: showRefreshBtn },
        { key: 'showTabSwitchBtn', value: showTabSwitchBtn },
        { key: 'enableKeydownSwitchTab', value: enableKeydownSwitchTab }
      ])
      store.dispatch('updateGlobal', global)
      ElNotification({
        title: '提示',
        type: 'success',
        message: '导入配置成功'
      })
    }

    const handleImport = async () => {
      if (/^[0-9A-Z]{5}$/.test(importKey.value)) {
        importKeyLoading.value = true
        try {
          const { errCode, data, message } = await ajaxPost(`${apiURL}/getImport`, { importKey: importKey.value })
          if (errCode === 200) {
            const importValue = JSON.parse(data)
            if (confirm('已找到相应同步配置，配置会覆盖本地浏览器历史数据，是否继续？')) {
              updateConfig(importValue)
            }
          } else {
            throw new Error(message)
          }
        } catch (e) {
          ElNotification({
            title: '异常',
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
            title: '异常',
            type: 'error',
            message: '识别文件错误，请检查文件'
          })
        }
        const el = e.currentTarget
        if (el) {
          const { files } = el as any
          const reader = new FileReader()
          reader.readAsText(files[0], 'UTF-8');
          reader.onload = (e1) => {
            const jsonFileData = e1.target?.result
            try {
              const json = JSON.parse(jsonFileData as any)
              if (confirm('设别文件成功，配置会覆盖本地浏览器历史数据，是否继续？')) {
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

    return {
      exportType,
      exportKey,
      importType,
      importKey,
      genExportKeyLoading,
      importKeyLoading,
      genExportKey,
      handleCopyExportKey,
      handleExportJson,
      handleImport,
      handleUploadJSON,
      jsonRef
    }
  }
})
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
        content: "";
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
  :deep {
    .el-form-item__label {
      padding-bottom: 0;
    }
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
