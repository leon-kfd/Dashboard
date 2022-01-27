<template>
  <animation-dialog
    ref="dialog"
    animationMode
    title="辅助功能"
    width="min(480px, 98vw)"
    height="min(520px, 90vh)"
    :closeOnClickOutside="false"
    :listenWindowSizeChange="true"
    appendToBody
    @beforeClose="close"
    customClass="auxiliary-config-dialog"
    v-bind="dialogOptions"
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
import Loading from '@/components/Tools/Loading.vue'
import useDialogOption from '@/hooks/useDialogOption'
export default defineComponent({
  name: 'AuxiliaryConfig',
  components: {
    FAQ: defineAsyncComponent(() => import('@/components/Axuiliary/FAQ.vue')),
    ImportExport: defineAsyncComponent({
      loader: () => import('@/components/Axuiliary/ImportExport.vue'),
      loadingComponent: Loading,
    }),
    About: defineAsyncComponent({
      loader: () => import('@/components/Axuiliary/About.vue'),
      loadingComponent: Loading,
    }),
    ChangeLog: defineAsyncComponent(() => import('@/components/Axuiliary/ChangeLog.vue')),
    CleanCache: defineAsyncComponent(() => import('@/components/Axuiliary/CleanCache.vue')),
    TabControl: defineAsyncComponent(() => import('@/components/Axuiliary/TabControl.vue'))
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

    const activeName = ref('TabControl')
    const tabList = ref([
      {
        label: '多页设置',
        cName: 'TabControl'
      },
      {
        label: '常见问题',
        cName: 'FAQ'
      },
      {
        label: '导入导出',
        cName: 'ImportExport'
      },
      {
        label: '关于项目',
        cName: 'About'
      },
      {
        label: '更新日志',
        cName: 'ChangeLog'
      },
      {
        label: '清除数据',
        cName: 'CleanCache'
      }
    ])

    const dialogOptions = useDialogOption()

    return {
      dialog,
      close,
      tabList,
      activeName,
      dialogOptions
    }
  }
})
</script>
<style>
.animation-dialog-wrapper .auxiliary-config-dialog.dialog .dialog-body{
  padding: 5px 5px 20px!important;
}
.animation-dialog-wrapper .auxiliary-config-dialog.dialog .el-tabs__content {
  height: 100%;
}
</style>
