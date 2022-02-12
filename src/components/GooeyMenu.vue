<template>
  <!-- https://codepen.io/lbebber/pen/pvwZJp?editors=1100 -->
  <nav class="menu">
    <input type="checkbox" class="menu-open" name="menu-open" id="menu-open"/>
    <label class="menu-open-button" for="menu-open">
      <span class="hamburger hamburger-1"></span>
      <span class="hamburger hamburger-2"></span>
      <span class="hamburger hamburger-3"></span>
    </label>
    <el-tooltip effect="dark" content="辅助功能" placement="top">
      <div class="menu-item" @click="handleShowAuxiliaryConfig">
        <Icon name="tools" />
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" :content="isLock ? '解锁' : '锁定'" placement="top">
      <div class="menu-item" @click="handleSetLock" title="编辑状态会出现提示边框，同时可以进行组件拖拽、右键菜单配置等">
        <Icon :name="!isLock ? 'unlock' : 'lock'" />
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="全局设置" placement="top">
      <div class="menu-item" @click="handleShowGlobalConfig">
        <Icon name="setting-4" />
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="添加组件" placement="top">
      <div class="menu-item" @click="handleAddComponent">
        <Icon name="add" />
      </div>
    </el-tooltip>
  </nav>
  <!-- filters -->
  <!-- ios safari 无法使用此滤镜 -->
  <svg v-if="!isSafari" id="filterSvg" xmlns="http://www.w3.org/2000/svg" version="1.1">
    <defs>
      <filter id="shadowed-goo">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
        <feGaussianBlur in="goo" stdDeviation="3" result="shadow" />
        <feColorMatrix in="shadow" mode="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 -0.2" result="shadow" />
        <feOffset in="shadow" dx="1" dy="1" result="shadow" />
        <feComposite in2="shadow" in="goo" result="goo" />
        <feComposite in2="goo" in="SourceGraphic" result="mix" />
      </filter>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="goo" />
        <feComposite in2="goo" in="SourceGraphic" result="mix" />
      </filter>
    </defs>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'GooetMenu',
  emits: ['addComponent', 'showGlobalConfig', 'showAuxiliaryConfig'],
  setup(props, { emit }) {
    const store = useStore()
    const isLock = computed(() => store.state.isLock)
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    return {
      isLock,
      isSafari,
      handleAddComponent () {
        emit('addComponent')
      },
      handleShowGlobalConfig () {
        emit('showGlobalConfig')
      },
      handleSetLock () {
        store.dispatch('updateIsLock', !isLock.value)
      },
      handleShowAuxiliaryConfig() {
        emit('showAuxiliaryConfig')
      }
    }
  }
})
</script>
<style lang="scss" scoped>
$menu-items:4;
%goo{
  filter:url('#shadowed-goo');
}
%ball{
  background: $color-primary;
  border-radius:100%;
  width:40px;
  height:40px;
  position:absolute;
  top:4px;
  right: 0;
  color:white;
  transform:translate3d(0,0,0);
  transition:transform ease-out .2s, background-color ease-out .2s, color ease-out .2s;
  box-shadow: 0 0 2px $color-primary;
  display: flex;
  align-items: center;
  justify-content: center;
}
.menu-open{
  display:none;
}
.menu-item{
  @extend %ball;
  &:focus{
    outline: none;
  }
}
.hamburger{
  width: 16px;
  height: 2px;
  background:#fff;
  display:block;
  position:absolute;
  top:50%;
  left:50%;
  margin-left:-8px;
  margin-top:-1px;
  transition:transform 200ms;
}
$hamburger-spacing:6px;
.hamburger-1{
  transform:translate3d(0,-$hamburger-spacing,0);
}
.hamburger-2{
  transform:translate3d(0,0,0);
}
.hamburger-3{
  transform:translate3d(0,$hamburger-spacing,0);
}
.menu-open:checked+.menu-open-button{
  .hamburger-1{
    transform:translate3d(0,0,0) rotate(45deg);
  }
  .hamburger-2{
    transform:translate3d(0,0,0) scale(0.1,1);
  }
  .hamburger-3{
    transform:translate3d(0,0,0) rotate(-45deg);
  }
}
.menu{
  @extend %goo;
  // $width:300px;
  $height:48px;
  position: fixed;
  right: 3vw;
  bottom: 5vh;
  // width:$width;
  height: $height;
  box-sizing:border-box;
  font-size: 20px;
  text-align:right;
  z-index: 999;
}
.menu-item{
  &:hover{
    background: lighten($color-primary, 80);
    color:$color-primary;
    cursor: pointer;
  }
  @for $i from 1 through $menu-items{
    &:nth-child(#{$i+2}){
      transition-duration:180ms;
    }
  }
}
.menu-open-button{
  @extend %ball;
  z-index:2;
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.320, 1.275);
  transition-duration:400ms;
  transform:scale(1.1,1.1) translate3d(0,0,0);
  cursor:pointer;
}
.menu-open-button:hover{
  transform:scale(1.2,1.2) translate3d(0,0,0);
}
.menu-open:checked+.menu-open-button{
  transition-timing-function:linear;
  transition-duration:200ms;
  transform:scale(0.8,0.8) translate3d(0,0,0);
}
.menu-open:checked~.menu-item{
  transition-timing-function:cubic-bezier(0.165, 0.840, 0.440, 1.000);
  @for $i from 1 through $menu-items{
    &:nth-child(#{$i+2}){
      transition-duration:90ms+(100ms*$i);
      transform:translate3d(-60px*$i,0,0);
    }
  }
}
#filterSvg {
  display: none;
}
</style>
