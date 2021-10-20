import pick from '../base'
export default {
  formData: {
    textFontSize: 16,
    textColor: '#494e59',
    padding: 10,
    enableTooltip: true,
    enableSlash: true,
    enableHistory: false,
    enablePrism: false,
    markdown: '',
    fontFamily: ''
  },
  formConf (formData: any) {
    return {
      enableTooltip: {
        label: 'Tooltip插件',
        type: 'switch',
        tips: '选择文本后在其顶部出现Tooltip以进行快捷操作'
      },
      enableSlash: {
        label: 'Slash插件',
        type: 'switch',
        tips: '增加斜线命令，在输入“/”后会弹出快捷命令'
      },
      enableHistory: {
        label: 'History插件',
        type: 'switch',
        tips: '增加撤销和重做功能(Ctrl+Z)'
      },
      enablePrism: {
        label: 'Prism插件',
        type: 'switch',
        tips: '添加代码块高亮插件'
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
