<template>
  <Layout @edit="showEditDialog"/>
  <div class="setting-btn" @click="showAddDialog">添加组件</div>
  <SettingDialog ref="settingDialog" />
  <div class="lock" @click="updateIsLock">
    {{isLock ? 'Lock': 'UnLock'}}
  </div>
</template>
<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import Layout from '@/components/Layout.vue'
import SettingDialog from '@/components/SettingDialog.vue'
export default defineComponent({
  name: 'App',
  components: {
    Layout,
    SettingDialog
  },
  setup () {
    const store = useStore()
    const isLock = computed(() => store.state.isLock)
    const updateIsLock = () => {
      store.commit('updateIsLock', !store.state.isLock)
    }
    
    const settingDialog = ref()
    const showAddDialog = () => {
      settingDialog.value.open()
    }
    const showEditDialog = (id: string) => {
      settingDialog.value.open(id)
    }
    return {
      isLock,
      updateIsLock,
      settingDialog,
      showAddDialog,
      showEditDialog
    }
  }
})
</script>
<style lang="scss" scoped>
.setting-btn {
  position: fixed;
  right: 10px;
  bottom: 10px;
  cursor: pointer;
}
.lock {
  position: fixed;
  left: 10px;
  bottom: 10px;
  cursor: pointer;
}
</style>