
import { themeFactory } from '@milkdown/core';
import { font, size, color, mixin, override, view } from '@milkdown/theme-nord';
import { injectGlobal } from '@emotion/css';

const iconMapping: Record<string, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  loading: 'loading',
  quote: 'quote',
  code: 'code',
  table: 'table',
  divider: 'line',
  image: 'image',
  brokenImage: 'image',
  bulletList: 'unorder-list',
  orderedList: 'order-list',
  taskList: 'checklist',
  bold: 'bold',
  italic: 'italic',
  inlineCode: 'code',
  strikeThrough: 'text-delete',
  link: 'link',
  leftArrow: 'arrow-left',
  rightArrow: 'arrow-right',
  upArrow: 'arrow-up',
  downArrow: 'arrow-down',
  alignLeft: 'align-left',
  alignRight: 'align-right',
  alignCenter: 'align-center',
  delete: 'delete',
  select: 'select-all',
  unchecked: 'unchecked',
  checked: 'checked',
};

export default themeFactory({
  font,
  size,
  color: color.lightColor,
  mixin,
  slots: () => ({
    icon: (id) => {
      const span = document.createElement('span');
      span.className = `icon ed-icon icon-${iconMapping[id]}`;
      return span;
    },
  }),
  global: (themeTool) => {
    const css = injectGlobal;
    css`
          ${view};
          ${override(themeTool)}
      `;
  }
});
