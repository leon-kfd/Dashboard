import { apiURL } from "@/global"

export default async (options: {
  url: string,
  method?: 'get' | 'post' | 'head',
  params?: Record<string, any>,
  data?: Record<string, any> | FormData,
  headers?: Record<string, string>,
  timeout?: number,
  return?: 'response' | 'json' | 'text'
}) => {
  const method = options.method || 'get'

  const requestInit: RequestInit = { method }
  let target = options.url.indexOf('http') === 0 ? options.url : `${apiURL}${options.url}`
  if (method === 'get' && options.params) {
    const params = new URLSearchParams(options.params)
    target += `?${params}`
  } 
  if (method === 'post' && options.data) {
    if (options.data instanceof FormData) {
      requestInit.body = options.data
    } else {
      requestInit.body = JSON.stringify(options.data)
      options.headers = {
        'Content-Type': 'application/json',
        ...options.headers
      }
    }
  }
  requestInit.headers = options.headers

  const controller = new AbortController()
  requestInit.signal = controller.signal
  setTimeout(() => {
    controller.abort()
  }, options.timeout || 10000)

  try {
    const result = await fetch(target, requestInit)
    if (options.return === 'response') {
      return Promise.resolve(result)
    } else if (options.return === 'text'){
      const resultText = await result.text()
      return Promise.resolve(resultText)
    } else {
      const resultJSON = await result.json()
      return Promise.resolve(resultJSON)
    }
  } catch (e) {
    return Promise.reject(e)
  }
}
