<template>
  <div
    class="wrapper"
    :style="{
      fontSize: componentSetting.baseFontSize + 'px',
      color: componentSetting.textColor,
      textShadow: componentSetting.textShadow,
      padding: componentSetting.padding + 'px',
      fontFamily: componentSetting.fontFamily,
      ...positionCSS
    }">
    <div class="weather-box">
      <div class="weather-icon-wrapper">
        <img
          :src="weatherIcon"
          :style="{
            filter: `drop-shadow(${componentSetting.iconShadow})`
          }"
          alt="weather icon">
      </div>
      <div class="weather-text-wrapper">
        <div class="temperature">{{temperature}}°</div>
        <div class="city">{{cityName}} | {{weatherText}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue'
import { mapPosition } from '@/plugins/position-selector'
import { apiURL } from '@/global'
import { getWeatherIconURL, weatherFormatter } from './icon-map'
import defaultIcon from '@/assets/imgs/weather-static-icon/not-available.svg'
import { ElNotification } from 'element-plus';
import { useI18n } from 'vue-i18n'
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
    const cityName = ref('')
    const adcode = ref('')

    const { t } = useI18n()

    const weatherIcon = ref(defaultIcon)
    const temperature = ref('24')
    const weatherText = ref('未知')

    const getWeather = async () => {
      const res = await fetch(`${apiURL}/tapi/amap/v3/weather/weatherInfo?extensions=base&city=${adcode.value}`)
      const { status, lives } = await res.json()
      if (status === '1') {
        const { weather, temperature: _temperature } = lives[0]
        weatherIcon.value = getWeatherIconURL(weather, props.componentSetting.animationIcon)
        weatherText.value = weatherFormatter(weather)
        temperature.value = _temperature
      }
    }

    watch(() => [
      props.componentSetting.weatherMode,
      props.componentSetting.cityName,
      props.componentSetting.animationIcon
    ], async () => {
      try {
        if (props.componentSetting.weatherMode === 1) {
          const res = await fetch(`${apiURL}/tapi/amap/v3/ip`)
          const { status, adcode: _adcode, city } = await res.json()
          if (status === '1') {
            cityName.value = city.replace(/[市城区]/g, '')
            adcode.value = _adcode
          }
        } else {
          if (!props.componentSetting.cityName) return
          const res = await fetch(`${apiURL}/tapi/amap/v3/config/district?keywords=${props.componentSetting.cityName}&subdistrict=0`)
          const { status, districts } = await res.json()
          if (status === '1' && districts.length > 0) {
            const cityInfo = districts.find((item:any) => item.level === 'city')
            const { adcode: _adcode, name } = cityInfo
            cityName.value = name.replace(/[市城区]/g, '')
            adcode.value = _adcode
          }
        }
      } catch {
        ElNotification({
          title: t('提示'),
          type: 'error',
          message: t('无法识别出城市，请重新配置')
        })
      }
      getWeather()
    }, {
      immediate: true
    })

    return {
      positionCSS,
      cityName,
      adcode,
      weatherIcon,
      weatherText,
      temperature
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
    display: flex;
    align-items: center;
    img {
      width: 4.4em;
      height: 4.4em;
    }
  }
  .weather-text-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.4em;
    justify-content: space-around;
    .temperature {
      font-size: 2.8em;
    }
    .city {
      font-size: 0.8em;
      padding-right: 0.8em;
    }
  }
}
</style>
