export function getScrollbarWidth () {
  const el = document.createElement('div');
  el.style.cssText = 'width:100px;height:100px;overflow-y:scroll';
  document.body.appendChild(el);
  const scrollbarWidth = el.offsetWidth - el.clientWidth;
  document.body.removeChild(el);
  return scrollbarWidth;
}

export function map2List(data: Record<string, string | number>, toNumberKey = false) {
  return Object.keys(data).map(key => {
    return {
      label: data[key],
      value: toNumberKey ? +key : key
    };
  });
}

/* ================ 深拷贝 ================ */
export function clone(obj: any) {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (obj.constructor === Date) return new Date(obj)
  if (obj.constructor === RegExp) return new RegExp(obj)
  const newObj = new obj.constructor() // 保持继承链
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key]
      newObj[key] = typeof val === 'object' ? clone(val) : val
    }
  }
  return newObj
}

export function coverAsync(_promise: Promise<unknown>) {
  return _promise.then(data => {
    return [null, data]
  }, err => {
    return [err]
  })
}

export function debounce(fn: any, wait = 200) {
  let timer:number
  return (...args: []) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn(...args)
    }, wait)
  }
}
