import pick from '../base'
export default {
  formData: {
    showPoster: true,
    posterType: 1,
    posterFilter: 'brightness(0.4)',
    showCite: true,
    duration: 5,
    position: 5,
    clickActionType: 0,
    textFontSize: 24,
    textColor: '#ffffff',
    textShadow: '0 1px 3px #363636',
    fontFamily: '',
    padding: 10,
    showDecoration: true,
    themeColor: '#69c0eb',
    maxWidth: 600,
    useSpotlight: false
  },
  formConf(formData: any) {
    return {
      showPoster: {
        label: '展示电影图片',
        slot: () => {
          return (
            <div>
              <el-switch v-model={formData.showPoster}></el-switch>
              {formData.showPoster && <background-filter-selector v-models={[[formData.posterFilter, 'filter']]} style="margin-left: -80px" />}
            </div>
          )
        }
      },
      posterType: {
        when: (formData: any) => formData.showPoster,
        label: '图片类型',
        type: 'radio-group',
        radio: {
          list: [
            {
              name: '电影海报',
              value: 1
            },
            {
              name: '剧照壁纸',
              value: 2
            }
          ],
          label: 'name',
          value: 'value'
        },
        tips: '剧照壁纸较适合在横屏的组件中，且图片较高清'
      },
      showCite: {
        label: '展示电影名字',
        type: 'switch'
      },
      duration: {
        label: '刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1,
          max: 12 * 60,
          style: 'width: 120px'
        },
        tips: 'durationMinuteTips'
      },
      clickActionType: {
        label: '点击文本行为',
        type: 'select',
        option: {
          list: [
            { label: '无', value: 0 },
            { label: '切换下一个', value: 1 },
            { label: '跳转查看出处', value: 2 },
            { label: '复制台词', value: 3 }
          ],
          label: 'label',
          value: 'value'
        },
        tips: 'clickMovieLinesActionTypeTips'
      },
      ...pick(formData, [
        'position',
        'textFontSize',
        'textColor',
        'textShadow',
        'fontFamily',
        'padding'
      ]),
      showDecoration: {
        label: '展示边框装饰',
        type: 'switch'
      },
      themeColor: {
        when: (formData: any) => formData.showDecoration,
        label: '装饰线颜色',
        slot: () => <standard-color-picker vModel={formData.themeColor} />
      },
      useSpotlight: {
        when: (formData: any) => formData.showPoster,
        label: '聚光灯滤镜',
        type: 'switch',
        tips: 'spotlightTips'
      },
      maxWidth: {
        label: '盒子最大宽度',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 100,
          max: 4080,
        }
      }
    }
  },
}
