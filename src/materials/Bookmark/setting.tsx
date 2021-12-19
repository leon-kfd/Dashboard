import pick from '../base'
export default {
  formData: {
    boxSize: 60,
    boxRadius: 4,
    iconSize: 40,
    textFontSize: 16,
    textColor: '#262626',
    padding: 10,
    maxWidth: 1024,
  },
  formConf (formData: any) {
    return {
      boxSize: {
        label: '图标容器尺寸',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 20,
          max: 120,
          style: 'width: 120px'
        },
        tips: '图标外层容器的大小，只能为正方形'
      },
      boxRadius: {
        label: '容器圆角',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 0,
          max: 120,
          style: 'width: 120px'
        }
      },
      iconSize: {
        label: '图标尺寸',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 16,
          max: 120,
          style: 'width: 120px'
        }
      },
      ...pick(formData, [
        'textFontSize',
        'textColor',
        'padding'
      ]),
      maxWidth: {
        label: '最大宽度',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 200,
          max: 2048,
          style: 'width: 120px'
        }
      }
    }
  }
}
