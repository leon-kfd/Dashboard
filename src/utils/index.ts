export function getScrollbarWidth () {
  const el = document.createElement('div');
  el.style.cssText = 'width:100px;height:100px;overflow-y:scroll';
  document.body.appendChild(el);
  const scrollbarWidth = el.offsetWidth - el.clientWidth;
  document.body.removeChild(el);
  return scrollbarWidth;
}