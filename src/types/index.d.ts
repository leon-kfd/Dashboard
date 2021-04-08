interface ComponentOptions {
  id?: string;
  sizeWidth: number;
  sizeHeight: number;
  material: number;
  background: string;
  boxShadow?: string;
  borderRadius?: string;
  componentSetting?: Record<string, any>
}

interface ComponentSetting {
  formData: Record<string, any>,
  formConf: Record<string, any> | ((formData: any) => Record<string, any>)
}
