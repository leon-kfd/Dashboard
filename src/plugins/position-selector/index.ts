import { App } from 'vue';
import PositionSelector from './position-selector.vue';
import type { SFCWithInstall } from '@/utils/types'
import mapPosition from './mapPosition'

PositionSelector.install = (app: App): void => {
  app.component(PositionSelector.name, PositionSelector);
};

const _PositionSelector = PositionSelector as SFCWithInstall<typeof PositionSelector>;

export default _PositionSelector;

export {
  mapPosition
}
