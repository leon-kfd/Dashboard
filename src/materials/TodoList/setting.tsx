export default {
  minWidth: 4,
  formData: {
    todo: {},
    themeColor: '#643a7a',
    baseFontSize: 16,
    padding: 10
  },
  formConf (formData: any) {
    return {
      themeColor: {
        label: '主题颜色',
        slot: () => <standard-color-picker vModel={formData.themeColor} />
      },
      baseFontSize: {
        label: '基础字体大小',
        slot: () => {
          return (
            <div style="display:flex;align-item: center">
              <el-input-number vModel={formData.baseFontSize} controls-position="right" min={12} max={256} style="width: 100px" />
              <span style="margin-left: 10px;font-weight:bold">px</span>
            </div>
          )
        },
        tips: '组件的字体大小基于em单位，可以更改该参数设置组件字体显示'
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
  }
}