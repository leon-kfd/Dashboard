import pick from '../base'
export default {
  formData: {
    todo: {},
    themeColor: '#643a7a',
    baseFontSize: 16,
    padding: 10
  },
  formConf (formData: any) {
    return {
      themeColor: {
        label: '主题颜色',
        slot: () => <standard-color-picker vModel={formData.themeColor} />
      },
      ...pick(formData, [
        'baseFontSize',
        'padding'
      ])
    }
  }
}