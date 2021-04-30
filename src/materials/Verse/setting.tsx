import pick from '../base'
export default {
  formData: {
    duration: 5,
    position: 5,
    textFontSize: 16,
    textColor: '#262626',
    textShadow: '0 0 2px #464646',
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      duration: {
        label: '自动刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1,
          max: 12 * 60,
          style: 'width: 100%'
        },
        tips: '刷新频率,单位为分钟'
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
