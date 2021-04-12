type KeySetting = {
  key: string;
  url: string;
  remark?: string;
}

export default {
  minWidth: 12,
  formData: {
    userSettingKeyMap: {} as Record<string, KeySetting>,
    padding: 0
  },
  formConf (formData: any) {
    return {
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
