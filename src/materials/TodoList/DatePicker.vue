<template>
  <div
    class="date-picker"
    :style="{
      '--themeTextColor1': isDark ? '#fff' : '#464646',
      '--themeTextColor2': isDark ? '#464646' : '#fff'
    }"
  >
    <div class="calendar__date">
      <div class="calendar__head prev" @click="handlePrevClick">
        <svg viewBox="0 0 1024 1024" width="20" height="20">
          <path d="M754.739998 129.124869 677.034219 62.024635 266.002818 515.097548 672.169421 958.024379 749.894643 890.904703 408.017252 515.097548Z" />
        </svg>
      </div>
      <div class="calendar__head content">
        {{ labelMonth }}
      </div>
      <div class="calendar__head next" @click="handleNextClick">
        <svg viewBox="0 0 1024 1024" width="20" height="20">
          <path d="M754.739998 129.124869 677.034219 62.024635 266.002818 515.097548 672.169421 958.024379 749.894643 890.904703 408.017252 515.097548Z" />
        </svg>
      </div>
      <div v-for="(item,index) in weekStrArr" :key="item + index" class="calendar__day">
        {{ item }}
      </div>
      <div
        v-for="item in dayList"
        :key="item.value"
        class="calendar__number"
        :class="{
          'not-this-month': item.month!==selectedMonth,
          'active': item.value === date,
          'tips': hasTodoListDates.includes(item.value)
        }"
        @click="handleClickDay(item)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, watch, defineComponent } from 'vue'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)
export default defineComponent({
  name: 'DatePicker',
  props: {
    date: String,
    todo: {
      type: Object,
      required: true
    },
    isDark: {
      type: Boolean,
      default: false
    }
  },
  emits: ['selectDate'],
  setup(props, { emit }) {
    const yearAndMonth = ref('')
    watch(() => props.date, val => {
      yearAndMonth.value = dayjs(val).format('YYYY-MM')
    },
    {
      immediate: true
    })

    const weekStrArr = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    const dayList = computed(() => {
      const monthFirstDay = dayjs().month(dayjs(yearAndMonth.value).month()).startOf('month')
      let startIndexDay = dayjs().week(dayjs(monthFirstDay).week()).startOf('week')
      const list: any[] = []
      for (let i = 0; i < 35; i++) {
        const label = ~~startIndexDay.format('DD')
        const value = startIndexDay.format('YYYY-MM-DD')
        const month = ~~startIndexDay.format('MM')
        list.push({ label, value, month })
        startIndexDay = startIndexDay.add(1, 'd')
      }
      return list
    })
    const selectedMonth = computed(() => ~~dayjs(yearAndMonth.value).format('MM'))
    const labelMonth = computed(() => dayjs(yearAndMonth.value).format('MMM, YYYY'))
    const hasTodoListDates = computed(() => Object.keys(props.todo).filter(key => props.todo[key].some((t:any) => !t.isChecked)))

    const handleClickDay = (date: any) => emit('selectDate', date)
    const handlePrevClick = () => {
      yearAndMonth.value = dayjs(yearAndMonth.value).subtract(1, 'month').format('YYYY-MM')
    }
    const handleNextClick = () => {
      yearAndMonth.value = dayjs(yearAndMonth.value).add(1, 'month').format('YYYY-MM')
    }
    return {
      weekStrArr,
      dayList,
      selectedMonth,
      labelMonth,
      hasTodoListDates,
      handleClickDay,
      handlePrevClick,
      handleNextClick
    }
  }
})
</script>
<style scoped lang="scss">
.calendar__date {
  display: grid;
  // grid-template-columns: repeat(auto-fit, minmax(1.6em, 1fr));
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 10px;
  box-sizing: border-box;
  font-family: 'zilla slab', serif;
  .calendar__head {
    &.prev,
    &.next,
    &.content {
      cursor: pointer;
      height: 1.6em;
      display: flex;
      align-items: center;
      justify-content: space-around;
      user-select: none;
      color: #999;
      path {
        fill: #999;
      }
    }
    &.content {
      grid-column: 2 / 7;
      cursor: default;
    }
    &.next {
      svg {
        transform: rotate(180deg);
      }
    }
  }
  .calendar__day {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.6em;
    font-weight: 600;
    color: var(--themeTextColor2);
  }
  .calendar__number {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.6em;
    color: var(--themeTextColor2);
    cursor: pointer;
    position: relative;
    &:not(.not-this-month):hover,
    &.active {
      background-color: var(--themeColor);
      color: var(--themeTextColor1) !important;
      font-weight: 700;
    }
    &.not-this-month {
      color: #999;
      cursor: pointer;
    }
    &.tips:after {
      content: '';
      position: absolute;
      top: 1px;
      right: 1px;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--themeColor);
      box-shadow: 0 0 1px var(--themeColor);
    }
  }
}
</style>
