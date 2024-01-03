import localforage from 'localforage';

export const isSupportIndexDB = localforage.supports(localforage.INDEXEDDB);

export const localImg = localforage.createInstance({ name: 'LocalImg', driver: localforage.INDEXEDDB })

export const localThumbImg = localforage.createInstance({ name: 'localThumbImg', driver: localforage.INDEXEDDB })

export const cacheBackgroundImg = localforage.createInstance({ name: 'cacheBackgroundImg', driver: localforage.INDEXEDDB })

export async function setCacheBgImg(imgDom: HTMLImageElement) {
  try {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    const { width, height, naturalWidth, naturalHeight } = imgDom
    canvas.width = width
    canvas.height = height
    const canvasRatio = width / height
    const imgRatio = naturalWidth / naturalHeight
    // img object-fit
    let sw, sh, sx, sy
    if (imgRatio <= canvasRatio) {
      sw = naturalWidth
      sh = sw / canvasRatio
      sx = 0
      sy = (naturalHeight - sh) / 2
    } else {
      sh = naturalHeight
      sw = sh * canvasRatio
      sx = (naturalWidth - sw) / 2
      sy = 0
    }
    ctx.drawImage(imgDom, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height)
    const base64 = canvas.toDataURL('image/png')
    await cacheBackgroundImg.setItem('img', base64)
  } catch (e) {
    console.warn('Set cache background error.')
    console.error(e)
  }
}

export async function removeCacheBgImg() {
  if (isSupportIndexDB) {
    await cacheBackgroundImg.removeItem('img')
  }
}
