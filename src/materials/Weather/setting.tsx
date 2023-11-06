import pick from '../base'
export default {
  formData: {
    weatherMode: 1,
    cityName: '',
    animationIcon: true,
    duration: 120,
    position: 5,
    baseFontSize: 16,
    textColor: '#d8d8d8',
    textShadow: '0 0 1px #464646',
    iconShadow: '0 0 1px #464646',
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      weatherMode: {
        label: '天气城市',
        type: 'radio-group',
        radio: {
          list: [
            {
              name: '自动获取(IP)',
              value: 1
            },
            {
              name: '手动输入',
              value: 2
            }
          ],
          label: 'name',
          value: 'value'
        }
      },
      cityName: {
        when: (formData: any) => formData.weatherMode === 2,
        type: 'input',
        attrs: {
          placeholder: '请输入城市名(目前仅支持中国城市名)',
          clearable: true
        },
        rules: [{
          required: true,
          validator: (rule: any, value: any, callback: any) => {
            if (formData.weatherMode === 2 && !value) {
              callback(new Error('请输入城市名'))
            }
            callback();
          }
        }]
      },
      animationIcon: {
        label: '动画图标',
        type: 'switch',
        tips: '默认使用含动画的ICON，若想提高性能可关闭使用静态ICON'
      },
      duration: {
        label: '刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 60,
          max: 12 * 60,
          step: 10,
          style: 'width: 100px'
        },
        unit: 'min',
        tips: 'durationMinuteTips'
      },
      ...pick(formData, [
        'position',
        'baseFontSize',
        'textColor',
        'textShadow',
        'iconShadow',
        'fontFamily',
        'padding'
      ])
    }
  }
}
