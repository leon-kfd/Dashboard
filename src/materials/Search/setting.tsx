import { engineList, backupEngineList } from './DefaultEngine'
import pick from '../base'
export default {
  formData: {
    engineList,
    backupEngineList,
    showTabTips: true,
    jumpType: 1,
    keywordLink: true,
    position: 5,
    boxShadow: '0 0 4px #aab2b2',
    boxBackground: 'rgba(255,255,255,0.9)',
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
      ...pick(formData, 'padding'),
    }
  }
}
