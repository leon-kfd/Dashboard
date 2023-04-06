<template>
  <div
    class="todo-list-card material-todolist"
    :style="{
      '--themeColor': componentSetting.themeColor,
      '--themeLightColor': themeLightColor,
      fontSize: componentSetting.baseFontSize + 'px',
      padding: componentSetting.padding + 'px'
    }"
    @contextmenu="contextmenu"
  >
    <div class="head">
      <div class="title" @click.stop="showDatePicker = !showDatePicker">{{ weekDay }}</div>
      <div class="subtitle" @click.stop="showDatePicker = !showDatePicker">{{ formatterDate }}</div>
      <div
        class="picker"
        :style="
          showDatePicker
            ? `border-bottom: 1px solid var(--themeLightColor); height: ${pickerHeight}px`
            : ''
        "
      >
        <DatePicker
          ref="dateTimePickerDom"
          :date="date"
          :todo="componentSetting.todo"
          @selectDate="updateDate"
          :isDark="isDark"
        />
      </div>
    </div>
    <ul class="list">
      <li class="list-item" v-for="(item, index) in todoList" :key="item.content + index">
        <input type="checkbox" name="todo" :checked="item.isChecked" />
        <div v-if="!item.isEditing" class="text" @click="handleChecked(index)">
          {{ item.content }}
        </div>
        <input
          type="text"
          class="edit"
          v-focus
          v-else
          :value="editingValue"
          @blur="handleEditSubmit($event, item, index)"
          @keyup.enter="handleEditSubmit($event, item, index)"
        />
        <div class="button" v-show="!item.isChecked" @click="handleChecked(index)"></div>
        <div class="wrapper" v-show="item.isChecked">
          <svg
            viewBox="0 0 98.5 98.5"
            :width="(20 * componentSetting.baseFontSize) / 16"
            :height="(20 * componentSetting.baseFontSize) / 16"
          >
            <path
              class="checkmark"
              fill="none"
              stroke-width="8"
              stroke-miterlimit="10"
              d="M81.7,17.8C73.5,9.3,62,4,49.2,4C24.3,4,4,24.3,4,49.2s20.3,45.2,45.2,45.2s45.2-20.3,45.2-45.2c0-8.6-2.4-16.6-6.5-23.4l0,0L45.6,68.2L24.7,47.3"
            />
          </svg>
        </div>
        <div class="close" @click.stop="handleRemove(index)">
          <svg
            viewBox="0 0 1024 1024"
            :width="(20 * componentSetting.baseFontSize) / 16"
            :height="(20 * componentSetting.baseFontSize) / 16"
          >
            <path
              d="M510.8096 420.3008l335.296-335.296 90.5088 90.5088-335.296 335.296 335.296 335.296-90.5088 90.5088-335.296-335.296-335.296 335.296-90.5088-90.5088 335.296-335.296-335.296-335.296 90.5088-90.5088z"
            ></path>
          </svg>
        </div>
      </li>
    </ul>
    <div class="add" @click="handleAdd">
      <svg viewBox="0 0 1024 1024" width="20" height="20">
        <path
          :fill="isDark ? '#fff' : '#464646'"
          d="M510.8096 420.3008l335.296-335.296 90.5088 90.5088-335.296 335.296 335.296 335.296-90.5088 90.5088-335.296-335.296-335.296 335.296-90.5088-90.5088 335.296-335.296-335.296-335.296 90.5088-90.5088z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, computed, onMounted, defineComponent, ComputedRef } from 'vue'
import { useStore } from '@/store'
import DatePicker from './DatePicker.vue'
import dayjs from 'dayjs'
import { lightenDarkenColor, getColorBrightness } from '@/utils/color'
const weekArr: string[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]
export default defineComponent({
  name: 'TodoList',
  components: {
    DatePicker
  },
  directives: {
    focus(el) {
      if (document.activeElement !== el) el.focus()
    }
  },
  props: {
    componentSetting: {
      type: Object,
      required: true
    },
    element: {
      type: Object,
      required: true
    },
    isAction: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    const store = useStore()
    const isDark = computed(
      () => getColorBrightness(props.componentSetting.themeColor || '#643a7a') < 150
    )
    const themeLightColor = computed(() =>
      lightenDarkenColor(props.componentSetting.themeColor || '#643a7a', isDark.value ? 50 : -50)
    )

    const date = ref()
    const dateTimePickerDom = ref()
    const pickerHeight = ref(270)
    onMounted(() => {
      date.value = dayjs().format('YYYY-MM-DD')
      if (dateTimePickerDom.value?.$el?.offsetHeight) {
        pickerHeight.value = dateTimePickerDom.value.$el.offsetHeight + 30
      }
    })
    const editingValue = ref('')
    const showDatePicker = ref(false)
    const todoList: ComputedRef<any[]> = computed(
      () => props.componentSetting.todo[date.value] || []
    )
    const weekDay = computed(() => weekArr[new Date(date.value).getDay()])
    const formatterDate = computed(() => {
      const arr = new Date(date.value).toDateString().split(' ')
      return `${arr[1]} ${arr[2]}, ${arr[3]}`
    })
    const handleChecked = (index: number) => {
      const isChecked = !todoList.value[index].isChecked
      const element = JSON.parse(JSON.stringify(props.element))
      if (props.isAction) {
        element.actionSetting.actionClickValue.componentSetting.todo[date.value][index].isChecked =
          isChecked
        store.updateActionElement(element)
      } else {
        element.componentSetting.todo[date.value][index].isChecked = isChecked
      }
      store.editComponent(element)
    }
    const handleRemove = (index: number) => {
      const element = JSON.parse(JSON.stringify(props.element))
      if (props.isAction) {
        element.actionSetting.actionClickValue.componentSetting.todo[date.value].splice(index, 1)
        store.updateActionElement(element)
      } else {
        element.componentSetting.todo[date.value].splice(index, 1)
      }
      store.editComponent(element)
    }
    const handleAdd = () => {
      editingValue.value = ''
      const element = JSON.parse(JSON.stringify(props.element))
      const item = {
        content: '',
        isChecked: false,
        isEditing: true
      }
      if (props.isAction) {
        if (!element.actionSetting.actionClickValue.componentSetting.todo[date.value]) {
          element.actionSetting.actionClickValue.componentSetting.todo[date.value] = [item]
        } else {
          element.actionSetting.actionClickValue.componentSetting.todo[date.value].push(item)
        }
        store.updateActionElement(element)
      } else {
        if (!element.componentSetting.todo[date.value]) {
          element.componentSetting.todo[date.value] = [item]
        } else {
          element.componentSetting.todo[date.value].push(item)
        }
      }
      store.editComponent(element)
    }
    const handleEditSubmit = ($event: any, item: any, index: number) => {
      if (item.isEditing) {
        const element = JSON.parse(JSON.stringify(props.element))
        const _item = props.isAction
          ? element.actionSetting.actionClickValue.componentSetting.todo[date.value]
          : element.componentSetting.todo[date.value]
        if ($event.currentTarget.value) {
          _item[index].content = editingValue.value = $event.currentTarget.value
          _item[index].isEditing = false
        } else {
          _item.splice(index, 1)
        }
        if (props.isAction) store.updateActionElement(element)
        store.editComponent(element)
      }
    }

    const updateDate = (_date: any) => {
      date.value = _date.value
    }

    const contextmenu = (e: MouseEvent) => {
      if (store.isLock) {
        e.stopPropagation()
      }
    }

    return {
      weekDay,
      formatterDate,
      todoList,
      handleChecked,
      handleRemove,
      handleAdd,
      handleEditSubmit,
      editingValue,
      showDatePicker,
      date,
      updateDate,
      themeLightColor,
      isDark,
      dateTimePickerDom,
      pickerHeight,
      contextmenu
    }
  }
})
</script>
<style scoped lang="scss">
@import url('https://fonts.loli.net/css?family=Fredericka+the+Great|Zilla+Slab:300,400');
.todo-list-card {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  flex-direction: column;
  width: 100%;
  height: 100%;
  --themeColor: #643a7a;
  --themeLightColor: #966cac;
  .head {
    padding: 10px 0 0;
    margin: 0 10px;
    user-select: none;
    font-weight: bold;
    .title {
      font-family: 'fredericka the great', cursive;
      text-align: center;
      font-size: 2.5em;
      color: var(--themeLightColor);
      height: 1.3em;
      line-height: 1.3em;
      cursor: pointer;
      font-weight: 400;
    }
    .subtitle {
      font-family: 'zilla slab', serif;
      height: 1.1em;
      line-height: 1.1em;
      font-size: 0.9em;
      text-align: center;
      letter-spacing: 0.5px;
      cursor: pointer;
      color: #999;
    }
    .picker {
      margin-top: 20px;
      padding-top: 15px;
      border-top: 1px solid var(--themeLightColor);
      height: 0;
      overflow: hidden;
      transition: all 0.4s cubic-bezier(0.03, 0.43, 0.65, 1.19);
    }
  }
  .list {
    list-style: none;
    padding: 4px 0 10px;
    margin-bottom: 50px;
    overflow-y: auto;
    height: 100%;
    flex: 1;
    .list-item {
      position: relative;
      display: flex;
      flex-wrap: nowrap;
      margin: 1em 0;
      padding: 0 10px 0 20px;
      .text {
        flex: 1;
        width: 100%;
        font-size: 1em;
        color: var(--themeColor);
        cursor: pointer;
        transition: color 0.3s ease-in-out;
        user-select: none;
        padding-right: 5px;
      }
      .edit {
        flex: 1;
        width: 100%;
        margin-right: 12px;
        height: 20px;
        font-size: 1em;
        outline: none;
        border: none;
        box-shadow: 0 1px 0 var(--themeLightColor);
        color: var(--themeColor);
        background: transparent;
        border-radius: 0;
      }
      .button {
        z-index: 2;
        box-sizing: border-box;
        width: 1.25em;
        height: 1.25em;
        border: 1px solid var(--themeLightColor);
        border-radius: 50%;
        cursor: pointer;
      }
      .close {
        width: 1.25em;
        height: 1.25em;
        opacity: 0;
        visibility: hidden;
        cursor: pointer;
        margin-left: 4px;
        path {
          fill: var(--themeLightColor);
        }
        &:hover {
          path {
            fill: var(--themeColor);
          }
        }
      }
      &:hover {
        .close {
          visibility: visible;
          animation: closeFadeIn 0.4s forwards;
        }
      }
      .checkmark {
        position: absolute;
        stroke: var(--themeLightColor);
        fill: none;
        stroke-dashoffset: 340;
        stroke-dasharray: 360;
        display: block;
        stroke-width: 8;
        opacity: 0;
      }
      input[type='checkbox'] {
        display: none;
      }
      .wrapper {
        width: 1.25em;
        height: 1.25em;
      }
      input:checked ~ {
        .text {
          color: var(--themeLightColor);
          text-decoration: line-through;
        }
        .wrapper .checkmark {
          animation: dash 0.5s ease-out forwards;
          opacity: 1;
        }
      }
    }
  }
  .add {
    position: absolute;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-shadow: 0 0 10px var(--themeColor);
    left: 50%;
    bottom: 0;
    transform: translate(-50%, 50%);
    background: var(--themeColor);
    transition: box-shadow 0.4s ease-in-out;
    z-index: 88;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-around;
    transform: translate(-50%, -10px);
    svg {
      transform: rotate(45deg);
    }
    &:hover {
      box-shadow: 0 0 20px var(--themeColor);
      transition: box-shadow 0.4s ease-in-out;
    }
  }
}
@keyframes dash {
  0% {
    stroke-dashoffset: 340;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes closeFadeIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
