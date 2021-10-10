<template>
  <div class="wrapper">
    <div class="item">
      <p class="title">项目说明</p>
      <ul class="list">
        <li>项目基于<code>MIT</code>协议开源，源码地址访问此处<a href="https://github.com/leon-kfd/Dashboard" target="_blank">Github</a></li>
        <li>项目基于<code>Vite</code>、<code>Vue3</code>、<code>Typescript</code>，欢迎各种PR贡献你的想法</li>
        <li>若对此项目有想法或建议可在<a href="https://github.com/leon-kfd/Dashboard" target="_blank">Github</a>上提<code>issue</code>或者留言于<a href="mailto:kfd_personal@163.com">kfd_personal@163.com</a></li>
      </ul>
    </div>
    <div class="item">
      <p class="title">项目演示视频</p>
      <a class="video-wrapper" href="https://www.bilibili.com/video/BV1Vu411Z7i1?share_source=copy_web" target="_blank">
        <img src="@/assets/imgs/video-thumb.png" alt="">
        <div class="mask">
          <i class="el-icon-video-play"></i>
        </div>
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'About'
})
</script>
<style lang="scss" scoped>
.wrapper {
  padding: 10px;
  .item {
    margin-bottom: 20px;
  }
  .title {
    color: $--color-grey1;
    margin-bottom: 10px;
    font-weight: bold;
  }
  .list {
    padding-left: 25px;
    li {
      line-height: 1.4;
      color: $--color-grey2;
      position: relative;
      margin-bottom: 6px;
      &::before {
        position: absolute;
        left: -26px;
      }
      $emojis: '🌈', '🎉', '📧';
      @each $e in $emojis {
        $i: index($emojis, $e);
        &:nth-child(#{$i}) {
          &::before {
            content: $e;
          }
        }
      }
      code {
        display: inline-block;
        padding: 0 2px;
        background: rgba(243,235,230, .8);
        border-radius: 2px;
      }
      a {
        color: $--color-primary;
        text-decoration: none;
        &:hover {
          color: $--color-warning;
          text-decoration: underline;
        }
      }
    }
  }
  .video-wrapper {
    display: block;
    width: 100%;
    position: relative;
    img {
      width: 100%;
      height: auto;
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 48px;
      color: #fff;
      cursor: pointer;
      background: rgba(0,0,0,.4);
      backdrop-filter: blur(3px);
    }
  }
}
</style>
