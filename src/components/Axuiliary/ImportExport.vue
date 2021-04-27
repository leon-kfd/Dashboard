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
              style="margin-left: 0;"
              @click="genExportKey"
              :loading="genExportKeyLoading">生成密钥</button>
            <template v-if="exportKey">
              <span class="export-key">{{exportKey}}</span>
              <button type="button" class="btn btn-small btn-primary" @click="handleCopyExportKey">复制</button>
            </template>
          </div>
          <div class="json-wrapper" v-if="exportType === 2">
            <button type="button" class="btn btn-primary" style="margin-left: 0;" @click="handleExportJson">导出JSON</button>
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
              placeholder="Enter the KEY">
            <button type="button" class="btn btn-primary" :disabled="!importKey">确定</button>
          </div>
          <div class="json-wrapper" v-if="importType === 2">
            <button type="button" class="btn btn-primary" style="margin-left: 0;">上传JSON文件</button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import md5 from 'js-md5'
import { saveAs } from 'file-saver'
import { apiURL } from '@/global'
import { ajaxPost, execCopy } from '@/utils'
export default defineComponent({
  name: 'ImportExport',
  setup() {
    const store = useStore()
    const exportType = ref(1)
    const exportKey = ref('')
    const importType = ref(1)
    const importKey = ref('')
    const genExportKeyLoading = ref(false)
    const genExportKey = async () => {
      const { list, affix, global } = store.state
      genExportKeyLoading.value = true
      try {
        const dataToString = JSON.stringify({ list, affix, global })
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
        window.alert('复制密钥成功')
      }
    }

    const handleExportJson = () => {
      try {
        const { list, affix, global } = store.state
        const dataToString = JSON.stringify({ list, affix, global }, null, 2)
        saveAs(new Blob([dataToString], { type: 'application/json,charset=utf-8;' }), 'Dashboard.json')
      } catch (e) {
        console.error(e)
      }
    }

    return {
      exportType,
      exportKey,
      importType,
      importKey,
      genExportKeyLoading,
      genExportKey,
      handleCopyExportKey,
      handleExportJson
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
      color: $--color-grey1;
      margin-bottom: 8px;
    }
    .gen-key-wrapper,
    .json-wrapper,
    .import-key-wrapper {
      margin: 10px 0;
      display: flex;
      align-items: center;
      .export-key {
        font-weight: bold;
        margin: 0 4px 0 12px;
        font-size: 20px;
        color: $--color-dark;
      }
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
        color: $--color-dark;
        &:focus {
          border: 2px solid $--color-primary;
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
