<template>
  <div
    class="wrapper material-countdown"
    :style="{
      fontSize: componentSetting.textFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS
    }">
    <div class="box" v-if="componentSetting.eventTime">
      <div class="event-name" v-if="componentSetting.eventName">{{componentSetting.eventName}}</div>
      <div class="event-content">
        <div class="num">{{num}}</div>
        <div class="unit">{{$t(componentSetting.unit)}}</div>
      </div>
    </div>
    <Unset v-else :tips="`💫${$t('未配置目标时间，请进行配置')}`" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import Unset from '@/components/Tools/Unset.vue'
import { mapPosition } from '@/plugins/position-selector'
import dayjs from 'dayjs'
export default defineComponent({
  name: 'CountDown',
  components: {
    Unset
  },
  props: {
    componentSetting: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const num = ref(0)
    const unitMap = {
      天: 'day',
      小时: 'hour',
      分钟: 'minute'
    }
    function calcRest () {
      const now = dayjs(new Date())
      const target = dayjs(props.componentSetting.eventTime)
      const diff = target.diff(now, (unitMap as any)[props.componentSetting.unit])
      return diff
    }

    const duration = computed(() => {
      if (props.componentSetting.unit === '小时') return 20 * 60 * 1000
      if (props.componentSetting.unit === '分钟') return 30 * 1000
      return 12 * 60 * 60 * 1000
    })

    let timer:number
    function init() {
      num.value = calcRest()
      if (props.componentSetting.unit !== '天') {
        if (timer) clearInterval(timer)
        timer = window.setInterval(() => {
          num.value = calcRest()
        }, duration.value)
      }
    }

    onMounted(() => init())
    onUnmounted(() => window.clearInterval(timer))
    watch(() => [props.componentSetting, props.componentSetting.eventName, props.componentSetting.unit], () => {
      init()
    })

    const positionCSS = computed(() => mapPosition(props.componentSetting.position))

    return {
      num,
      positionCSS
    }
  }
})
</script>
<style lang="scss" scoped>
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
}
.box {
  .event-name {
    font-size: 1em;
    margin-bottom: .4em;
    font-weight: 500;
  }
  .event-content {
    display: flex;
    align-items: baseline;
    .num {
      font-size: 2em;
      font-weight: bold;
    }
    .unit {
      font-size: 1.2em;
      font-weight: bold;
      margin-left: .3em;
    }
  }
}
</style>
