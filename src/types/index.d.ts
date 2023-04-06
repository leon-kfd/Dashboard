interface AffixInfo {
  mode: number;
  x: number;
  y: number;
}

interface GlobalOptions {
  background: string;
  backgroundFilter?: string;
  lang?: string;
  gutter?: number;
  css?: string;
  js?: string;
  globalFontFamily?: string;
  loadHarmonyOSFont?: boolean;
  siteTitle?: string;
  disabledDialogAnimation?: boolean;
  showMenuBtn?: boolean;
}

interface ActionClickValueOption {
  url: string;
  material: string;
  w: number;
  h: number;
  background: string;
  backgroundFilter: string;
  direction: number;
  boxShadow: string;
  borderRadius: number;
  componentSetting: Record<string, any>;
}

interface ActionSetting {
  actionType: 0 | 1;
  actionClickType: 1 | 2 | 3;
  actionClickValue: ActionClickValueOption;
}

interface ComponentOptions {
  i?: string;
  position: number;
  affixInfo?: AffixInfo;
  w: number;
  h: number;
  x?: number;
  y?: number;
  material: string;
  background: string;
  backgroundFilter: string;
  boxShadow?: string;
  borderRadius?: number;
  componentSetting?: Record<string, any>;
  actionSetting?: ActionSetting | null;
  zIndex?: number;
  customId?: string;
  refresh?: boolean;
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
