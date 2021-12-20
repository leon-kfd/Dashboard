<template>
  <div
    class="wrapper"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      padding: componentSetting.padding + 'px'
    }">
    <div
      class="bookmark-wrapper"
      :style="{
        maxWidth: `${componentSetting.maxWidth || 880}px`
      }">
      <Draggable
        v-model="list"
        class="bookmark-draggable-wrapper"
        item-key="title">
        <template #item="{ element, index }">
          <div class="item">
            <div class="tile-icon">
              <img :src="getTargetIcon(element.url)" alt="">
            </div>
            <div class="tile-title">{{element.title}}</div>
            <div class="delete-btn" @click.stop="handleDelete(index)">
              <i class="el-icon-close"></i>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="item">
            <div class="btn-add-wrapper">
              <i class="el-icon-plus"></i>
            </div>
          </div>
          <div class="item fake" v-for="number in 20" :key="number"></div>
        </template>
      </Draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { getTargetIcon } from '@/utils/images'
import Draggable from 'vuedraggable'
import { useStore } from 'vuex'
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
const boxSize = computed(() => props.componentSetting.boxSize + 'px')
const boxRadius = computed(() => props.componentSetting.boxRadius + 'px')
const iconSize = computed(() => props.componentSetting.iconSize + 'px')
const textFontSize = computed(() => props.componentSetting.textFontSize + 'px')
const textWrapperHeight = computed(() => props.componentSetting.textFontSize * 1.5 + 'px')
const textColor = computed(() => props.componentSetting.textColor)
const padding = computed(() => props.componentSetting.padding + 'px')
const boxWrapperSize = computed(() => `${props.componentSetting.boxSize + props.componentSetting.textFontSize * 1.5 + props.componentSetting.padding * 2 + 8}px`)

const store = useStore()
const list = computed({
  get: () => props.componentSetting.bookmark,
  set: (val) => {
    const element = JSON.parse(JSON.stringify(props.element))
    if (props.isAction) {
      element.componentSetting.actionClickValue.componentSetting.bookmark = val
      store.dispatch('updateActionElement', element)
    } else {
      element.componentSetting.bookmark = val
    }
    store.dispatch('editComponent', element)
  }
})

const handleDelete = (index: number) => {
  if (confirm('确定要删除所选项?')) {
    const element = JSON.parse(JSON.stringify(props.element))
    if (props.isAction) {
      element.componentSetting.actionClickValue.componentSetting.bookmark.splice(index, 1)
      store.dispatch('updateActionElement', element)
    } else {
      element.componentSetting.bookmark.splice(index, 1)
    }
    store.dispatch('editComponent', element)
  }
}

</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  .bookmark-wrapper {
    width: 100%;
    .bookmark-draggable-wrapper {
      display: flex;
      flex-wrap: wrap;
      // justify-content: space-between;
      .item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        padding: v-bind('padding');
        border-radius: 4px;
        width: v-bind('boxWrapperSize');
        height: v-bind('boxWrapperSize');
        cursor: pointer;
        &:hover {
          background: rgba($--color-dark,.3);
          .delete-btn {
            display: flex;
          }
        }
        &.fake {
          height: 0;
          padding-top: 0;
          padding-bottom: 0;
        }
        .tile-icon {
          width: v-bind('boxSize');
          height: v-bind('boxSize');
          border-radius: v-bind('boxRadius');
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(241, 243, 244);
          margin: 4px 0;
          img {
            width: v-bind('iconSize');
            height: v-bind('iconSize');
          }
        }
        .tile-title {
          font-size: v-bind('textFontSize');
          color: v-bind('textColor');
          height: v-bind('textWrapperHeight');
          width: 100%;
          text-align: center;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .delete-btn {
          display: none;
          position: absolute;
          right: 2px;
          top: 2px;
          align-items: center;
          justify-content: center;
          width: 20px;
          height: 20px;
          font-size: 14px;
          color: rgb(170, 178, 184);
          border-radius: 50%;
          cursor: pointer;
          &:hover {
            background: rgb(95,99,104);
          }
        }
        .btn-add-wrapper {
          border-radius: 4px;
          width: calc(100% - 10px);
          height: calc(100% - 10px);
          border: 2px dashed v-bind('textColor');
          color: v-bind('textColor');
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
