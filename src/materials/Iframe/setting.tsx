export default {
  formData: {
    url: ''
  },
  formConf (formData: any) {
    return {
      url: {
        label: 'URL',
        type: 'input',
        attrs: {
          placeholder: '请输入Iframe目标URL'
        },
        rules: [
          { pattern: /[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/, message: '请输入正确URL', trigger: 'blur'}
        ]
      }
    }
  }
}