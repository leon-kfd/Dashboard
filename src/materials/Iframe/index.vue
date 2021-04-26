<template>
  <div
    class="wrapper"
    :style="{
      borderRadius: element.borderRadius + 'px'
    }">
    <iframe
      v-if="componentSetting.url"
      :src="url"
      :style="{
        width: '100%',
        height: '100%'
      }"
      frameborder="0"></iframe>
    <Unset v-else tips="💫IFrame路径丢失，请进行配置" />
    <div v-if="!$store.state.isLock" class="editing-mask"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Unset from '@/components/Tools/Unset.vue'
export default defineComponent({
  name: 'Iframe',
  components: {
    Unset
  },
  props: {
    element: {
      type: Object,
      required: true
    },
    componentSetting: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const url = computed(() => {
      if (!(/https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/.test(props.componentSetting.url))) {
        return 'http://' + props.componentSetting.url
      }
      return props.componentSetting.url
    })
    return {
      url
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
}
.editing-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}
</style>
