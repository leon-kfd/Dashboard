import pick from '../base'
const DAYJS_FORMAT_LINK = 'https://day.js.org/docs/zh-CN/display/format'
export default {
  formData: {
    formatter: 'M月D日 dddd',
    custom: '',
    chineseWeekDay: true,
    timeZone: '',
    duration: 5,
    position: 5,
    textFontSize: 16,
    textColor: '#d8d8d8',
    textShadow: '0 0 1px #464646',
    showTTS1: false,
    showTTS2: false,
    ttsFontSize: 16,
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      formatter: {
        label: '格式化',
        type: 'radio-group',
        attrs: {
          class: 'block-radio-group'
        },
        radio: {
          list: [
            'M月D日 dddd',
            'YYYY-MM-DD HH:mm:ss',
            'YYYY-MM-DD HH:mm dddd',
            '自定义'
          ]
        },
        tips: 'dayjsFormatterTips'
      },
      custom: {
        when: (formData: any) => formData.formatter === '自定义',
        formItemStyle: {
          marginTop: '-15px'
        },
        type: 'input',
        attrs: {
          placeholder: '请自定义的Dayjs格式',
          clearable: true
        },
        rules: [{
          required: true,
          validator: (rule: any, value: any, callback: any) => {
            if (formData.formatter === '自定义' && !value) {
              callback(new Error('请输入自定义的Dayjs格式'))
            }
            callback();
          }
        }],
        tips: 'dayjsFormatterTips'
      },
      dayLinkTips: {
        formItemStyle: {
          marginTop: '-12px'
        },
        slot: () => <a href={DAYJS_FORMAT_LINK} target="_blank" rel="noreferrer" style="font-weight:bold;">Dayjs格式化参考此处</a>
      },
      chineseWeekDay: {
        label: '展示中文星期',
        type: 'switch',
        tips: 'chineseWeekDayTips'
      },
      timeZone: {
        label: '时区',
        type: 'select',
        attrs: {
          placeholder: '请选择时区',
          clearable: true,
          allowCreate: true,
          filterable: true
        },
        option: {
          list: [
            { label: '跟随系统', value: '' },
            { label: '北京', value: 'Asia/Shanghai' },
            { label: '东京', value: 'Asia/Tokyo' },
            { label: '纽约', value: 'America/New_York' },
            { label: '伦敦', value: 'Europe/London' },
            { label: '巴黎', value: 'Europe/Paris' },
            { label: '悉尼', value: 'Australia/Sydney' },
            { label: '迪拜', value: 'Asia/Dubai' },
            { label: '洛杉矶', value: 'America/Los_Angeles' }
          ],
          label: 'label',
          value: 'value'
        },
        tips: 'timeZoneTips'
      },
      duration: {
        label: '刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1,
          max: 24 * 3600,
          step: 1,
          style: 'width: 100%'
        },
        tips: 'durationSecondTips'
      },
      ...pick(formData, [
        'position',
        'textFontSize',
        'textColor',
        'textShadow',
        'fontFamily',
        'padding'
      ]),
      showTTS1: {
        label: 'TTS文本①',
        type: 'switch',
        tips: '展示`回答明天放假吗`TTS文本，API由http://timor.tech/api/holiday/tts/tomorrow提供'
      },
      showTTS2: {
        label: 'TTS文本②',
        type: 'switch',
        tips: '展示`最近的一个节假日安排`TTS文本，API由http://timor.tech/api/holiday/tts/next提供'
      },
      ttsFontSize: {
        label: 'TTS字体大小',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 12,
          max: 256,
          style: 'width: 100px'
        },
        unit: 'px'
      }
    }
  },
}
