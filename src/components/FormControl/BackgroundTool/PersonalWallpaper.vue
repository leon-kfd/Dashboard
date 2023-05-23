<template>
  <button type="button" class="btn btn-primary btn-small" style="margin: 0;margin-bottom: 10px;" @click="handleOpenSelector">{{$t('查看个人壁纸库')}}</button>
  <easy-dialog
    v-model="dialogVisible"
    :title="$t('个人壁纸库')"
    width="min(760px, 94vw)"
    height="min(480px, 80vh)">
    <div class="content-wrapper" @scroll="handleWrapperScroll">
      <div class="item" v-for="item in formatList" :key="item">
        <div class="img-wrapper">
          <img v-if="item" :src="item" loading="lazy" />
          <div class="mask">
            <div class="icon-jump" @click="handleJump(item)">
              <Icon name="jump" size="18"/>
            </div>
            <div class="icon-delete" @click="handleDelete(item)">
              <Icon name="delete" size="18"/>
            </div>
          </div>
        </div>
      </div>
      <div class="item-fake" v-for="item in 4" :key="item"></div>
    </div>
  </easy-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
// const emit = defineEmits(['submit'])
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
      console.log('isReachBottom', isReachBottom)
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

</script>
<style lang="scss" scoped>
.tips {
  font-size: 14px;
  color: #767676;
  padding: 8px 12px;
  border-left: 5px solid $color-warning;
  background: rgba($color-warning, .2);
}
.content-wrapper {
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
