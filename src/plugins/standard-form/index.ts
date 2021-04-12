import { App } from 'vue';
import StandardForm from './src/standard-form.vue';
import type { SFCWithInstall } from '@/utils/types'

StandardForm.install = (app: App): void => {
  app.component(StandardForm.name, StandardForm);
};

const _StandardForm = StandardForm as SFCWithInstall<typeof StandardForm>;

export default _StandardForm;
