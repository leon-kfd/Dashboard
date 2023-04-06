<template>
  <div
    class="wrapper material-iframe"
    :style="{
      borderRadius: element.borderRadius + 'px'
    }">
    <iframe
      v-if="componentSetting.url"
      :src="url"
      :style="{
        width: '100%',
        height: '100%',
        pointerEvents: isLock ? 'all' : 'none'
      }"
      frameborder="0"></iframe>
    <Unset v-else :tips="`💫${$t('IFrame路径丢失，请进行配置')}`" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import Unset from '@/components/Tools/Unset.vue'
import { useStore } from '@/store'
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
    const store = useStore()
    const isLock = computed(() => store.isLock)
    return {
      url,
      isLock
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
</style>
