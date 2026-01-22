import { CustomMouseMenu } from '@howdyjs/mouse-menu'
import { useStore } from '@/store'
import { onLongPress } from '@vueuse/core';

let MouseMenuCtx: any;
let mouseDownEvent: any;
let longPressEvent: any;
const mounted = (el: HTMLElement, binding: any) => {
  const store = useStore()
  const lang = store.global.lang
  const { value } = binding;
  const options = {
    width: lang === 'en' ? 200: 160,
    menuList: [],
    hasIcon: true,
    iconType: 'font-icon',
    ...value
  };
  const menuWrapperCss = {
    background: '#ffffff',
    borderRadius: '8px',
    padding: '8px 6px',
    boxShadow: '0 2px 12px 0 rgba(0,0,0,.1)',
    lineColor: '#eee',
    lineMargin: '5px 10px',
    ...value.menuWrapperCss
  };
  const menuItemCss = {
    arrowSize: '10px',
    iconFontSize: '18px',
    labelColor: '#5E6370',
    iconColor: '#5E6370',
    ...value.menuItemCss
  };
  if (typeof options.drop === 'function') {
    if (options.drop()) return
  }
  if (options.menuList.length > 0) {
    if (!('ontouchstart' in window)) {
      mouseDownEvent = (e: MouseEvent) => {
        if (typeof options.disabled === 'function' && options.disabled(options.params, e.target, el)) {
          return
        }
        MouseMenuCtx = CustomMouseMenu({
          el,
          menuList: options.menuList,
          params: options.params,
          menuWidth: options.width,
          hasIcon: options.hasIcon,
          iconType: options.iconType,
          menuHiddenFn: options.menuHiddenFn,
          menuWrapperCss,
          menuItemCss,
        });
        if (e.button === 2) {
          e.stopPropagation();
          document.oncontextmenu = (e: MouseEvent) => {
            e.preventDefault();
            const { x, y } = e;
            MouseMenuCtx.show(x, y);
          };
          document.onmousedown = () => {
            document.oncontextmenu = null
            MouseMenuCtx.close();
          };
        } else {
          MouseMenuCtx.close();
        }
      };
      el.removeEventListener('mousedown', mouseDownEvent);
      el.addEventListener('mousedown', mouseDownEvent);
    }
    // longpress
    if ('ontouchstart' in window) {
      longPressEvent = (e: PointerEvent) => {
        e.preventDefault()
        if (typeof options.disabled === 'function' && options.disabled(options.params, e.target, el)) {
          return
        }
        try {
          // 执行轻微震动
          navigator.vibrate(100)
        } catch {
          // 不支持震动
        }
        MouseMenuCtx = CustomMouseMenu({
          el,
          menuList: options.menuList,
          params: options.params,
          menuWidth: options.width,
          hasIcon: options.hasIcon,
          iconType: options.iconType,
          menuHiddenFn: options.menuHiddenFn,
          menuWrapperCss,
          menuItemCss,
        });
        // const { touches } = e;
        // const { clientX, clientY } = touches[0]
        const { clientX, clientY } = e
        MouseMenuCtx.show(clientX, clientY);
        document.onmousedown = null
        el.onmousedown = null
        setTimeout(() => {
          document.onmousedown = () => {
            MouseMenuCtx.close();
          }
          el.onmousedown = () => {
            MouseMenuCtx.close()
          }
        }, 500)
      }
      onLongPress(el, longPressEvent)
    }
  } else {
    throw new Error('At least set one menu list!');
  }
};

const unmounted = (el: HTMLElement) => {
  el.removeEventListener('mousedown', mouseDownEvent);
};

export default {
  mounted,
  unmounted
};
