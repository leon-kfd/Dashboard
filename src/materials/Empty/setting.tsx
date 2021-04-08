export default {
  formData: {
    customText: '',
    isCenter: true,
    textFontSize: 16,
    textColor: '#262626',
    textShadow: '0 1px 1px #464646',
    padding: 0
  },
  formConf (formData: any) {
    return {
      customText: {
        label: '自定义文本',
        type: 'input',
        attrs: {
          placeholder: '可配置显示自定义文本'
        }
      },
      isCenter: {
        label: '文本居中',
        type: 'switch',
      },
      textFontSize: {
        label: '字体大小',
        slot: () => {
          return (
            <div style="display:flex;align-item: center">
              <el-input-number vModel={formData.textFontSize} controls-position="right" min={12} max={64} style="width: 100px" />
              <span style="margin-left: 10px;font-weight:bold">px</span>
            </div>
          )
        }
      },
      textColor: {
        label: '字体颜色',
        slot: () => <standard-color-picker vModel={formData.textColor} />
      },
      textShadow: {
        label: '字体阴影',
        type: 'input',
        tips: '基于CSS3的text-shadow属性，应输入合法的CSS字体阴影代码片段'
      },
      padding: {
        label: '盒子内边距',
        slot: () => {
          return (
            <div style="display:flex;align-item: center">
              <el-input-number vModel={formData.padding} controls-position="right" min={0} max={256} style="width: 100px" />
              <span style="margin-left: 10px;font-weight:bold">px</span>
            </div>
          )
        }
      }
    }
  },
}
