import { onMounted, onUnmounted, ref } from 'vue'
export default function () {
  const windowWidth = ref(0)
  const windowHeight = ref(0)
  const screenMode = ref(0)
  const fr = ref(0)
  const getScreenMode = () => {
    const w = window.innerWidth
    return w <= 721 ? 0 : w <= 1981 ? 1 : 2
  }
  const setValue = () => {
    screenMode.value = getScreenMode()
    const sw = ~~document.body.offsetWidth - 5
    windowWidth.value = sw
    windowHeight.value = window.innerHeight
    fr.value = screenMode.value === 0 ? sw / 12 : screenMode.value === 1 ? sw / 24 : sw / 36
  }
  let timer: number
  const onWindowSizeChange = () => {
    if (timer) window.clearTimeout(timer)
    timer = window.setTimeout(() => {
      setValue()
    }, 200)
  }
  // setValue()
  onMounted(() => window.addEventListener('resize', onWindowSizeChange))
  onUnmounted(() => window.removeEventListener('resize', onWindowSizeChange))
  onWindowSizeChange()
  return { windowWidth, windowHeight, screenMode, fr }
}
