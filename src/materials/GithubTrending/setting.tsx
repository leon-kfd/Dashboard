import pick from '../base'
export default {
  formData: {
    limit: 10,
    duration: 5,
    showTitle: true,
    clickActionType: 0,
    position: 5,
    textFontSize: 16,
    textColor: '#d8d8d8',
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
          max: 30,
          style: 'width: 100px'
        },
      },
      duration: {
        label: '刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 5,
          max: 120,
          style: 'width: 100px'
        },
        tips: 'durationMinuteTips',
        unit: 'min'
      },
      ...pick(formData, [
        'showTitle',
        'clickActionType',
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
