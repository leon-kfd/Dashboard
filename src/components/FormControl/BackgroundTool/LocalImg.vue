<template>
  <button type="button" class="btn btn-primary btn-small" style="margin: 0;" @click="handleOpenSelector">
    {{ $t('管理本地图片库') }}
  </button>
  <easy-dialog
    v-model="dialogVisible"
    :title="$t('本地图片库')"
    width="min(760px, 94vw)"
    height="min(480px, 80vh)"
  >
    <div class="local-img-wrapper">
      <div class="operation-wrapper">
        <button type="button" class="btn btn-primary" @click="handleUploadImg">
          上传图片
        </button>
        <input
          ref="inputFile"
          type="file"
          style="display: none"
          accept="image/*"
          multiple
          @change="handleInputFileChange"
        >
      </div>
      <div class="content-wrapper" @scroll="handleWrapperScroll">
        <div v-for="item in formatList" :key="item" class="item">
          <div class="img-wrapper">
            <img v-if="item.value" :src="item.value" loading="lazy">
            <div class="mask">
              <div class="icon-jump" @click="handleJump(item)">
                <Icon name="jump" size="18" />
              </div>
              <div class="icon-delete" @click="handleDelete(item)">
                <Icon name="delete" size="18" />
              </div>
            </div>
          </div>
        </div>
        <div v-for="item in 4" :key="item" class="item-fake" />
      </div>
    </div>
  </easy-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { uid, base64ToBlob } from '@/utils'
import { localImg, localThumbImg } from '@/plugins/local-img'
import { cutImageBase64 } from '@/utils/images'
import { ElNotification } from 'element-plus'
import { useI18n } from 'vue-i18n'
const dialogVisible = ref(false)
const handleOpenSelector = () => {
  dialogVisible.value = true
  initData()
}

const localImgList = ref<any[]>([])

const formatList = ref<any[]>([])
const page = ref(1)
const pageSize = 18
const hasMore = ref(true)

const inputFile = ref()
const uploadLoading = ref(false)
const { t } = useI18n()

const initData = async () => {
  page.value = 1
  formatList.value = []
  hasMore.value = true
  localImgList.value = (await localThumbImg.keys()).reverse()
  loadData()
}

const loadData = async () => {
  const list = localImgList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
  if (list.length) {
    const _list = await Promise.all(list.map(async item => {
      const thumbImg = await localThumbImg.getItem(item)
      return { key: item, value: thumbImg }
    }))
    formatList.value.push(..._list)
  } else {
    hasMore.value = false
  }
}

let timer: ReturnType<typeof setTimeout>
const handleWrapperScroll = (e: Event) => {
  if (!hasMore.value) return
  const el = e.target
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    const { scrollTop, scrollHeight, clientHeight } = el as HTMLElement
    const isReachBottom = scrollHeight - scrollTop - clientHeight <= 30
    if (isReachBottom) {
      console.log('isReachBottom', isReachBottom)
      page.value++
      loadData()
    }
  }, 200)
}

const handleJump = async (item: any) => {
  const realImg: string | null = await localImg.getItem(item.key)
  if (realImg) {
    const blob = base64ToBlob(realImg)
    const link = URL.createObjectURL(blob)
    window.open(link)
  }
}

const handleDelete = async (item: any) => {
  if (window.confirm(t('确定要删除所选项?'))) {
    if (item.key) {
      await localImg.removeItem(item.key)
      await localThumbImg.removeItem(item.key)
      initData()
    }
  }
}

const handleUploadImg = () => {
  inputFile.value.click()
}

const handleInputFileChange = async (e: any) => {
  uploadLoading.value = true
  try {
    const files = e.target.files
    const p = await Promise.all([...files].map(async (file: File) => {
      const realImg = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result)
        }
        reader.onerror = () => {
          resolve('')
        }
      })
      const thumbImg = await cutImageBase64(file, 200)
      return { thumbImg, realImg }
    }))
    const imgList = p.filter(item => item.thumbImg && item.realImg).map(item => ({ id: `${+new Date()},${uid()}`, realImg: item.realImg, thumbImg: item.thumbImg }))
    await Promise.all(imgList.map(async item => {
      await localImg.setItem(item.id, item.realImg)
      await localThumbImg.setItem(item.id, item.thumbImg)
    }))
    ElNotification({
      title: t('成功'),
      type: 'success',
      message: t('上传成功')
    })
    initData()
  } catch (e) {
    ElNotification({
      title: t('错误'),
      type: 'error',
      message: t('上传出错')
    })
  } finally {
    uploadLoading.value = false
  }
}

</script>
<style lang="scss" scoped>
.operation-wrapper {
  margin-bottom: 10px;
  padding-left: 18px;
}
.tips {
  font-size: 14px;
  color: #767676;
  padding: 8px 12px;
  border-left: 5px solid $color-warning;
  background: rgba($color-warning, .2);
}
.local-img-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}
.content-wrapper {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  justify-content: space-around;
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
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .img-wrapper {
      background: linear-gradient(45deg, rgb(211, 208, 253), rgb(208, 227, 253));
      position: relative;
      width: 12em;
      height: 6.75em;
      overflow: hidden;
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
      &:hover {
        .mask {
          display: flex;
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
