import pick from '../base'
export default {
  formData: {
    duration: 5000,
    position: 5,
    textFontSize: 16,
    textColor: '#d8d8d8',
    textShadow: '0 0 1px #464646',
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      duration: {
        label: '刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1000,
          max: 60000,
          step: 1000,
          style: 'width: 100%'
        },
        tips: '定时器刷新频率,单位为ms'
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
  },
}
