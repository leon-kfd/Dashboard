<template>
  <animation-dialog
    ref="dialog"
    animationMode
    title="主题预设"
    width="min(900px, 98vw)"
    height="min(512px, 90vh)"
    customClass="theme-preset-dialog"
    :closeOnClickOutside="false"
    :listenWindowSizeChange="true"
    appendToBody
  >
    <div class="welcome">
      Howdy!
      <p class="tips-text">请选择一个预设主题.</p>
    </div>
    <div class="theme-seletor-wrapper">
      <div class="theme-item" v-for="item in themeList" :key="item.label">
        <div
          class="item-wrapper"
          :class="{ active: activeTheme === item.label }"
          @click="activeTheme = item.label"
        >
          <svg viewBox="0 0 98.5 98.5" width="24" height="24" class="check-icon">
            <path
              class="check-mark"
              fill="none"
              stroke-width="8"
              stroke-miterlimit="10"
              d="M81.7,17.8C73.5,9.3,62,4,49.2,4C24.3,4,4,24.3,4,49.2s20.3,45.2,45.2,45.2s45.2-20.3,45.2-45.2c0-8.6-2.4-16.6-6.5-23.4l0,0L45.6,68.2L24.7,47.3"
            />
          </svg>
          <div class="img-wrapper">
            <img
              :src="item.img"
              :alt="item.label"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </div>
          <div class="content">
            <div class="title">{{ item.label }}</div>
            <div class="desc">{{ item.desc }}</div>
          </div>
        </div>
      </div>
      <div class="theme-fake-item" v-for="item in 3" :key="item"></div>
    </div>
    <el-alert
      description="若对选择后的预设主题不满意可在辅助功能中清除数据后即可重新选择。另若在使用中遇到问题现在辅助功能的常见问题尝试寻找解决方案或在Github Issue中留言。"
      type="info"
      show-icon
      :closable="false"
    />
    <template #footer>
      <div class="footer" style="text-align: right; padding: 12px">
        <button type="button" class="btn btn-text" @click="close">不用了</button>
        <button type="button" class="btn btn-primary" @click="submit">确认</button>
      </div>
    </template>
  </animation-dialog>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue'
import { useStore } from '@/store'
import { ElNotification } from 'element-plus'
import Base from '@/components/Global/DefaultThemeData/Base.json'
import Simple from '@/components/Global/DefaultThemeData/Simple.json'
import Multiple from '@/components/Global/DefaultThemeData/Multiple.json'
import Module from '@/components/Global/DefaultThemeData/Module.json'
import Mobile from '@/components/Global/DefaultThemeData/Mobile.json'
import MobilePro from '@/components/Global/DefaultThemeData/MobilePro.json'
import MovieLines from '@/components/Global/DefaultThemeData/MovieLines.json'
import Tabs from '@/components/Global/DefaultThemeData/Tabs.json'
import BaseImg from '@/assets/imgs/theme/base.png'
import SimpleImg from '@/assets/imgs/theme/simple.png'
import MultipleImg from '@/assets/imgs/theme/multi.png'
import ModuleImg from '@/assets/imgs/theme/module.png'
import MovieLinesImg from '@/assets/imgs/theme/movie-lines.png'
import MobileImg from '@/assets/imgs/theme/mobile.png'
import MobileProImg from '@/assets/imgs/theme/mobile-pro.png'
import TabsImg from '@/assets/imgs/theme/tabs.gif'
export default defineComponent({
  name: 'DefaultTheme',
  setup() {
    const store = useStore()
    const dialog = ref()

    const close = () => dialog.value.close()

    // PC端预设
    const themeList1 = [
      {
        label: 'Simple',
        json: Simple,
        img: SimpleImg,
        desc: '简约'
      },
      {
        label: 'Basic',
        json: Base,
        img: BaseImg,
        desc: '基础 x 动态壁纸'
      },
      {
        label: 'Multiple',
        json: Multiple,
        img: MultipleImg,
        desc: '多组件预设'
      },
      {
        label: 'TabPages',
        json: Tabs,
        img: TabsImg,
        desc: '标签页预设'
      },
      {
        label: 'MovieLine',
        json: MovieLines,
        img: MovieLinesImg,
        desc: '电影壁纸预设'
      },
      {
        label: 'Module',
        json: Module,
        img: ModuleImg,
        desc: '模块组件预设'
      }
    ]

    // 手机端预设
    const themeList2 = [
      {
        label: 'Mobile',
        json: Mobile,
        img: MobileImg,
        desc: '手机端预设#1'
      },
      {
        label: 'Mobile MovieLine',
        json: MobilePro,
        img: MobileProImg,
        desc: '手机端预设#2'
      }
    ]

    const themeList: any =
      window.innerWidth < 500 ? [...themeList2, ...themeList1] : [...themeList1, ...themeList2]

    const activeTheme = ref()
    const submit = () => {
      const theme = themeList.find((item: any) => item.label === activeTheme.value)
      if (theme && theme.json) {
        const {
          list,
          affix,
          global,
          showBackgroundEffect,
          showRefreshBtn,
          tabList,
          showTabSwitchBtn,
          enableKeydownSwitchTab
        } = theme.json
        store.updateStates([
          { key: 'tabList', value: tabList },
          { key: 'list', value: list },
          { key: 'affix', value: affix },
          { key: 'showBackgroundEffect', value: showBackgroundEffect },
          { key: 'showRefreshBtn', value: showRefreshBtn },
          { key: 'showTabSwitchBtn', value: showTabSwitchBtn },
          { key: 'enableKeydownSwitchTab', value: enableKeydownSwitchTab }
        ])
        store.updateGlobal(global)
        ElNotification({
          title: '提示',
          type: 'success',
          message: '选择预设主题成功'
        })
        dialog.value.close()
      }
    }

    onMounted(() => {
      dialog.value.open()
    })

    return {
      dialog,
      close,
      themeList,
      activeTheme,
      submit
    }
  }
})
</script>
<style lang="scss" scoped>
.theme-seletor-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  margin-bottom: 20px;
  .theme-item {
    width: 280px;
    padding: 5px;
    .item-wrapper {
      border: 2px solid #ccc;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      cursor: pointer;
      position: relative;
      box-sizing: border-box;
      &:hover {
        box-shadow: 0 0 15px lighten($color-primary, 30%);
      }
      &.active {
        border: 2px solid $color-primary;
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
        z-index: 88;
        .check-mark {
          stroke: #f5f5f9;
          fill: none;
          stroke-dashoffset: 340;
          stroke-dasharray: 360;
          display: block;
          stroke-width: 10;
          opacity: 0;
          transition: stroke-dashoffset 0.4s ease-in-out;
        }
      }
      .img-wrapper {
        width: 100%;
        height: 178px;
        background: #e0e0e0;
      }
      .content {
        padding: 8px;
        .title {
          font-weight: bold;
          color: #262626;
          font-size: 18px;
        }
        .desc {
          color: #889;
          font-size: 14px;
          margin-top: 4px;
        }
      }
    }
  }
  .theme-fake-item {
    width: 280px;
    padding: 0 10px;
  }
}
.welcome {
  display: flex;
  align-items: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
  .tips-text {
    color: #898989;
    font-size: 14px;
    font-weight: normal;
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
.theme-preset-dialog {
  .el-alert .el-alert__description {
    margin: 0;
    font-size: 14px;
  }
}
</style>
