<template>
  <div
    class="wrapper material-daily-hot"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS
    }"
  >
    <div class="daily-hot">
      <div class="classify-wrapper">
        <div 
          v-for="item in classifyList" 
          :key="item.value" 
          :class="['classify-item', activeClassify === item.value ? 'active' : '']"
          @click="onChangeClassify(item)"
        >
          {{  item.label }}
        </div>
      </div>
      <div class="list-wrapper scrollbar1">
        <div v-if="listLoading" class="loading">Loading...</div>
        <div v-else-if="listError" class="error">Something Error.</div>
        <template v-else>
          <a 
            v-for="item in list" 
            :key="item.title" 
            class="list-item" 
            :href="item.url" 
            :title="item.title"
            :style="!isLock ? 'pointer-events: none' : ''"
            target="_blank">
            <li>{{ item.title }}</li>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, computed } from 'vue'
import { useStore } from '@/store'
import { mapPosition } from '@/plugins/position-selector'
import request from '@/utils/request'
import { DAILY_HOT_CLASSIFY } from '@/constanst'
const props = defineProps({
  componentSetting: {
    type: Object,
    required: true
  }
})
const store = useStore()
const isLock = computed(() => store.isLock)

type Classify = {
  label: string,
  value: string
}
type ListItem = {
  title: string,
  url: string
}

const classifyList = computed(() => {
  return DAILY_HOT_CLASSIFY.filter(item => props.componentSetting.enableList.includes(item.value))
})
const activeClassify = ref('')

onMounted(() => {
  activeClassify.value = classifyList.value[0].value
  getList()
})

const positionCSS = computed(() => mapPosition(props.componentSetting.position))

const onChangeClassify = (item: Classify) => {
  activeClassify.value = item.value
  getList()
}

const listLoading = ref(false)
const listError = ref(false)
const list = ref<ListItem[]>([])
const getList = async (retry = false) => {
  listLoading.value = true
  listError.value = false
  list.value = []
  try {
    const url = retry ? `https://hot.howdz.xyz/${activeClassify.value}` : `/hot/${activeClassify.value}`
    const res = await request({ url, timeout: retry ? 5000 : 10000 })
    if (res.code !== 200) {
      throw new Error('API Error')
    }
    list.value = res.data.reduce((prev, curr, index) => {
      if (index < props.componentSetting.limit) {
        return [...prev, { title: curr.title, url: curr.url }]
      } else {
        return prev
      }
    }, [])
  } catch {
    if (!retry) {
      // try fetch source again
      getList(true)
    } else {
      listError.value = true
    }
  } finally {
    listLoading.value = false
  }
}


</script>

<style lang="scss" scoped>
.wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  .daily-hot {
    display: flex;
    width: 100%;
    height: 100%;
    flex-direction: column;
    user-select: none;
    .classify-wrapper {
      display: flex;
      flex-wrap: wrap;
      .classify-item {
        padding: 0.3em 0.5em;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 0.3em;
        margin-bottom: 0.3em;
        &.active {
          background: rgba(255,255,255,0.2);
        }
      }
    }
    .list-wrapper {
      flex: 1;
      height: 100%;
      overflow-y: auto;
      margin-top: 0.6em;
      .list-item,
      .loading,
      .error {
        display: block;
        color: inherit;
        text-decoration: none;
        padding: 0.3em 0.5em;
        border-radius: 4px;
        box-sizing: border-box;
        line-height: 1.4;
      }
      .list-item {
        cursor: pointer;
        li {
          list-style: circle;
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}
</style>