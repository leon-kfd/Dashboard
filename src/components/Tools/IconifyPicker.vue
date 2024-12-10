<template>
  <easy-dialog
    v-model="dialogVisible"
    :title="$t('图标选择器')"
    width="min(840px, 98vw)"
    height="min(580px, 90vh)"
    @close="close"
  >
    <div class="icon-page-wrapper">
      <div class="search-box flex-center-y">
        <el-input
          v-model="searchText"
          :placeholder="$t('请以英文输入搜索关键词, 例如: Github')"
          clearable
          @keyup.enter="onSearch"
          @clear="reset"
        />
        <button type="button" :class="['btn', 'btn-primary']" :disabled="!canSearch" @click="onSearch">
          {{ $t('搜索') }}
        </button>
      </div>
      <div class="result-wrapper">
        <div v-if="loading" class="loading">
          <div class="custom-loading">
            <span class="loader" />
          </div>
        </div>
        <div v-else-if="error" class="error">
          <p class="tips">
            - {{ $t('出现未知异常') }} - 
          </p>
        </div>
        <div v-else-if="!isNoResult && !searchResultList.length" class="default-text-tips">
          <!-- <div class="icon-wrapper">
            <img src="https://icon-sets.iconify.design/assets/logo-light.svg" alt="Logo">
            <img src="https://icon-sets.iconify.design/assets/logo-text-light.svg" alt="Logo">
          </div> -->
          <p class="tips">
            - {{ $t('图标库来源于Iconify在线服务，请输入英文关键词进行搜索') }} - 
          </p>
        </div>
        <div v-else-if="isNoResult" class="no-data">
          <p class="tips">
            - {{ $t('没有查找到相应图标') }} - 
          </p>
        </div>
        <div v-else-if="searchResultList.length" class="result-list">
          <div 
            v-for="item in searchResultList" 
            :key="item.name" 
            :class="['result-list-item', { active: item.name === activeIcon?.name }]"
            @click="onSelect(item)"
          >
            <svg 
              :name="item.name" 
              width="36" 
              height="36" 
              :viewBox="`${item.left} ${item.top} ${item.width} ${item.height}`" 
              v-html="item.body">
            </svg>
          </div>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="footer">
        <div class="color-setting">
          <template v-if="activeIcon">
            <div class="label">{{ $t('选择颜色') }}: </div>
            <el-color-picker v-model="colorSetting" :disabled="!isSingleColor"></el-color-picker>
            <div class="color-text">({{ isSingleColor ? colorSetting : '多色图标不可设置' }})</div>
          </template>
        </div>
        <div class="footer-buttom">
          <button type="button" class="btn" @click="closeDialog">
            {{ $t('取消') }}
          </button>
          <button type="button" class="btn btn-primary" :disabled="!activeIcon" @click="submit">
            {{ $t('确认') }}
          </button>
        </div>
      </div>
    </template>
  </easy-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { ref } from 'vue'
import request from '@/utils/request'
type IconBody = {
  width: number;
  height: number;
  top: number;
  left: number;
  body: string;
  name: string;
  prefix: string;
}

const apiTarget = `https://api.iconify.design`
const searchText = ref('')
const canSearch = computed(() => {
  return searchText.value.length > 1 && /^[A-Za-z0-9]*$/.test(searchText.value)
})
const searchResultList = ref<IconBody[]>([])
const isNoResult = ref(false)
const loading = ref(false)
const error = ref(false)
const reset = () => {
  error.value = false
  isNoResult.value = false
  searchText.value = ''
  searchResultList.value = []
  activeIcon.value = null
}
const onSearch = async () => {
  if (!canSearch.value) return
  isNoResult.value = false
  loading.value = true
  error.value = false
  try {
    const { total, collections, icons } = await request({ url: `${apiTarget}/search`, params: {
      query: searchText.value,
      limit: 100
    }})
    if (total < 1) {
      isNoResult.value = true
      searchResultList.value = []
      return
    }
    const collectionMap = Object.keys(collections).reduce((prev,curr) => {
      prev[curr] = []
      return prev
    }, {})
    icons.forEach((icon) => {
      const [c, i] = icon.split(':')
      if (collectionMap[c]) {
        collectionMap[c].push(i)
      }
    })
    const resultList = await Promise.all(Object.keys(collectionMap).map(key => {
      return request({ url: `${apiTarget}/${key}.json`, params: {
        icons: collectionMap[key].join(',')
      }})
    }))
    const iconSvgList: IconBody[] = []
    resultList.forEach(item => {
      const { width, height, icons, prefix, top, left } = item
      Object.keys(icons).map(key => {
        const _width = icons[key].width || width
        const _height = icons[key].height || height || collections[prefix]?.height || collections[prefix]?.displayHeight
        // 仅保留宽高相等的图标
        if (_width && _height && _width === _height) { 
          iconSvgList.push({
            width: _width,
            height: _height,
            top: icons[key].top || top || 0,
            left: icons[key].left || left || 0,
            body: icons[key].body,
            prefix,
            name: `${prefix}-${key}`
          })
        }
      })
    })
    searchResultList.value = iconSvgList
  } catch (e) {
    error.value = true
    console.error(e)
  } finally {
    loading.value = false
  }
}
const activeIcon = ref<IconBody | null>(null)
const onSelect = (item: IconBody) => {
  activeIcon.value = item
}

const colorSetting = ref('#262626')
const isSingleColor = computed(() => {
  return activeIcon.value && activeIcon.value.body.includes('currentColor')
})


let _resolve:(value?: unknown) => void
let _reject:(value?: unknown) => void

const dialogVisible = ref(false)

const show = async () => {
  dialogVisible.value = true
  reset()
  return new Promise((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
}

const closeDialog = () => {
  dialogVisible.value = false
}

const close = () => {
  _reject()
}

const submit = () => {
  if (!activeIcon.value) return
  const svgHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="${activeIcon.value.left} ${activeIcon.value.top} ${activeIcon.value.width} ${activeIcon.value.height}">${activeIcon.value.body}</svg>`
  const base64 = `data:image/svg+xml,${encodeURIComponent(svgHtml.replace(/currentColor/g, colorSetting.value))}`
  _resolve(base64)
  closeDialog()
}

defineExpose({
  show
})
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  border-top: 2px solid #eee;
  height: 48px;
  overflow: hidden;
  .color-setting {
    padding: 6px 0;
    display: flex;
    align-items: center;
    .label {
      font-size: 14px;
      color: #888;
      margin-right: 8px;
    }
    .color-text {
      font-size: 14px;
      color: #464646;
      margin-left: 8px;
    }
  }
}
.icon-page-wrapper {
  display: flex;
  flex-direction: column;
  height: 100%;
  .result-wrapper {
    height: 100%;
    flex: 1;
    overflow: auto;
    margin-top: 10px;
    .default-text-tips,
    .no-data,
    .loading,
    .error {
      display: flex;
      flex-direction: column;
      height: 100%;
      align-items: center;
      justify-content: center;
      .tips {
        font-size: 14px;
        color: #778872;
        // margin-top: 20px;
      }
    }
    .result-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px;
      .result-list-item {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #262626;
        border-radius: 4px;
        cursor: pointer;
        &.active {
          outline: 2px solid $color-primary;
        }
        &:not(.active):hover {
          background: rgba(0,0,0,0.1)
        }
      }
    }
  }
}
.icon-wrapper {
  height: 40px;
  overflow: hidden;
  display: flex;
  img {
    height: 40px;
    width: auto;
  }
}
</style>