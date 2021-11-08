import pick from '../base'
export default {
  formData: {
    showPoster: true,
    posterFilter: 'brightness(0.6)',
    showCite: true,
    duration: 5,
    position: 5,
    textFontSize: 24,
    textColor: '#ffffff',
    textShadow: '0 0 2px #363636',
    fontFamily: '',
    padding: 10,
    showDecoration: true,
    themeColor: '#69c0eb'
  },
  formConf(formData: any) {
    return {
      showPoster: {
        label: '展示海报背景',
        slot: () => {
          return (
            <div>
              <el-switch v-model={formData.showPoster}></el-switch>
              {formData.showPoster && <background-filter-selector v-models={[[formData.posterFilter, 'filter']]} style="margin-left: -80px" />}
            </div>
          )
        }
      },
      showCite: {
        label: '展示电影名字',
        type: 'switch'
      },
      duration: {
        label: '自动刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 1,
          max: 12 * 60,
          style: 'width: 100%'
        },
        tips: '刷新频率,单位为分钟'
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
      }
    }
  },
}
