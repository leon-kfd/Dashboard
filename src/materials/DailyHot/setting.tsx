import { DAILY_HOT_CLASSIFY } from '@/constanst'
import pick from '../base'
export default {
  formData: {
    enableList: ['weibo', 'zhihu', 'sspai', 'bilibili'],
    limit: 10,
    position: 5,
    textFontSize: 12,
    textColor: '#d8d8d8',
    textShadow: '0 0 1px #464646',
    fontFamily: '',
    padding: 10
  },
  formConf (formData: any) {
    return {
      enableList: {
        label: '热榜站点',
        type: 'checkbox-group',
        checkbox: {
          list: DAILY_HOT_CLASSIFY,
          label: 'label',
          value: 'value',
          attrs: {
            style: 'display: block; height: 24px;'
          }
        },
        attrs: {
          style: 'padding-top: 8px;'
        }
      },
      limit: {
        label: '列表条目数',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 5,
          max: 20,
          style: 'width: 100px'
        },
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
