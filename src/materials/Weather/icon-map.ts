
export function weatherFormatter(name: string) {
  if (name.includes('风')) {
    if (['龙卷风', '狂爆风', '飓风', '热带风暴'].includes(name)) {
      return '龙卷风'
    } else {
      return '风'
    }
  }
  if (name.includes('霾') || name.includes('雾')) {
    if (['重', '大', '浓', '沙', '尘'].some(i => name.includes(i))) {
      return '大雾'
    } else {
      return '小雾'
    }
  }
  if (name.includes('雨')) {
    if (name.includes('雷')) {
      return '雷阵雨'
    } else if (name.includes('雪')) {
      return '雨夹雪'
    } else if (name.includes('大') || name.includes('暴')) {
      return '大雨'
    } else {
      return '小雨'
    }
  }
  if (name.includes('雪')) {
    return '雪'
  }
  return name
}

export const weatherMap: Record<string, any> = {
  晴: 'clear-day',
  少云: 'cloudy',
  晴间多云: 'overcast-day',
  多云: 'overcast',
  阴: 'overcast',
  平静: 'overcast',
  风: 'wind',
  龙卷风: 'hurricane',
  大雾: 'fog',
  小雾: 'mist',
  雷阵雨: 'thunderstorms-rain',
  大雨: 'rain',
  小雨: 'drizzle',
  雨夹雪: 'sleet',
  雪: 'snow',
  热: 'high',
  冷: 'low',
  未知: 'new-moon'
}

export function getWeatherIconURL(name: string) {
  // https://cdn.jsdelivr.net/gh/leon-kfd/weather-icons/production/line/all/clear-day.svg
  const _name = weatherFormatter(name) || '未知'
  const word = weatherMap[_name] || 'new-moon'
  return `https://cdn.jsdelivr.net/gh/leon-kfd/weather-icons/production/line/all/${word}.svg`
}
