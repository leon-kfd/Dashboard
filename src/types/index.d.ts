interface AffixInfo {
  mode: number;
  x: number;
  y: number;
}
interface ComponentOptions {
  i?: string;
  position: number;
  affixInfo?: AffixInfo;
  w: number;
  h: number;
  material: string;
  background: string;
  backgroundFilter: string;
  boxShadow?: string;
  borderRadius?: number;
  componentSetting?: Record<string, any>;
  actionSetting?: Record<string, any>;
  zIndex?: number;
  customId?: string;
}

interface ComponentSetting {
  formData: Record<string, any>,
  formConf: Record<string, any> | ((formData: any) => Record<string, any>),
  minWidth?: number;
}

interface MaterialConstanst {
  label: string,
  text: string,
  img?: string
}

interface Bookmark {
  id: string,
  type: 'icon' | 'folder' | 'file',
  title?: string,
  url?: string,
  iconType?: 'api' | 'text' | 'network',
  iconPath?: string,
  bgColor?: string,
  children?: Bookmark[]
}
