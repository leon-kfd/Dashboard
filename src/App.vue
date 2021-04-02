<template>
  <Layout />
  <Setting @add="handleAddComponent" />
  <div class="lock" @click="updateIsLock">
    {{isLock ? 'Lock': 'UnLock'}}
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import Layout from '@/components/Layout.vue'
import Setting from '@/components/Setting.vue'
export default defineComponent({
  name: 'App',
  components: {
    Layout,
    Setting
  },
  setup () {
    const store = useStore()
    const isLock = computed(() => store.state.isLock)
    const updateIsLock = () => {
      store.commit('updateIsLock', !store.state.isLock)
    }
    const handleAddComponent = (form: Record<string, any>) => {
      const newComponent: ComponentOptions = {
        id: Math.random().toString(32).slice(2),
        w: form.sizeWidth,
        h: form.sizeHeight,
        material: form.material,
        background: form.background
      }
      console.log('newCompoent', newComponent)
      store.commit('addComponentToList', newComponent)
    }
    return {
      handleAddComponent,
      isLock,
      updateIsLock
    }
  }
})
</script>
<style lang="scss" scoped>
.lock {
  position: fixed;
  left: 10px;
  bottom: 10px;
  cursor: pointer;
}
</style>