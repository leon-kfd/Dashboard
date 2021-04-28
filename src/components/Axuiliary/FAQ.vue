<template>
  <div class="wrapper">
    <div class="row">
      <div class="title">如何切换背景图?</div>
      <div class="answer">点击右下角菜单进入全局设置，可选择设置背景图，随机图片图片源来源于<a href="https://unsplash.com/" target="_blank">UNSPLASH</a>网站.</div>
    </div>
    <div class="row">
      <div class="title">如何更改组件大小与位置?</div>
      <div class="answer">
        点击右下角菜单锁定按钮解除锁定进入编辑模式，右键相应组件打开菜单（移动端下可使用长按操作唤起菜单）选择基础配置可更改组件大小。
        当前组件有2种定位模式，按文档流布局与Fix固定布局，2种模式都支持直接拖拽更改位置。
      </div>
    </div>
    <div class="row">
      <div class="title">如何在另一设备同步我的配置?</div>
      <div class="answer">
        当前提供2种数据同步方案，使用密钥同步（推荐）与JSON文件同步，打开辅助功能弹出，选择导入导出，在导出模块生成密钥后即可复制密钥到另一设备进行导入。
      </div>
    </div>
    <div class="row">
      <div class="title">为什么我的IFrame组件无法正常加载?</div>
      <div class="answer">
        因为当前系统部署在HTTPS站点下，新版Chrome等浏览器已不支持https与http协议混用，所以Iframe组件只支持https的外部网站。
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'FAQ'
})
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 10px;
  .row {
    margin-bottom: 20px;
    line-height: 1.5;
    .title {
      color: $--color-grey1;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 6px;
    }
    .answer {
      color: $--color-grey2;
      font-size: 14px;
    }
  }
}
</style>
