<template>
  <button
    type="button"
    class="btn btn-primary btn-small"
    :disabled="formatList.length < 2"
    style="margin: 0;margin-bottom: 10px;"
    @click="handleOpenSelector">
    {{$t('查看个人壁纸库')}}
  </button>
  <easy-dialog
    v-model="dialogVisible"
    :title="$t('个人壁纸库')"
    width="min(760px, 94vw)"
    height="min(540px, 80vh)"
    @close="onClose"
  >
    <div class="main-wrapper">
      <div class="operation-btn-wrapper">
        <div v-if="!isBatchMode">
          <button type="button" class="btn btn-primary btn-small" @click="onImport">{{$t('导入')}}</button>
          <button type="button" class="btn btn-primary btn-small" @click="onExport">{{$t('导出')}}</button>
          <input
            v-if="refreshInputFlag"
            type="file"
            accept=".json"
            style="display: none"
            ref="jsonRef"
          />
        </div>
        <div class="w-full">
          <template v-if="isBatchMode">
            <button type="button" class="btn btn-small" @click="onBatchCancel">{{$t('取消')}}</button>
            <button type="button" class="btn btn-danger btn-small" :disabled="batchSeletedList.length === 0" @click="onBatchDelete">{{$t('批量删除')}}({{ batchSeletedList.length }})</button>
          </template>
          <button v-else type="button" class="btn btn-danger btn-small" @click="isBatchMode = true">{{$t('批量操作')}}</button>
        </div>
      </div>
      <div class="content-wrapper" @scroll="handleWrapperScroll">
        <div class="item" v-for="(item, index) in formatList" :key="item">
          <div :class="['img-wrapper', isBatchMode && 'is-batch']" @click="onSelect(index)">
            <img v-if="item" :src="item" loading="lazy" />
            <div class="mask" :style="batchSeletedList.includes(index) ? 'display: flex' : ''">
              <template v-if="!isBatchMode">
                <div class="icon-jump" @click="handleJump(item)">
                  <Icon name="jump" size="18"/>
                </div>
                <div class="icon-delete" @click="handleDelete(item)">
                  <Icon name="delete" size="18"/>
                </div>
              </template>
              <Icon v-else name="check" color="#fff" size="36" />
            </div>
          </div>
        </div>
        <div class="item-fake" v-for="item in 4" :key="item"></div>
      </div>
    </div>
  </easy-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import { saveAs } from 'file-saver'
import { ElNotification } from 'element-plus'
const dialogVisible = ref(false)
const handleOpenSelector = () => {
  dialogVisible.value = true
}

const store = useStore()
const wallpaperCollectionList = computed(() => store.wallpaperCollectionList)

const formatList = ref<string[]>([])
const page = ref(1)
const pageSize = 18
const hasMore = ref(true)

const jsonRef = ref<HTMLInputElement>()
const refreshInputFlag = ref(true)

const isBatchMode = ref(false)
const batchSeletedList = ref<number[]>([])

const { t } = useI18n()

const loadData = () => {
  const list = wallpaperCollectionList.value.slice((page.value - 1) * pageSize, page.value * pageSize).map(item => {
    if (item.includes('&w=') || item.includes('&h=')) {
      // Unsplash图片可缩小预览
      item = item.replace(/&w=\d+/, '&w=256')
      item = item.replace(/&h=\d+/, '&h=144')
    } else if (item.includes('sinaimg.cn')) {
      // Sina图片更改小图
      item = item.replace('large', 'small')
    } else if (item.includes('bing.com')) {
      // Bing图片更改小图
      item = item.replace('1920x1080', '320x240')
    }
    return item
  })
  if (list.length) {
    formatList.value.push(...list)
  } else {
    hasMore.value = false
  }
}

const reloadData = async () => {
  formatList.value = []
  page.value = 1
  hasMore.value = true
  refreshInputFlag.value = false
  await nextTick()
  loadData()
  refreshInputFlag.value = true
}

let timer: number | null
const handleWrapperScroll = (e: Event) => {
  if (!hasMore.value) return
  const el = e.target
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  timer = setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = el as HTMLElement
    const isReachBottom = scrollHeight - scrollTop - clientHeight <= 30
    if (isReachBottom) {
      page.value++
      loadData()
    }
  }, 200)
}

const handleJump = (item: string) => {
  if (item.includes('&w=') || item.includes('&h=')) {
    item = item.replace(/&w=\d+/, '&w=1920')
    item = item.replace(/&h=\d+/, '&h=1080')
  } else if (item.includes('sinaimg.cn')) {
    item = item.replace('small', 'large')
  } else if (item.includes('bing.com')) {
    item = item.replace('320x240', '1920x1080')
  }
  window.open(item)
}

const handleDelete = (item: string) => {
  if (window.confirm(t('确定要删除所选项?'))) {
    const index = formatList.value.indexOf(item)
    if (index > -1) {
      formatList.value.splice(index, 1)
      store.wallpaperCollectionList.splice(index, 1)
    }
  }
}

onMounted(() => {
  loadData()
})

const onExport = () => {
  const data = JSON.parse(JSON.stringify(wallpaperCollectionList.value))
  const dataToString = JSON.stringify(data, null, 2)
  saveAs(new Blob([dataToString], { type: 'application/json,charset=utf-8;' }), 'PersonalWallpaper.json')
}

const onImport = () => {
  if (!jsonRef.value) return
  jsonRef.value.click()
  jsonRef.value.onchange = (e) => {
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
      reader.onload = async (e1) => {
        const jsonFileData = e1.target?.result
        try {
          const json = JSON.parse(jsonFileData as any)
          if (Array.isArray(json)) {
            const current = JSON.parse(JSON.stringify(store.wallpaperCollectionList))
            const newList = [...new Set([...json, ...current])]
            store.updateState({ key: 'wallpaperCollectionList', value: newList })
            reloadData()
          } else {
            throw new Error()
          }
        } catch {
          errorHandler()
        }
      }
      reader.onerror = () => errorHandler()
    }
  }
}

const onClose = () => {
  isBatchMode.value = false
  batchSeletedList.value = []
}

const onBatchCancel = () => {
  isBatchMode.value = false
  batchSeletedList.value = []
}

const onSelect = (index: number) => {
  if (isBatchMode.value) {
    const idx = batchSeletedList.value.indexOf(index)
    if (~idx) {
      batchSeletedList.value.splice(idx, 1)
    } else {
      batchSeletedList.value.push(index)
    }
  }
}

const onBatchDelete = () => {
  if (window.confirm(t('确定要删除所选项?'))) {
    const newList = wallpaperCollectionList.value.filter((item, index) => !batchSeletedList.value.includes(index))
    store.updateState({ key: 'wallpaperCollectionList', value: newList })
    reloadData()
    onBatchCancel()
  }
}

</script>
<style lang="scss" scoped>
.tips {
  font-size: 14px;
  color: #767676;
  padding: 8px 12px;
  border-left: 5px solid $color-warning;
  background: rgba($color-warning, .2);
}
.main-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.operation-btn-wrapper {
  margin-bottom: 10px;
  display: flex;
  .w-full {
    width: 100%;
    flex: 1;
    text-align: right;
  }
}
.content-wrapper {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-content: flex-start;
  font-size: 16px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  .item-fake {
    width: 12em;
    height: 0;
    margin: 0 .2em;
  }
  .item {
    width: 12em;
    height: 6.75em;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 10px 10px -5px rgb(0 0 0 / 4%);
    margin: .8em .2em ;
    .img-wrapper {
      background: linear-gradient(45deg, rgb(211, 208, 253), rgb(208, 227, 253));
      position: relative;
      width: 12em;
      height: 6.75em;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform .4s ease-in-out;
      }
      .mask {
        position: absolute;
        display: none;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        background: rgba(0, 0, 0, .6);
        align-items: center;
        justify-content: center;
        .icon-jump,
        .icon-delete {
          margin: 12px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #9097a37c;
          cursor: pointer;
        }
        .icon-jump {
          color: #42b3c2;
          &:hover {
            background: #42b3c2;
            color: #fff;
          }
        }
        .icon-delete {
          color: #b44;
          &:hover {
            background: #b44;
            color: #fff;
          }
        }
      }
      &:not(.is-batch):hover {
        .mask {
          display: flex;
        }
      }
      &.is-batch {
        cursor: pointer;
        &:hover {
          box-shadow: 0 4px 6px -1px rgba(207, 11, 11, 0.5), 0 2px 4px -2px rgba(189, 22, 22, 0.6);
        }
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .item-wrapper {
    font-size: 12px;
  }
}
</style>
