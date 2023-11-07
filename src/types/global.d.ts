export { }

declare global {
  interface Window {
    iframeCache: Map<string, any>,
    queryLocalFonts?: () => Array<{
      family: string,
      fullName: string,
      postscriptName: string,
      style: string
    }>
  }
}