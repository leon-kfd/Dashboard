<template>
  <div v-if="tabList && tabList.length > 1 && showTabSwitchBtn" class="tab-carousel-wrapper">
    <div
      v-for="item in tabList"
      :key="item.id"
      :class="[showTabSwitchBtn === 2 ? 'item2' : 'item', item.selected && 'selected']"
      :title="item.name"
      @click="handleSelected(item)"
    >
      {{ showTabSwitchBtn === 2 ? item.name : '' }}
    </div>
  </div>
  <div 
    v-if="tabList && tabList.length > 1 && showTabSwitchBtn === 2" 
    class="active-block" 
    :style="`left: ${activeBlockInfo.left}px; top: ${activeBlockInfo.top}px; width: ${activeBlockInfo.width}px; height: ${activeBlockInfo.height}px`"
  />
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue'
import { useStore } from '@/store'
const store = useStore()
const tabList = computed(() => store.tabList)
const showTabSwitchBtn = computed(() => store.showTabSwitchBtn)
const enableKeydownSwitchTab = computed(() => store.enableKeydownSwitchTab)

const handleSelected = (item: any) => {
  if (item.selected) return
  store.updateTabSelected(item.id)
}

const keydownEvent = (e: KeyboardEvent) => {
  if (
    !store.isLock ||
    document.querySelector('input:focus') ||
    document.querySelector('textarea:focus') ||
    document.querySelector('.ProseMirror-focused') ||
    document.querySelector('.action-popover')
  ) {
    return
  }
  if (['ArrowDown', 'ArrowRight'].includes(e.key)) {
    handleTabOrder('next')
  } else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) {
    handleTabOrder('prev')
  }
}

const handleTabOrder = (type: 'prev' | 'next') => {
  const index = tabList.value.findIndex((item: any) => item.selected)
  let next
  if (type === 'prev') {
    next = index === 0 ? tabList.value.length - 1 : index - 1
  } else {
    next = index === tabList.value.length - 1 ? 0 : index + 1
  }
  const nextId = tabList.value[next].id
  store.updateTabSelected(nextId)
}

const activeBlockInfo = ref({ width: 0, height: 0, left: window.innerWidth / 2, top: window.innerHeight })
const activeSelectedIdx = computed(() => store.tabList.findIndex(i => i.selected))
const handleActiveBlockMove = async () => {
  await nextTick()
  if (~activeSelectedIdx.value && showTabSwitchBtn.value === 2) {
    const el = document.querySelector('.tab-carousel-wrapper .item2.selected')
    if (el) {
      const { width, height, left, top } = el.getBoundingClientRect()
      activeBlockInfo.value = { width: width + 16, height: height + 8, left: left - 8, top: top - 4 }
    }
  }
}
watch(() => [activeSelectedIdx.value, showTabSwitchBtn.value], () => {
  handleActiveBlockMove()
}, {
  immediate: true
})

onMounted(() => {
  if (tabList.value && tabList.value.length > 1 && enableKeydownSwitchTab.value) {
    document.addEventListener('keydown', keydownEvent)
    window.addEventListener('resize', handleActiveBlockMove)
  }
})
onUnmounted(() => {
  document.removeEventListener('keydown', keydownEvent)
  window.removeEventListener('resize', handleActiveBlockMove)
})
</script>
<style lang='scss' scoped>
.tab-carousel-wrapper {
  position: fixed;
  // width: 300px;
  height: 20px;
  bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  .item {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    border: 1px solid rgba($color-white, 0.9);
    background: rgba($color-grey4, 0.9);
    margin: 0 5px;
    cursor: pointer;
    transition: all 0.4s ease-in-out;
    &:not(.selected):hover {
      background: rgba($color-grey5, 0.9);
    }
    &.selected {
      width: 40px;
      background: rgba($color-white, 0.9);
      cursor: default;
    }
  }
  .item2 {
    font-size: 12px;
    color: #eee;
    margin: 0 12px;
    cursor: pointer;
  }
}
.active-block {
  position: fixed;
  top: 100%;
  left: 50%;
  width: 0;
  height: 0;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  backdrop-filter: blur(10px);
  transition: all 0.4s ease-in-out;
  z-index: 9998;
}
</style>
