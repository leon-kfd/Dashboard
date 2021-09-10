interface AffixInfo {
  mode: number;
  x: number;
  y: number;
}
interface ComponentOptions {
  id?: string;
  position: number;
  affixInfo?: AffixInfo;
  sizeWidth: number;
  // sizeWidthUnit: number;
  sizeHeight: number;
  // sizeHeightUnit: number;
  material: number;
  background: string;
  backgroundFilter: string;
  boxShadow?: string;
  borderRadius?: number;
  componentSetting?: Record<string, any>
}

interface ComponentSetting {
  formData: Record<string, any>,
  formConf: Record<string, any> | ((formData: any) => Record<string, any>),
  minWidth?: number;
}
