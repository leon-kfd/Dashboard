import pick from '../base'
export default {
  formData: {
    engineList: [
      {
        name: 'Bing-CN',
        link: 'https://cn.bing.com/search?q=',
        iconType: 'local',
        iconPath: 'https://s.kongfandong.cn/img/icons/bing.svg'
      },
      {
        name: 'Google',
        link: 'https://www.google.com/search?q=',
        iconType: 'local',
        iconPath: 'https://s.kongfandong.cn/img/icons/google.svg'
      },
      {
        name: '百度',
        link: 'https://www.baidu.com/s?wd=',
        iconType: 'local',
        iconPath: 'https://s.kongfandong.cn/img/icons/baidu.svg'
      },
      {
        name: '有道词典',
        link: 'http://dict.youdao.com/w/',
        iconType: 'local',
        iconPath: 'https://s.kongfandong.cn/img/icons/youdao.svg'
      }
    ],
    backupEngineList: [
      {
        name: 'Bing-EN',
        link: 'https://cn.bing.com/search?ensearch=1&q=',
        iconType: 'local',
        iconPath: 'https://s.kongfandong.cn/img/icons/bing-en.svg'
      },
      {
        name: '搜狗',
        link: 'https://www.sogou.com/tx?query=',
        iconType: 'local',
        iconPath: 'https://s.kongfandong.cn/img/icons/sougou.svg'
      },
      {
        name: 'Bilibili',
        link: 'https://search.bilibili.com/all?keyword=',
        iconType: 'local',
        iconPath: 'https://s.kongfandong.cn/img/icons/bilibili.svg'
      },
      {
        name: '淘宝',
        link: 'https://s.taobao.com/search?q=',
        iconType: 'local',
        iconPath: 'https://s.kongfandong.cn/img/icons/taobao.svg'
      }
    ],
    showTabTips: true,
    jumpType: 1,
    keywordLink: true,
    rememberHistory: false,
    rememberHistoryList: [],
    position: 5,
    boxShadow: '0 0 4px #aab2b2',
    boxBackground: 'rgba(255,255,255,0.9)',
    boxRadius: 4,
    maxWidth: 600,
    focusBgAnimation: false,
    padding: 10
  },
  formConf (formData: any) {
    return {
      engineList: {
        slot: () => {
          return (
            <engine-config
              engineList={formData.engineList}
              backupEngineList={formData.backupEngineList}
              onUpdate={
                (value: any) => {
                  formData.engineList = JSON.parse(JSON.stringify(value.engineList))
                  formData.backupEngineList = JSON.parse(JSON.stringify(value.backupEngineList))
                }
              }>
            </engine-config>
          )
        }
      },
      keywordLink: {
        label: '关键词联想',
        type: 'switch'
      },
      rememberHistory: {
        label: '记录搜索历史',
        type: 'switch',
        tips: '最多只会记录10条'
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
            }
          ],
          label: 'name',
          value: 'value'
        }
      },
      ...pick(formData, 'position'),
      boxShadow: {
        label: '搜索栏阴影',
        type: 'input',
        tips: '基于CSS3的box-shadow属性，应输入合法的CSS盒子阴影代码片段'
      },
      boxBackground: {
        label: '搜索栏背景',
        slot: () => <standard-color-picker vModel={formData.boxBackground} show-alpha/>
      },
      boxRadius: {
        label: '搜索栏圆角',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 0,
          max: 40,
          style: 'width: 120px'
        }
      },
      maxWidth: {
        label: '最大宽度',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 300,
          max: 1920,
          style: 'width: 120px'
        }
      },
      focusBgAnimation: {
        label: '聚焦背景动画',
        type: 'switch'
      },
      ...pick(formData, 'padding'),
    }
  }
}
