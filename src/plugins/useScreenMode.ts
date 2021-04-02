import { onMounted, onUnmounted, ref } from 'vue'
export default function () {
  const SAFE_WIDTH = 10
  const windowWidth = ref(window.innerWidth - SAFE_WIDTH)
  const screenMode = ref(0)
  const fr = ref(0)
  const getScreenMode = () => {
    const w = window.innerWidth
    return w <= 721 ? 0 : w <= 1921 ? 1 : 2
  }
  const setValue = () => {
    screenMode.value = getScreenMode()
    const sw = window.innerWidth - SAFE_WIDTH
    windowWidth.value = sw
    fr.value = screenMode.value === 0 ? sw / 12 : screenMode.value === 1 ? sw / 24 : sw / 36
  }
  setValue()
  let timer:number
  const onWindowSizeChange = () => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      setValue()
    }, 400)
  }
  onMounted(() => window.addEventListener('resize', onWindowSizeChange))
  onUnmounted(() => window.removeEventListener('resize', onWindowSizeChange))
  return { windowWidth, screenMode, fr }
}