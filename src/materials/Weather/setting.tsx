export default {
  formData: {
    weatherMode: 1,
    cityName: '',
    duration: 15,
    position: 5,
    baseFontSize: 16,
    textColor: '#262626',
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
          validator: (rule: any, value: any, callback: Function) => {
            if (formData.weatherMode === 2 && !value) {
              callback(new Error('请输入城市名'))
            }
            callback();
          }
        }]
      },
      duration: {
        label: '自动刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 5,
          max: 12 * 60
        },
        tips: '刷新频率,单位为分钟'
      },
      position: {
        label: '文本对齐',
        slot: () => <position-selector vModel={formData.position}></position-selector>
      },
      baseFontSize: {
        label: '基础字体大小',
        slot: () => {
          return (
            <div style="display:flex;align-item: center">
              <el-input-number vModel={formData.baseFontSize} controls-position="right" min={12} max={256} style="width: 100px" />
              <span style="margin-left: 10px;font-weight:bold">px</span>
            </div>
          )
        },
        tips: '组件的字体大小基于em单位，可以更改该参数设置组件字体显示'
      },
      textColor: {
        label: '字体颜色',
        slot: () => <standard-color-picker vModel={formData.textColor} />
      },
      textShadow: {
        label: '字体阴影',
        type: 'input',
        tips: '基于CSS3的text-shadow属性，应输入合法的CSS字体阴影代码片段'
      },
      iconShadow: {
        label: '图标阴影',
        type: 'input',
        tips: '基于CSS3的filter:drop-shadow()属性，应输入合法的drop-shadow阴影代码片段'
      },
      fontFamily: {
        label: '字体库',
        slot: () => <font-selector vModel={formData.fontFamily} showRefresh></font-selector>
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