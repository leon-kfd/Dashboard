<template>
  <animation-dialog
    ref="dialog"
    :animationMode="true"
    title="主题预设"
    width="min(880px, 98vw)"
    height="min(512px, 90vh)"
    :closeOnClickOutside="false"
    :listenWindowSizeChange="true"
    :appendToBody="true"
  >
    <h2>Welcome!</h2>
    <p class="tips-text">请选择一个预设主题.</p>
    <div class="theme-seletor-wrapper">
      <div class="theme-item" v-for="item in themeList" :key="item.label">
        <div class="item-wrapper" :class="{ active: activeTheme === item.label }" @click="activeTheme = item.label">
          <svg viewBox="0 0 98.5 98.5" width="24" height="24" class="check-icon">
            <path
              class="check-mark"
              fill="none"
              stroke-width="8"
              stroke-miterlimit="10"
              d="M81.7,17.8C73.5,9.3,62,4,49.2,4C24.3,4,4,24.3,4,49.2s20.3,45.2,45.2,45.2s45.2-20.3,45.2-45.2c0-8.6-2.4-16.6-6.5-23.4l0,0L45.6,68.2L24.7,47.3" />
          </svg>
          <div class="img-wrapper"></div>
          <div class="content">
            <div class="title">{{item.label}}</div>
          </div>
        </div>
      </div>
      <div class="theme-fake-item" v-for="item in 4" :key="item"></div>
    </div>
    <template #footer>
      <div class="footer" style="text-align: right;padding: 12px;">
        <button class="btn btn-text" @click="close">不用了</button>
        <button class="btn btn-primary" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import AnimationDialog from '@howdyjs/animation-dialog'
export default defineComponent({
  name: 'DefaultTheme',
  components: {
    AnimationDialog
  },
  setup() {
    const dialog = ref()
    onMounted(() => {
      // 判断当前有无添加组件
      try {
        const config = JSON.parse(localStorage.getItem('config') || '{}')
        if (config.list && config.list.length === 0) {
          // dialog.value.open()
        }
      } catch {
        //
      }
    })
    const close = () => dialog.value.close()

    const themeList = [
      {
        label: 'Basic',
        json: ''
      },
      {
        label: 'Simple',
        json: ''
      },
      {
        label: 'Unknown',
        json: ''
      }
    ]

    const activeTheme = ref()

    return {
      dialog,
      close,
      themeList,
      activeTheme
    }
  }
})

</script>
<style lang="scss" scoped>
.theme-seletor-wrapper {
  display: flex;
  flex-wrap: wrap;
  .theme-item {
    width: 220px;
    padding: 10px;
    .item-wrapper {
      border: 2px solid #b9b9c0;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      &:hover {
        box-shadow: 0 0 10px #ccc;
      }
      &.active {
        border: 2px solid $--color-primary;
        .check-icon {
          .check-mark {
            opacity: 1;
            stroke-dashoffset: 0;
          }
        }
      }
      .check-icon {
        position: absolute;
        top: 4px;
        right: 4px;
        .check-mark {
          stroke: $--color-primary;
          fill: none;
          stroke-dashoffset: 340;
          stroke-dasharray: 360;
          display: block;
          stroke-width: 8;
          opacity: 0;
          transition: stroke-dashoffset .4s ease-in-out;
        }
      }
      .img-wrapper {
        width: 100%;
        height: 160px;
        background: #e0e0e0;
      }
      .content {
        padding: 10px;
        .title {
          font-weight: bold;
          color: #262626;
        }
      }
    }
  }
  .them-item-fake {
    width: 220px;
    padding: 0 10px;
  }
}
.tips-text {
  margin: 10px 0;
  color: #898989;
}
</style>
