import { App } from 'vue';
import StandardForm from './src/standard-form.vue';

StandardForm.install = (app: App): void => {
  app.component(StandardForm.name, StandardForm);
};

export default StandardForm;
