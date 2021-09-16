<template>
  <animation-dialog
    ref="dialog"
    customWrapperClass="backdrop-blur"
    animationMode
    title="辅助功能"
    width="min(480px, 98vw)"
    height="min(520px, 90vh)"
    :closeOnClickOutside="false"
    :listenWindowSizeChange="true"
    appendToBody
    @beforeClose="close"
    customClass="auxiliary-config-dialog"
    animation-in="flipInY"
  >
    <el-tabs tab-position="left" style="height: 100%" v-model="activeName">
      <el-tab-pane
        v-for="item in tabList"
        style="height: 100%;overflow-y: auto;"
        :key="item.label"
        :label="item.label"
        :name="item.cName"
        :lazy="true">
        <component :is="item.cName"></component>
      </el-tab-pane>
    </el-tabs>
  </animation-dialog>
</template>

<script lang="ts">
import { defineComponent, watch, ref, defineAsyncComponent } from 'vue'
export default defineComponent({
  name: 'AuxiliaryConfig',
  components: {
    FAQ: defineAsyncComponent(() => import('@/components/Axuiliary/FAQ.vue')),
    ImportExport: defineAsyncComponent(() => import('@/components/Axuiliary/ImportExport.vue')),
    CleanCache: defineAsyncComponent(() => import('@/components/Axuiliary/CleanCache.vue')),
    About: defineAsyncComponent(() => import('@/components/Axuiliary/About.vue'))
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup(props, { emit }) {
    const dialog = ref()
    watch(() => props.visible, (val) => {
      if (val) {
        dialog.value.open()
      } else {
        dialog.value.close()
      }
    })
    const close = () => {
      emit('update:visible', false)
    }

    const activeName = ref('ImportExport')
    const tabList = ref([
      {
        label: '导入导出',
        cName: 'ImportExport'
      },
      {
        label: '常见问题',
        cName: 'FAQ'
      },
      {
        label: '清除数据',
        cName: 'CleanCache'
      },
      {
        label: '关于项目',
        cName: 'About'
      }
    ])

    return {
      dialog,
      close,
      tabList,
      activeName
    }
  }
})
</script>
<style lang="scss" scoped>
</style>
<style>
.animation-dialog-wrapper .auxiliary-config-dialog.dialog .dialog-body{
  padding: 5px 5px 20px!important;
}
.animation-dialog-wrapper .auxiliary-config-dialog.dialog .el-tabs__content {
  height: 100%;
}
</style>
