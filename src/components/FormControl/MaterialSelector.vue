<template>
  <div class="material-selector-wrapper">
    <div
      class="current-selected"
      v-if="activeItem"
      :style="{
        backgroundImage: `radial-gradient(ellipse closest-side, rgba(0, 0, 0, 0.6), #282c35), url(${activeItem.img})`
      }">
      <div class="label">{{activeItem.label}}</div>
      <div class="tips">{{activeItem.text}}</div>
    </div>
    <button
      type="button"
      class="btn btn-primary btn-large"
      :disabled="disabled"
      @click="handleOpenSelector"
      style="margin: 0">选择物料</button>
    <animation-dialog
      ref="dialog"
      animationMode
      title="选择物料"
      width="min(760px, 94vw)"
      height="min(480px, 80vh)"
      appendToBody
      :closeOnClickOutside="false"
      :listenWindowSizeChange="true"
      @beforeClose="close"
      v-bind="dialogOptions">
      <div class="material-wrapper" v-if="beginLoad">
        <div class="material" v-for="item in materialList" :key="item.value" @click="handleSelect(item)">
          <div class="img-wrapper">
            <img v-if="item.img" :src="item.img" />
          </div>
          <div class="content">
            <div class="label">{{item.label}}</div>
            <div class="tips">{{item.text}}</div>
          </div>
        </div>
        <div class="material-fake" v-for="item in 4" :key="item"></div>
      </div>
    </animation-dialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { MATERIAL_LIST_MAP } from '@/constanst'
import useDialogOption from '@/hooks/useDialogOption'
export default defineComponent({
  name: 'MaterialSelector',
  props: {
    modelValue: {
      type: [Number, String],
      required: true
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const beginLoad = ref(false)

    const dialog = ref()
    const handleOpenSelector = () => {
      dialog.value.open()
      if (!beginLoad.value) beginLoad.value = true
    }
    const close = () => {}

    const materialList = Object.keys(MATERIAL_LIST_MAP).map(key => {
      const item = MATERIAL_LIST_MAP[key]
      return {
        value: key,
        label: item.label,
        text: item.text,
        img: item.img
      }
    })

    const activeItem = computed(() => MATERIAL_LIST_MAP[props.modelValue])

    const handleSelect = (item: (typeof materialList)[number]) => {
      emit('update:modelValue', item.value)
      emit('change')
      dialog.value.close()
    }

    const dialogOptions = useDialogOption(true)

    return {
      dialog,
      handleOpenSelector,
      close,
      materialList,
      activeItem,
      handleSelect,
      beginLoad,
      dialogOptions
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
  padding: 16px 10px;
  width: 200px;
  height: 120px;
  margin-right: 10px;
  box-shadow: 0 0 10px #525252;
  background-size: 240px 180px;
  .label {
    font-size: 1.5em;
    font-weight: bold;
    line-height: 1.8em;
    color: #f8f8fa;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    margin-bottom: .4em;
  }
  .tips {
    font-size: 1.1em;
    color: #c9c9cf;
    height: 1.4em;
    line-height: 1.4em;
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
  font-size: 16px;
  .material-fake {
    width: 10em;
    height: 0;
    margin: 0 .2em;
  }
  .material {
    width: 10em;
    height: 12em;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%), 0 10px 10px -5px rgb(0 0 0 / 4%);
    // border-radius: 8px;
    margin: .8em .2em ;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    cursor: pointer;
    transition: transform .4s ease-in-out;
    &:hover {
      box-shadow: 0 20px 25px -5px rgb(0 0 0 / 30%), 0 10px 10px -5px rgb(0 0 0 / 10%);
      .img-wrapper {
        img {
          transform: scale(1.05);
        }
      }
    }
    .img-wrapper {
      background: linear-gradient(45deg, rgb(211, 208, 253), rgb(208, 227, 253));
      position: relative;
      width: 10em;
      height: 8em;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform .4s ease-in-out;
      }
    }
    .content {
      padding: .4em .4em .8em;
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
