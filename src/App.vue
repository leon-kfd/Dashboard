<template>
  <GooeyMenu @addComponent="showAddDialog" />
  <Layout @edit="showEditDialog"/>
  <SettingDialog ref="settingDialog" />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Layout from '@/components/Layout.vue'
import SettingDialog from '@/components/SettingDialog.vue'
import GooeyMenu from '@/components/GooeyMenu.vue'
export default defineComponent({
  name: 'App',
  components: {
    Layout,
    SettingDialog,
    GooeyMenu
  },
  setup () {
    const settingDialog = ref()
    const showAddDialog = () => {
      settingDialog.value.open()
    }
    const showEditDialog = (id: string) => {
      settingDialog.value.open(id)
    }
    return {
      settingDialog,
      showAddDialog,
      showEditDialog
    }
  }
})
</script>
<style lang="scss" scoped>
</style>