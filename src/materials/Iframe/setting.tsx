export default {
  formData: {
    url: '',
    duration: 0,
  },
  formConf () {
    return {
      url: {
        label: 'URL',
        type: 'input',
        attrs: {
          placeholder: '请输入Iframe目标URL'
        },
        rules: [
          { pattern: /[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/, message: '请输入正确URL', trigger: 'blur' }
        ]
      },
      duration: {
        label: '刷新频率',
        type: 'input-number',
        attrs: {
          'controls-position': 'right',
          min: 0,
          max: 12 * 60,
          style: 'width: 100px'
        },
        unit: 'min',
        tips: 'iframeRefreshTips'
      },
      useCache: {
        label: '缓存节点',
        type: 'switch',
        tips: 'iframeCacheTips'
      }
    }
  }
}
