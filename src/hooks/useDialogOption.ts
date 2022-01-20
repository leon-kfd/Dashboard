import { computed } from 'vue'
import { useStore } from 'vuex'
export default function useDialogOption(isAllDefault = false) {
  const store = useStore()
  const dialogOption = computed(() => {
    if (store.state.global.disabledDialogAnimation) {
      return {
        animationIn: '',
        animationOut: '',
        customWrapperClass: '',
        time: 0
      }
    } else {
      return isAllDefault ? {} : {
        animationIn: 'flipInY',
        animationOut: 'bounceOut',
        customWrapperClass: 'backdrop-blur',
        time: 500
      }
    }
  })
  return dialogOption
}
