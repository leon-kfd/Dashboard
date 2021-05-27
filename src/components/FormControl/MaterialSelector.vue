<template>
  <div class="material-selector-wrapper">
    <div class="current-selected" v-if="activeItem">
      <div class="label">{{activeItem.label}}</div>
      <div class="tips">{{activeItem.text}}</div>
    </div>
    <button type="button" class="btn btn-primary" @click="handleOpenSelector" style="margin: 0">选择物料</button>
    <animation-dialog
      ref="dialog"
      animationMode
      title="选择物料"
      width="min(760px, 94vw)"
      height="min(480px, 80vh)"
      appendToBody
      :closeOnClickOutside="false"
      :listenWindowSizeChange="true"
      @beforeClose="close">
      <div class="material-wrapper">
        <div class="material" v-for="item in materialList" :key="item.value" @click="handleSelect(item)">
          <div class="img-wrapper"></div>
          <div class="content">
            <div class="label">{{item.label}}</div>
            <div class="tips">{{item.text}}</div>
          </div>
        </div>
      </div>
    </animation-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import AnimationDialog from '@howdyjs/animation-dialog'
import { MATERIAL_LIST_MAP } from '@/constanst'
export default defineComponent({
  name: 'MaterialSelector',
  components: {
    AnimationDialog
  },
  props: {
    modelValue: {
      type: Number,
      required: true
    }
  },
  setup(props, { emit }) {
    const dialog = ref()
    const handleOpenSelector = () => {
      dialog.value.open()
    }
    const close = () => {}

    const materialList = Object.keys(MATERIAL_LIST_MAP).map(key => {
      const item = (MATERIAL_LIST_MAP as any)[key]
      return {
        value: ~~key,
        label: item.label,
        text: item.text
      }
    })

    const activeItem = computed(() => (MATERIAL_LIST_MAP as any)[props.modelValue])

    const handleSelect = (item: (typeof materialList)[number]) => {
      emit('update:modelValue', item.value)
      dialog.value.close()
    }

    return {
      dialog,
      handleOpenSelector,
      close,
      materialList,
      activeItem,
      handleSelect
    }
  }
})
</script>
<style lang="scss" scoped>
.material-selector-wrapper {
  display: inline-flex;
  align-items: center;
}

.current-selected {
  padding: 6px 10px;
  width: 150px;
  margin-right: 10px;
  box-shadow: 0 0 10px #525252;
  background-size: cover;
  background-image: radial-gradient(ellipse closest-side, rgba(0, 0, 0, 0.6), #282c35), url(https://kongfandong.cn/source/mini.jpg);
  .label {
    font-size: 1.1em;
    font-weight: bold;
    line-height: 1.8em;
    color: #f8f8fa;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .tips {
    font-size: 0.8em;
    color: #c9c9cf;
    height: 1.2em;
    line-height: 1.2em;
    padding-bottom: 0.4em;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
}
.material-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  .material {
    width: 10em;
    height: 12em;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 10px 10px -5px rgb(0 0 0 / 4%);
    border-radius: 12px;
    margin: .8em .2em ;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding-bottom: .4em;
    cursor: pointer;
    &:hover {
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 30%), 0 10px 10px -5px rgb(0 0 0 / 10%);
    }
    .img-wrapper {
      background: linear-gradient(45deg, rgb(211, 208, 253), rgb(208, 227, 253));
      flex: 1;
    }
    .content {
      padding: .4em .4em;
      .label {
        font-size: 1.1em;
        font-weight: bold;
        line-height: 1.8em;
        color: #262626;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .tips {
        font-size: 0.8em;
        color: #686872;
        height: 1.2em;
        line-height: 1.2em;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
}
@media screen and (max-width: 480px) {
  .material-wrapper {
    font-size: 14px;
  }
}
</style>
