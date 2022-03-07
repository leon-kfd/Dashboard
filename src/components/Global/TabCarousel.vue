<template>
  <div class="tab-carousel-wrapper" v-if="tabList && tabList.length > 1 && showTabSwitchBtn">
    <div
      v-for="item in tabList"
      :key="item.id"
      :class="['item', item.selected && 'selected']"
      :title="item.name"
      @click="handleSelected(item)"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, onUnmounted } from 'vue'
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

onMounted(() => {
  if (tabList.value && tabList.value.length > 1 && enableKeydownSwitchTab.value) {
    document.addEventListener('keydown', keydownEvent)
  }
})
onUnmounted(() => {
  document.removeEventListener('keydown', keydownEvent)
})
</script>
<style lang='scss' scoped>
.tab-carousel-wrapper {
  position: fixed;
  width: 300px;
  height: 20px;
  bottom: 10px;
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
}
</style>
