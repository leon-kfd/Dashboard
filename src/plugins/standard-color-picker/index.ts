import { App } from 'vue';
import StandardColorPicker from './standard-color-picker.vue';

declare type SFCWithInstall<T> = T & {
  install(app: App): void;
};

StandardColorPicker.install = (app: App): void => {
  app.component(StandardColorPicker.name, StandardColorPicker);
};

const _StandardColorPicker = StandardColorPicker as SFCWithInstall<typeof StandardColorPicker>;

export default _StandardColorPicker;