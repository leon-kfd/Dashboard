<template>
  <div
    class="wrapper"
    :style="{
      fontSize: componentSetting.baseFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      ...positionCSS
    }">
    <div class="weather-box">
      <div class="weather-icon-wrapper">
        <img src="https://cdn.jsdelivr.net/gh/leon-kfd/weather-icons/production/line/all/clear-day.svg" alt="weather icon">
      </div>
      <div class="weather-text-wrapper">
        <div class="temperature">27°</div>
        <div class="city">Guangzhou</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { mapPosition } from '@/plugins/position-selector'
export default defineComponent({
  name: 'Weather',
  props: {
    componentSetting: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const positionCSS = computed(() => mapPosition(props.componentSetting.position))
    return {
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
.weather-box {
  display: flex;
  .weather-icon-wrapper {
    img {
      width: 4.4em;
      height: 4.4em;
    }
  }
  .weather-text-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    .temperature {
      font-size: 2.8em;
    }
    .city {
      font-size: 0.8em;
    }
  }
}
</style>
