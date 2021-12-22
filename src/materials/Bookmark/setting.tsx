import pick from '../base'
export default {
  formData: {
    boxSize: 48,
    boxRadius: 4,
    iconSize: 24,
    textFontSize: 14,
    textColor: '#e9e9e9',
    padding: 10,
    maxWidth: 1024,
    bookmark: [
      {
        id: 'b8d7c3',
        title: 'Howdz起始页',
        url: 'https://s.kongfandong.cn'
      },
      {
        id: 'fad7c2',
        title: '百度',
        url: 'https://www.baidu.com'
      },
      {
        id: 'f99ec1',
        title: '个人博客',
        url: 'https://kongfandong.cn'
      },
      {
        id: 'c78f59',
        title: '必应',
        url: 'https://cn.bing.com/'
      },
      {
        id: '99e427',
        title: 'UNSHPLASH',
        url: 'https://unsplash.com'
      },
      {
        id: '96299b',
        title: 'Element UI',
        url: 'https://element.eleme.cn/#/zh-CN/component/icon'
      },
      {
        id: 'd95a25',
        title: 'Github',
        url: 'https://github.com/'
      },
      {
        id: 'f0b4e5',
        title: '有道翻译',
        url: 'https://fanyi.youdao.com/'
      }
    ]
  },
  formConf (formData: any) {
    return {
      boxSize: {
        label: '图标容器尺寸',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 20,
          max: 120,
          style: 'width: 120px'
        },
        tips: '图标外层容器的大小，只能为正方形'
      },
      boxRadius: {
        label: '容器圆角',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 0,
          max: 120,
          style: 'width: 120px'
        }
      },
      iconSize: {
        label: '图标尺寸',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 16,
          max: 120,
          style: 'width: 120px'
        }
      },
      ...pick(formData, [
        'textFontSize',
        'textColor',
        'padding'
      ]),
      maxWidth: {
        label: '最大宽度',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 200,
          max: 2048,
          style: 'width: 120px'
        }
      }
    }
  }
}
