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
export function clone(initalObj: any) {
  let obj = {} as any;
  for (let i in initalObj) {
    let prop = initalObj[i];
    // 避免相互引用对象导致死循环，如initalObj.a = initalObj的情况
    if(prop === obj) {
      continue;
    }
    if (typeof prop === 'object') {
      obj[i] = (prop.constructor === Array) ? [] : {};
      arguments.callee(prop, obj[i]);
    } else {
      obj[i] = prop;
    }
  }
  return obj;
}