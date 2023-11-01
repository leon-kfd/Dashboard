export { }

declare global {
  interface Window {
    iframeCache: Map<string, any>   
  }
}