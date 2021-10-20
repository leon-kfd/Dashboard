<template>
  <div class="wrapper">
    <Milk
      ref="milkdown"
      :style="{
        padding: componentSetting.padding + 'px',
        fontFamily: componentSetting.fontFamily,
        pointerEvents: isLock ? 'auto': 'none'
      }"
      :textColor="componentSetting.textColor"
      :fontSize="componentSetting.textFontSize"
      :enableTooltip="componentSetting.enableTooltip"
      :enableSlash="componentSetting.enableSlash"
      :enableGfm="componentSetting.enableGfm"
      :enablePrism="componentSetting.enablePrism"
      :markdown="componentSetting.markdown"
      @change="onChange" />
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, computed, toRaw } from 'vue'
import { useStore } from 'vuex'
import Milk from './milkdown/index.vue'
const props = defineProps({
  componentSetting: {
    type: Object,
    required: true
  },
  element: {
    type: Object,
    required: true
  },
  isAction: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
const isLock = computed(() => store.state.isLock)

const milkdown = ref()

// 如果使用数组监听会触发新旧值一样的回调，因为对象内存已改变
watch(() => props.componentSetting.enableTooltip, () => milkdown.value.update())
watch(() => props.componentSetting.enableSlash, () => milkdown.value.update())
watch(() => props.componentSetting.enableGfm, () => milkdown.value.update())
watch(() => props.componentSetting.enablePrism, () => milkdown.value.update())

const onChange = (md: string) => {
  // TODO: debounce
  const element = JSON.parse(JSON.stringify(toRaw(props.element)))
  if (props.isAction) {
    element.actionSetting.actionClickValue.componentSetting.markdown = md
    store.commit('updateActionElement', element)
  } else {
    element.componentSetting.markdown = md
  }
  store.commit('editComponent', element)
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}
</style>
