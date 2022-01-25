import pick from '../base'
export default {
  formData: {
    boxSize: 36,
    boxRadius: 4,
    iconSize: 20,
    textFontSize: 12,
    textColor: '#e9e9e9',
    padding: 10,
    maxWidth: 1024,
    jumpType: 1,
    closeClickOutside: false,
    bookmark: []
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
      ...pick(formData, [
        'textFontSize',
        'textColor',
        'padding'
      ]),
      boxShadow: {
        label: '容器阴影',
        type: 'input',
        attrs: {
          placeholder: '请输入合法的box-shadow值'
        }
      },
      maxWidth: {
        label: '最大宽度',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 200,
          max: 2048,
          style: 'width: 120px'
        }
      },
      jumpType: {
        label: '网页跳转方式',
        type: 'radio-group',
        radio: {
          list: [
            {
              name: '新窗口打开',
              value: 1
            },
            {
              name: '当前页跳转',
              value: 2
            }
          ],
          label: 'name',
          value: 'value'
        }
      },
      closeClickOutside: {
        label: '弹窗快速关闭',
        type: 'switch',
        tips: '文件夹弹窗是否可以点击外层进行关闭'
      }
    }
  }
}
