type SwiptType = {
  el: HTMLElement, 
  threshold?: number,
  callbacks: {
    left: (e: TouchEvent) => void,
    right: (e: TouchEvent) => void,
  }
}
/**
 * 手势判断配置
 * @param {options} options - 需要绑定手势的DOM元素
 */
export const initSwipe = (options: SwiptType) => {
  let startX, startY, startTime;
  let threshold = options.threshold || 50;
  if (!options.el) {
    console.error('initSwipe: el is required')
    return
  }
  options.el.addEventListener('touchstart', (e) => {
      // 记录初始位置和时间
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
      startTime = Date.now();
  }, { passive: true });

  options.el.addEventListener('touchend', (e) => {
      // 如果没有有效的起始点，直接返回（防止在某些异常情况下触发）
      if (startX === undefined || startY === undefined) return;
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();
      // 计算移动距离
      const diffX = endX - startX;
      const diffY = endY - startY;
      const timeDiff = endTime - startTime;
      // 判断是否为滑动：距离足够，时间合理（防止长按误触，比如限制在500ms内）
      if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY) && timeDiff < 500) {
          if (diffX > 0) {
              // 向右滑动
              console.log('👉 右划');
              options.callbacks.right?.(e);
          } else {
              // 向左滑动
              console.log('👈 左划');
              options.callbacks.left?.(e);
          }
      }
      // 重置起始点
      startX = startY = undefined;
  }, { passive: true });

  // 如果滑动过程中进入系统滚动导致中断，可以重置位置
  options.el.addEventListener('touchcancel', () => {
      startX = startY = undefined;
  }, { passive: true });
}