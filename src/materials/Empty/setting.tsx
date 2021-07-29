import pick from '../base'
export default {
  formData: {
    customText: '',
    position: 5,
    textFontSize: 16,
    textColor: '#c8c8c8',
    textShadow: '0 0 1px #464646',
    padding: 10,
    fontFamily: ''
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
      ...pick(formData, [
        'position',
        'textFontSize',
        'textColor',
        'textShadow',
        'fontFamily',
        'padding'
      ])
    }
  }
}
