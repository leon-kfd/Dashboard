import pick from '../base'
export default {
  formData: {
    eventName: '',
    eventTime: '',
    unit: '小时',
    position: 5,
    textFontSize: 16,
    textColor: '#262626',
    textShadow: '0 0 2px #464646',
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      eventName: {
        label: '目标事件名称',
        type: 'input',
        attrs: {
          placeholder: '请输入事件名称'
        }
      },
      eventTime: {
        label: '目标事件时间',
        type: 'date-picker',
        attrs: {
          type: 'datetime',
          placeholder: "选择日期时间",
          format: 'YYYY-MM-DD HH:mm',
          disabledDate(time: Date) {
            return time.getTime() < Date.now();
          }
        }
      },
      unit: {
        label: '时间单位',
        type: 'select',
        option: {
          list: ['天', '小时', '分钟']
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