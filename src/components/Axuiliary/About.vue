<template>
  <div class="wrapper">
    <p class="title">项目说明</p>
    <ul class="list">
      <li>项目基于<code>MIT</code>协议开源，源码地址访问此处<a href="https://github.com/leon-kfd/Dashboard" target="_blank">Github</a></li>
      <li>项目基于<code>Vite</code>、<code>Vue3</code>、<code>Typescript</code>，欢迎各种PR贡献你的想法</li>
      <li>若对此项目有想法或建议可在<a href="https://github.com/leon-kfd/Dashboard" target="_blank">Github</a>上提<code>issue</code>或者留言于<a href="mailto:kfd_personal@163.com">kfd_personal@163.com</a></li>
    </ul>
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
  .title {
    color: #43434b;
    margin-bottom: 10px;
  }
  .list {
    padding-left: 25px;
    li {
      line-height: 1.4;
      color: #56565c;
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
}
</style>
