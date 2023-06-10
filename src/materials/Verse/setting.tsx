import pick from '../base'
export default {
  formData: {
    duration: 5,
    clickActionType: 0,
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
          min: 1,
          max: 12 * 60,
          style: 'width: 100px'
        },
        unit: 'min',
        tips: 'durationMinuteTips'
      },
      clickActionType: {
        label: '点击文本行为',
        type: 'select',
        option: {
          list: [
            { label: '无', value: 0 },
            { label: '切换下一个', value: 1 },
            { label: '跳转查看出处', value: 2 },
            { label: '复制文本', value: 3 }
          ],
          label: 'label',
          value: 'value'
        },
        tips: 'clickVerseActionTypeTips'
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
