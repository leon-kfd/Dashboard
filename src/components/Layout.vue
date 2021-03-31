<template>
  <div class="wrapper" :style="`width: ${windowWidth}px`">
    <Draggable v-model="cloneList" item-key="id" tag="transition-group" :component-data="{ name:'flip-list' }">
      <template #item="{ element }">
        <div 
          class="item"
          :style="{
            width: `${fr * element.w}px`,
            height: `${fr * element.h}px`,
            padding: `${gutter}px`,
          }">
          <div class="item-content" :style="`background: rgb(${element.id * 10}, ${255 - element.id * 20}, ${255 - element.id * 20})`">{{element.w}} x {{element.h}}</div>
        </div>
      </template>
    </Draggable>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, PropType, ref, watch } from 'vue'
import Draggable from 'vuedraggable'
export default defineComponent({
  name: 'Layout',
  components: {
    Draggable
  },
  props: {
    list: {
      type: Array
    },
    gutter: {
      type: Number,
      default: 10
    }
  },
  setup (props, { emit }) {
    const genFr = () => {
      const w = window.innerWidth
      return w <= 721 ? w / 12 : w <= 1921 ? w / 24 : w / 36
    }
    const fr = ref(genFr())
    const windowWidth = ref(window.innerWidth)
    let timer:number
    const setFr = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fr.value = genFr()
        windowWidth.value = window.innerWidth
      }, 400)
    }
    onMounted(() => window.addEventListener('resize', setFr))
    onUnmounted(() => window.removeEventListener('resize', setFr))

    const cloneList = ref(JSON.parse(JSON.stringify(props.list)))
    watch(() => cloneList.value, (val) => {
      emit("update:list", val)
    })

    return {
      fr,
      windowWidth,
      cloneList
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  .item {
    .item-content {
      width: 100%;
      height: 100%;
      box-shadow: 0 2px 10px #ccc;
      padding: 10px;
      display: grid;
      place-items: center;
      border-radius: 4px;
    }
  }
}
.flip-list-move {
  transition: transform 0.4s;
}
</style>
