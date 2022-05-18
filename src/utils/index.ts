export function getScrollbarWidth() {
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

export function clone(obj: any) {
  if (obj === null) return null
  if (typeof obj !== 'object') return obj
  if (obj.constructor === Date) return new Date(obj)
  if (obj.constructor === RegExp) return new RegExp(obj)
  const newObj = new obj.constructor()
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
  let timer: number
  return (...args: []) => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn(...args)
    }, wait)
  }
}

export function ajaxPost(url: string, data: any): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    const paramsData = JSON.stringify(data)
    xhr.open('POST', url, true)
    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');
    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          resolve(JSON.parse(xhr.response))
        } catch (e) {
          reject(e)
        }
      }
    }
    xhr.onerror = (e) => {
      reject(e)
    }
    xhr.send(paramsData)
  })
}

export function execCopy(text: string) {
  const input = document.createElement('input') as HTMLInputElement
  input.style.opacity = '0'
  input.style.position = 'absolute'
  input.style.left = '-100000px'
  document.body.appendChild(input)
  input.value = text
  input.select()
  input.setSelectionRange(0, text.length)
  document.execCommand('copy')
  document.body.removeChild(input)
  return true
}

export function getFileType(path: string) {
  const index = path.lastIndexOf('.')
  if (~index) {
    return path.substr(index + 1).toLocaleLowerCase()
  }
  return null
}

export function uid() {
  return Math.random().toString(16).slice(2)
}

export function loadHarmonyOSFont() {
  function createLink(attrs: Record<string, string>) {
    const link = document.createElement('link');
    for (const key in attrs) {
      link.setAttribute(key, attrs[key]);
    }
    const head = document.querySelector('head') as HTMLElement;
    head.appendChild(link);
  }
  createLink({ rel: 'preconnect', href: 'https://s1.hdslb.com/' });
  createLink({
    rel: 'stylesheet',
    href: 'https://s1.hdslb.com/bfs/static/jinkela/long/font/regular.css',
    media: 'all',
  });
  createLink({
    rel: 'stylesheet',
    href: 'https://s1.hdslb.com/bfs/static/jinkela/long/font/medium.css',
    media: 'all',
  });
}
