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
        </div>
      </div>
      <div class="item-fake" v-for="item in 4" :key="item"></div>
    </div>
  </easy-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/store'
// const emit = defineEmits(['submit'])
const dialogVisible = ref(false)
const handleOpenSelector = () => {
  dialogVisible.value = true
}

const store = useStore()
const wallpaperCollectionList = computed(() => store.wallpaperCollectionList)

const formatList = ref<string[]>([])
const page = ref(1)
const pageSize = 15
const hasMore = ref(true)

const loadData = () => {
  const list = wallpaperCollectionList.value.slice((page.value - 1) * pageSize, page.value * pageSize)
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
    cursor: pointer;
    transition: transform .4s ease-in-out;
    &:hover {
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 30%), 0 10px 10px -5px rgb(0 0 0 / 10%);
      // .img-wrapper {
      //   img {
      //     transform: scale(1.05);
      //   }
      // }
    }
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
    }
  }
}
@media screen and (max-width: 480px) {
  .item-wrapper {
    font-size: 12px;
  }
}
</style>
