export default {
  minWidth: 8,
  formData: {
    engineList: [
      {
        name: 'Bing-CN',
        link: 'https://cn.bing.com/search?q=',
        iconType: 'local',
        iconPath: 'https://kongfandong.cn/images/icons/bing.svg'
      },
      {
        name: 'Bing-EN',
        link: 'https://cn.bing.com/search?ensearch=1&q=',
        iconType: 'local',
        iconPath: 'https://kongfandong.cn/images/icons/bing-en.svg'
      },
      {
        name: '百度',
        link: 'https://www.baidu.com/s?wd=',
        iconType: 'local',
        iconPath: 'https://kongfandong.cn/images/icons/baidu.svg'
      },
      {
        name: '有道词典',
        link: 'http://dict.youdao.com/w/',
        iconType: 'local',
        iconPath: 'https://kongfandong.cn/images/icons/youdao.svg'
      }
    ],
    backupEngineList: [
      {
        name: 'Google',
        link: 'https://www.google.com/search?q=',
        iconType: 'local',
        iconPath: 'https://kongfandong.cn/images/icons/google.svg'
      },
      {
        name: '搜狗',
        link: 'https://www.sogou.com/tx?query=',
        iconType: 'local',
        iconPath: 'https://kongfandong.cn/images/icons/sougou.svg'
      },
      {
        name: 'Bilibili',
        link: 'https://search.bilibili.com/all?keyword=',
        iconType: 'local',
        iconPath: 'https://kongfandong.cn/images/icons/bilibili.svg'
      },
      {
        name: '淘宝',
        link: 'https://s.taobao.com/search?q=',
        iconType: 'local',
        iconPath: 'https://kongfandong.cn/images/icons/taobao.svg'
      }
    ],
    showTabTips: true,
    position: 5,
    boxShadow: '0 0 4px #aab2b2',
    padding: 0
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
      position: {
        label: '对齐方式',
        slot: () => <position-selector vModel={formData.position}></position-selector>
      },
      boxShadow: {
        label: '搜索栏阴影',
        type: 'input',
        tips: '基于CSS3的box-shadow属性，应输入合法的CSS盒子阴影代码片段'
      },
      padding: {
        label: '盒子内边距',
        slot: () => {
          return (
            <div style="display:flex;align-item: center">
              <el-input-number vModel={formData.padding} controls-position="right" min={0} max={256} style="width: 100px" />
              <span style="margin-left: 10px;font-weight:bold">px</span>
            </div>
          )
        }
      }
    }
  }
}
