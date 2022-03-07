import { CustomMouseMenu } from '@howdyjs/mouse-menu'
import { useStore } from '@/store'

let MouseMenuCtx: any;

// 二次封装以适应移动端长按弹出菜单
const longPressDuration = 500
let longPressTimer: number
let longPressTouchStart: any
let longPressTouchEnd: any
function addLongPressListener(el: HTMLElement, fn: any) {
  const store = useStore()
  longPressTouchStart = (e: any) => {
    if (!store.isLock) {
      MouseMenuCtx && MouseMenuCtx.close()
      e.preventDefault()
    }
    if (longPressTimer) clearTimeout(longPressTimer)
    longPressTimer = window.setTimeout(() => {
      fn(e)
    }, longPressDuration)
  }
  longPressTouchEnd = () => {
    clearTimeout(longPressTimer)
  }
  el.addEventListener('touchstart', longPressTouchStart)
  el.addEventListener('touchmove', longPressTouchEnd)
  el.addEventListener('touchend', longPressTouchEnd)
  el.addEventListener('touchcancel', longPressTouchEnd)
}
function removeLongPressListener(el: HTMLElement) {
  el.removeEventListener('touchstart', longPressTouchStart)
  el.addEventListener('touchmove', longPressTouchEnd)
  el.removeEventListener('touchend', longPressTouchEnd)
  el.removeEventListener('touchcancel', longPressTouchEnd)
}

// 指令封装
let mouseDownEvent: any;
let longPressEvent: any;
const mounted = (el: HTMLElement, binding: any) => {
  const { value } = binding;
  const options = {
    width: 160,
    menuList: [],
    hasIcon: true,
    iconType: 'font-icon',
    ...value
  };
  const menuWrapperCss = {
    background: '#ffffff',
    borderRadius: '6px',
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
        if (typeof options.disabled === 'function' && options.disabled()) {
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
      longPressEvent = (e: TouchEvent) => {
        e.preventDefault()
        if (typeof options.disabled === 'function' && options.disabled()) {
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
        const { touches } = e;
        const { clientX, clientY } = touches[0]
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
      removeLongPressListener(el)
      addLongPressListener(el, longPressEvent)
    }
  } else {
    throw new Error('At least set one menu list!');
  }
};

const unmounted = (el: HTMLElement) => {
  el.removeEventListener('mousedown', mouseDownEvent);
  // longpress
  if ('touchstart' in window) {
    removeLongPressListener(el)
  }
};

export default {
  mounted,
  unmounted
};
