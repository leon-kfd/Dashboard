import { apiURL } from '@/global'
export function getBase64ByAjax(url: string, formatter = 'image/png', processFn?: any, timeout?: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'arraybuffer'
    if (timeout) {
      xhr.timeout = timeout
    }
    xhr.onload = () => {
      if (xhr.status === 200) {
        const uInt8Array = new Uint8Array(xhr.response)
        let i = uInt8Array.length
        const binaryString = Array.from({ length: i })
        while (i--) {
          binaryString[i] = String.fromCharCode(uInt8Array[i])
        }
        const data = binaryString.join('')
        const base64 = window.btoa(data)
        const dataURL = 'data:' + (formatter || 'image/png') + ';base64,' + base64
        resolve(dataURL)
      }
    }
    xhr.onerror = (e) => {
      reject(e)
    }
    xhr.onprogress = (e) => {
      processFn && processFn(e)
    }
    if (timeout) {
      xhr.ontimeout = (e) => {
        xhr.abort()
        reject(e)
      }
    }
    xhr.send()
  })
}

export function getTransparentIcon(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    // 目标第三方服务不需要接收协议前缀
    // const target = `https://favicon.cccyun.cc/${url.replace(/http(s)?:\/\//, '')}`
    const target = getTargetIconV2(url)
    getBase64ByAjax(target, 'image/x-icon', null, 5000).then((base64: any) => {
      const img = new Image() as HTMLImageElement
      img.src = base64
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d') as CanvasRenderingContext2D
        const w = img.width > 32 ? 32 : img.width
        const h = img.height > 32 ? 32 : img.height
        canvas.width = w;
        canvas.height = h;
        context.drawImage(img, 0, 0, w, h)
        const imgData = context.getImageData(0, 0, w, h)
        const [r0, g0, b0, a0] = [255, 255, 255, 255]
        const tolerance = 0;
        for (let i = 0; i < imgData.data.length; i += 4) {
          const r = imgData.data[i];
          const g = imgData.data[i + 1];
          const b = imgData.data[i + 2];
          const a = imgData.data[i + 3];
          const t = Math.sqrt((r - r0) ** 2 + (g - g0) ** 2 + (b - b0) ** 2 + (a - a0) ** 2);
          if (t <= tolerance) {
            imgData.data[i] = 0;
            imgData.data[i + 1] = 0;
            imgData.data[i + 2] = 0;
            imgData.data[i + 3] = 0;
          }
        }
        context.putImageData(imgData, 0, 0);
        const newBase64: string = canvas.toDataURL('image/png');
        resolve(newBase64)
      }
      img.onerror = (e) => {
        reject(e)
      }
    }, (e) => {
      reject(e)
    })
  })
}

export function getTargetIcon(target: string, type: 'redirect' | 'source' = 'redirect', disabledCache = false) {
  let result = `${apiURL}/api/icon?url=${encodeURIComponent(target.replace(/http(s)?:\/\//, ''))}`
  if (type === 'source') {
    result += '&type=source'
  }
  if (disabledCache) {
    result += '&disabledCache=1'
  }
  return result
}

export async function getTargetIconLink(target: string, disabledCache = false) {
  let result = `${apiURL}/api/icon?url=${encodeURIComponent(target.replace(/http(s)?:\/\//, ''))}`
  if (disabledCache) {
    result += '&disabledCache=1'
  }
  result += '&type=link'
  const res = await fetch(result)
  const link = await res.text()
  return link
}

export function getTargetIconV2(target: string) {
  return `${apiURL}/api/icon/v2?url=${encodeURIComponent(target.replace(/http(s)?:\/\//, ''))}`
}

export function cutImageBase64(file: File, wid: number, quality = 1) {
  return new Promise((resolve, reject) => {
    const blob = URL.createObjectURL(file);
    const img = new Image();
    img.src = blob;
    img.onload = () => {
      let w = img.width
      let h = img.height
      const scale = w / h
      w = wid || w;
      h = w / scale;
      // 生成canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
      canvas.setAttribute('width', w + 'px');
      canvas.setAttribute('height', h + 'px');
      ctx.drawImage(img, 0, 0, w, h);
      const base64 = canvas.toDataURL('image/png', quality);
      resolve(base64)
    }
    img.onerror = (e) => {
      reject(e)
    }
  })
}
