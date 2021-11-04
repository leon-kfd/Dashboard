export default function (formData: any, fields: string[] | string) {
  const baseTemplate: Record<string, any> = {
    position: {
      label: '文本对齐',
      slot: () => <position-selector vModel={formData.position}></position-selector>
    },
    textFontSize: {
      label: '字体大小',
      slot: () => {
        return (
          <div style="display:flex;align-item: center">
            <el-input-number vModel={formData.textFontSize} controls-position="right" min={12} max={256} style="width: 100px" />
            <span style="margin-left: 10px;font-weight:bold">px</span>
          </div>
        )
      }
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
    textColor: {
      label: '字体颜色',
      slot: () => <standard-color-picker vModel={formData.textColor} />
    },
    textShadow: {
      label: '字体阴影',
      type: 'input',
      attrs: {
        placeholder: 'e.g. "0 0 1px #464646"'
      },
      tips: '基于CSS3的text-shadow属性，应输入合法的CSS字体阴影代码片段'
    },
    iconShadow: {
      label: '图标阴影',
      type: 'input',
      tips: '基于CSS3的filter:drop-shadow()属性，应输入合法的drop-shadow阴影代码片段'
    },
    fontFamily: {
      label: '字体库',
      slot: () => <font-selector vModel={formData.fontFamily} showRefresh></font-selector>
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
    },
    showTitle: {
      label: '标题LOGO',
      type: 'switch',
      attrs: {
        'active-text': '展示顶部标题LOGO'
      }
    }
  }
  const result: Record<string, any> = {}
  if (typeof fields === 'string') {
    result[fields] = baseTemplate[fields]
  } else {
    fields.map(key => {
      result[key] = baseTemplate[key]
    })
  }
  return result
}
