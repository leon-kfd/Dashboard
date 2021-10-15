import pick from '../base'
export default {
  formData: {
    limit: 10,
    duration: 5,
    position: 5,
    textFontSize: 16,
    textColor: '#c8c8c8',
    textShadow: '0 0 1px #464646',
    iconShadow: '0 0 1px #464646',
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      limit: {
        label: '列表条目数',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 5,
          max: 20,
          style: 'width: 120px'
        },
      },
      duration: {
        label: '刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 5,
          max: 120,
          style: 'width: 120px'
        },
        tips: '定时刷新频率,单位为分钟'
      },
      ...pick(formData, [
        'position',
        'textFontSize',
        'textColor',
        'textShadow',
        'iconShadow',
        'fontFamily',
        'padding'
      ])
    }
  }
}
