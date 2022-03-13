<template>
  <div class="position-selector">
    <div class="icon-wrapper" :style="mode === 1 ? 'width: 90px;': 'width: 60px;'">
      <div
        v-for="item in valueList"
        :key="item.value"
        class="icon"
        :class="{ active: modelValue === item.value}"
        @click="handleIconClick(item.value)">
        <Icon :name="item.value === 5 ? 'full-screen' : 'arrow-up'" :style="`transform: rotate(${item.rotate}deg)`" size="20" />
      </div>
    </div>
    <span v-if="cnText" class="text">{{$t(cnText)}}</span>
    <span v-if="enText" class="text">{{enText}}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
export default defineComponent({
  name: 'PositionSelector',
  props: {
    modelValue: {
      type: Number,
    },
    showChineseText: {
      type: Boolean,
      default: true
    },
    showEnglishText: {
      type: Boolean,
      default: false
    },
    mode: {
      type: Number,
      default: 1
    }
  },
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const mode1 = [
      {
        value: 1,
        rotate: -45,
        cn: '左上',
        en: 'Top Left'
      },
      {
        value: 2,
        rotate: 0,
        cn: '顶部水平居中',
        en: 'Top Center'
      },
      {
        value: 3,
        rotate: 45,
        cn: '右上',
        en: 'Top Right'
      },
      {
        value: 4,
        rotate: -90,
        cn: '左侧垂直居中',
        en: 'Center Left'
      },
      {
        value: 5,
        rotate: 0,
        cn: '居中',
        en: 'Center'
      },
      {
        value: 6,
        rotate: 90,
        cn: '右侧垂直居中',
        en: 'Center Right'
      },
      {
        value: 7,
        rotate: -135,
        cn: '左下',
        en: 'Bottom Left'
      },
      {
        value: 8,
        rotate: 180,
        cn: '底部水平居中',
        en: 'Bottom Center'
      },
      {
        value: 9,
        rotate: 135,
        cn: '右下',
        en: 'Bottom Right'
      }
    ]

    const mode2 = [
      {
        value: 1,
        rotate: -45,
        cn: '左上',
        en: 'Top Left'
      },
      {
        value: 2,
        rotate: 45,
        cn: '右上',
        en: 'Top Right'
      },
      {
        value: 3,
        rotate: -135,
        cn: '左下',
        en: 'Bottom Left'
      },
      {
        value: 4,
        rotate: 135,
        cn: '右下',
        en: 'Bottom Right'
      }
    ]

    const valueList = computed(() => props.mode === 1 ? mode1 : mode2)

    const handleIconClick = (value: number) => {
      emit('change')
      emit('update:modelValue', value)
    }

    const cnText = computed(() => props.showChineseText ? valueList.value.find(item => item.value === props.modelValue)?.cn : '')
    const enText = computed(() => props.showEnglishText ? valueList.value.find(item => item.value === props.modelValue)?.en : '')
    return {
      valueList,
      handleIconClick,
      cnText,
      enText
    }
  }
})
</script>
<style lang="scss" scoped>
.position-selector {
  display: inline-flex;
  align-items: center;
  .icon-wrapper {
    display: flex;
    flex-wrap: wrap;
    width: 90px;
    .icon {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #898992;
      &.active {
        color: $color-primary;
      }
      &:not(.active):hover {
        color: darken($color-primary, 50%)
      }
    }
  }
  .text {
    margin: 0 8px;
    font-size: 14px;
    font-weight: bold;
    color: #262626;
  }
}
</style>
