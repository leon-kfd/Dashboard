<template>
  <div class="wrapper font-selector">
    <el-select
      :placeholder="$t('请选择相关字体库')"
      clearable
      filterable
      allow-create
      default-first-option
      v-bind="$attrs"
      @focus="checkToQueryFont"
    >
      <el-option
        v-for="item in fontList"
        :key="item.cn"
        :value="item.en"
        :label="item.cn"
      >
        <el-tooltip effect="light" placement="right" :show-after="200" :offset="36">
          <template #content>
            <ul class="font-wrapper" :style="`font-family: ${item.en};`">
              <li>The quick brown fox jumps over a lazy dog. </li>
              <li style="font-weight: bold;">The quick brown fox jumps over a lazy dog. </li>
              <li>落霞与孤鹜齐飞，秋水共长天一色。</li>
              <li style="font-weight: bold;">落霞与孤鹜齐飞，秋水共长天一色。</li>
              <li>0 1 2 3 4 5 6 7 8 9</li>
              <li style="font-weight: bold;">0 1 2 3 4 5 6 7 8 9</li>
            </ul>
          </template>
          <div style="display: flex;align-items: center;justify-content: space-between;">
            <div>{{ item.cn }}</div>
            <div style="color: #8492a6; font-size: 12px;margin-left: 12px">{{ item.en }}</div>
          </div>
        </el-tooltip>
      </el-option>
    </el-select>
    <div v-if="showRefresh" :class="['icon-refresh', rotate && 'rotate']" @click="refresh">
      <Icon name="refresh" size="1em" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from '@/store'
const props = defineProps({
  showRefresh: {
    type: Boolean,
    default: false
  },
  showHarmonyFont: {
    type: Boolean,
    default: false
  }
})
const store = useStore()
onMounted(() => {
  // if (!store.fontFamilyList || store.fontFamilyList.length === 0) {
  //   store.updateFontFamilyList()
  // }
})

const checkToQueryFont = () => {
  if (!store.fontFamilyList || store.fontFamilyList.length === 0) {
    store.updateFontFamilyList()
  }
}

const fontList = computed(() => {
  const outerFont = []
  if (props.showHarmonyFont || store.global.loadHarmonyOSFont) {
    outerFont.push({
      cn: '鸿蒙OS(外部)',
      en: 'HarmonyOS_Regular'
    })
  }
  return [...outerFont, ...store.fontFamilyList]
})
const rotate = ref(false)
const refresh = () => {
  store.updateFontFamilyList()
  rotate.value = true
  setTimeout(() => {
    rotate.value = false
  }, 500)
}
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  .icon-refresh {
    display: inline-flex;
    align-items: center;
    font-size: 20px;
    color: #aaa2b3;
    cursor: pointer;
    margin-left: 8px;
    &.rotate {
      transform: rotate(360deg);
      transition: transform 0.4s ease-in-out;
    }
  }
}
.font-wrapper {
  line-height: 1.4;
  font-size: 18px;
  color: #485762;
  li {
    margin-bottom: 8px;
  }
}
</style>
