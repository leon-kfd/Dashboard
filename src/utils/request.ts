import { apiURL } from "@/global"

export default async (options: {
  url: string,
  method?: 'get' | 'post' | 'head',
  params?: Record<string, any>,
  data?: Record<string, any> | FormData,
  headers?: Record<string, string>,
  timeout?: number,
  returnJSON?: boolean
}) => {
  let target = options.url.includes('http') ? options.url : `${apiURL}${options.url}`
  const method = options.method || 'get'
  const requestInit: RequestInit = { method }
  
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

  const timeoutPromise: Promise<Response> = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('Request timeout!'))
    }, options.timeout || 10000)
  })

  try {
    const result = await Promise.race([fetch(target, requestInit), timeoutPromise])
    if (options.returnJSON === false) {
      return Promise.resolve(result)
    } else {
      const resultJSON = await result.json()
      return Promise.resolve(resultJSON)
    }
  } catch (e) {
    return Promise.reject(e)
  }
}
