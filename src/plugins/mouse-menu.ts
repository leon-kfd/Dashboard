import { CustomMouseMenu } from '@howdyjs/mouse-menu'
// import store from '@/store'

// 二次封装以适应移动端长按弹出菜单
const longPressDuration = 500
let longPressTimer: number
let longPressTouchStart: any
let longPressTouchEnd: any
function addLongPressListener (el: HTMLElement, fn: any) {
  longPressTouchStart = (e: any) => {
    // e.preventDefault()
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
function removeLongPressListener (el: HTMLElement) {
  el.removeEventListener('touchstart', longPressTouchStart)
  el.addEventListener('touchmove', longPressTouchEnd)
  el.removeEventListener('touchend', longPressTouchEnd)
  el.removeEventListener('touchcancel', longPressTouchEnd)
}

// 指令封装
let mouseDownEvent: any;
let longPressEvent: any
const mounted = (el: HTMLElement, binding: any) => {
  const { value } = binding;
  const options = {
    menuWidth: 200,
    menuList: [],
    hasIcon: false,
    iconType: 'font-icon',
    ...value
  };
  const menuWrapperCss = {
    ...value.menuWrapperCss
  };
  const menuItemCss = {
    arrowSize: '10px',
    ...value.menuItemCss
  };
  if (options.menuList.length > 0) {
    mouseDownEvent = (e: MouseEvent) => {
      if (typeof options.disabled === 'function' && options.disabled()) {
        return
      }
      const MouseMenuCtx = CustomMouseMenu({
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
    // longpress
    if ('ontouchstart' in window) {
      longPressEvent = (e: TouchEvent) => {
        if (typeof options.disabled === 'function' && options.disabled()) {
          return
        }
        const MouseMenuCtx = CustomMouseMenu({
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
        document.onmousedown = () => {
          MouseMenuCtx.close();
        }
        el.ontouchstart = () => {
          MouseMenuCtx.close()
        }
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
