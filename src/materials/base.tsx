export default function (formData: any, fields: string[] | string) {
  const baseTemplate: Record<string, any> = {
    position: {
      label: '文本对齐',
      slot: () => <position-selector vModel={formData.position}></position-selector>
    },
    textFontSize: {
      label: '字体大小',
      type: 'input-number',
      attrs: {
        'controls-position': 'right',
        min: 12,
        max: 256,
        style: 'width: 100px'
      },
      unit: 'px'
    },
    baseFontSize: {
      label: '基础字体大小',
      type: 'input-number',
      attrs: {
        'controls-position': 'right',
        min: 12,
        max: 256,
        style: 'width: 100px'
      },
      unit: 'px',
      tips: 'baseFontSizeTips'
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
      tips: 'textShadowTips'
    },
    iconShadow: {
      label: '图标阴影',
      type: 'input',
      tips: 'iconShadowTips'
    },
    fontFamily: {
      label: '字体库',
      slot: () => <font-selector vModel={formData.fontFamily} showRefresh></font-selector>
    },
    padding: {
      label: '盒子内边距',
      type: 'input-number',
      attrs: {
        'controls-position': 'right',
        min: 0,
        max: 256,
        style: 'width: 100px'
      },
      unit: 'px'
    },
    showTitle: {
      label: '标题LOGO',
      type: 'switch',
      attrs: {
        'active-text': '展示顶部标题LOGO'
      }
    },
    clickActionType: {
      when: (formData: any) => formData.showTitle,
      label: '点击LOGO',
      type: 'select',
      option: {
        list: [
          { label: '无', value: 0 },
          { label: '刷新列表', value: 1 },
          { label: '跳转主页', value: 2 }
        ],
        label: 'label',
        value: 'value'
      },
      tips: '配置LOGO的点击事件'
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
