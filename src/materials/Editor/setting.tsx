import pick from '../base'
export default {
  formData: {
    textFontSize: 16,
    textColor: '#494e59',
    padding: 10,
    enableTooltip: true,
    enableSlash: true,
    enableGfm: false,
    enablePrism: false,
    markdown: '',
    fontFamily: ''
  },
  formConf (formData: any) {
    return {
      enableTooltip: {
        label: 'Tooltip插件',
        type: 'switch',
        tips: '使在选择文本后在其顶部出现Tooltip以进行快捷操作'
      },
      enableSlash: {
        label: 'Slash插件',
        type: 'switch',
        tips: '增加斜线命令，在输入“/”后会弹出快捷命令'
      },
      enableGfm: {
        label: 'GFM语法插件',
        type: 'switch',
        tips: '语法扩展插件，增加表格、TodoList等语法支持'
      },
      enablePrism: {
        label: 'Prism插件',
        type: 'switch',
        tips: '代码高亮插件'
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
