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
          pickerOptions: {
            disabledDate(time: Date) {
              return time.getTime() < Date.now();
            }
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
      position: {
        label: '文本对齐',
        slot: () => <position-selector vModel={formData.position}></position-selector>
      },
      textFontSize: {
        label: '字体大小',
        slot: () => {
          return (
            <div style="display:flex;align-item: center">
              <el-input-number vModel={formData.textFontSize} controls-position="right" min={12} max={256} style="width: 100px" />
              <span style="margin-left: 10px;font-weight:bold">px</span>
            </div>
          )
        }
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