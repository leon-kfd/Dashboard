import Tips from '@/components/Tools/Tips.vue'
import pick from '../base'
export default {
  formData: {
    textFontSize: 16,
    textColor: '#494e59',
    padding: 10,
    enableTooltip: true,
    enableSlash: true,
    enableHistory: false,
    enableClipboard: false,
    // enablePrism: false,
    showTitle: true,
    markdown: '',
    fontFamily: ''
  },
  formConf (formData: any) {
    return {
      milkdownPlugins: {
        label: 'Milkdown插件',
        slot: () =>
          <div>
            <el-alert title="请仅开启需要用的插件以免造成资源浪费!" type="warning" closable={false} style="padding: 0" />
            <div class="flex-center-y">
              <el-checkbox vModel={formData.enableTooltip} label="Tooltip插件" style="flex: 1" />
              <Tips content="选择文本后在其顶部出现Tooltip以进行快捷操作" />
            </div>
            <div class="flex-center-y">
              <el-checkbox vModel={formData.enableSlash} label="Slash插件" style="flex: 1" />
              <Tips content="增加斜线命令，在输入“/”后会弹出快捷命令" />
            </div>
            <div class="flex-center-y">
              <el-checkbox vModel={formData.enableClipboard} label="Clipboard插件" style="flex: 1" />
              <Tips content="增加复制粘贴Markdown格式的能力" />
            </div>
            <div class="flex-center-y">
              <el-checkbox vModel={formData.enableHistory} label="History插件" style="flex: 1" />
              <Tips content="增加撤销和重做功能(Ctrl+Z, Ctrl+Y)" />
            </div>
            {/* <div class="flex-center-y">
              <el-checkbox vModel={formData.enablePrism} label="Prism插件" style="flex: 1" />
              <Tips content="添加代码块高亮插件" />
            </div> */}
          </div>
      },
      showTitle: {
        label: '展示Logo',
        type: 'switch'
      },
      ...pick(formData, [
        'textFontSize',
        'textColor',
        'fontFamily',
        'padding'
      ])
    }
  }
}
