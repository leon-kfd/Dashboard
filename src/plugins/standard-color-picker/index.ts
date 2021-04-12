import { App } from 'vue';
import StandardColorPicker from './standard-color-picker.vue';
import type { SFCWithInstall } from '@/utils/types'

StandardColorPicker.install = (app: App): void => {
  app.component(StandardColorPicker.name, StandardColorPicker);
};

const _StandardColorPicker = StandardColorPicker as SFCWithInstall<typeof StandardColorPicker>;

export default _StandardColorPicker;
