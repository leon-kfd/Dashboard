import pick from '../base'

type KeySetting = {
  key: string;
  url: string;
  remark?: string;
  iconType?: string;
  iconLink?: string;
}

export default {
  formData: {
    userSettingKeyMap: {} as Record<string, KeySetting>,
    position: 5,
    useKeyboardEvent: true,
    jumpType: 1,
    keyboardMaxWidth: 920,
    keyGutter: 8,
    keyBorderRadius: 4,
    keyBackground: 'rgba(255,255,255,0.9)',
    padding: 10,
    fontFamily: '',
  },
  formConf (formData: any) {
    return {
      position: {
        label: '对齐方式',
        slot: () => <position-selector vModel={formData.position}></position-selector>
      },
      keyboardMaxWidth: {
        label: '键盘最大宽度',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 720,
          max: 1280,
          style: 'width: 100px'
        },
        unit: 'px'
      },
      useKeyboardEvent: {
        label: '快捷按键',
        type: 'switch',
        tips: 'keyboardEventTips'
      },
      jumpType: {
        label: '网页跳转方式',
        type: 'radio-group',
        radio: {
          list: [
            {
              name: '新窗口打开',
              value: 1
            },
            {
              name: '当前页跳转',
              value: 2
            },
            {
              name: '页面内Iframe打开',
              value: 3
            }
          ],
          label: 'name',
          value: 'value'
        }
      },
      keyGutter: {
        label: '按键间隔',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 2,
          max: 32,
          style: 'width: 100px'
        },
        unit: 'px'
      },
      keyBorderRadius: {
        label: '按键圆角',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 0,
          max: 16,
          style: 'width: 100px'
        },
        unit: 'px'
      },
      keyBackground: {
        label: '按键背景色',
        slot: () => <standard-color-picker vModel={formData.keyBackground} show-alpha />
      },
      ...pick(formData, [
        'padding',
        'fontFamily',
      ])
    }
  }
}
