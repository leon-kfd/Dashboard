<template>
  <!-- https://codepen.io/lbebber/pen/pvwZJp?editors=1100 -->
  <nav class="menu">
    <input type="checkbox" class="menu-open" name="menu-open" id="menu-open"/>
    <label class="menu-open-button" for="menu-open">
      <span class="hamburger hamburger-1"></span>
      <span class="hamburger hamburger-2"></span>
      <span class="hamburger hamburger-3"></span>
    </label>
    <el-tooltip effect="dark" :content="isLock ? '解除锁定' : '锁定'" placement="top">
      <div class="menu-item" @click="handleSetLock">
        <i :class="!isLock ? 'el-icon-unlock' : 'el-icon-lock'"></i>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="设置" placement="top">
      <div class="menu-item" @click="handleShowGlobalConfig">
        <i class="el-icon-setting"></i>
      </div>
    </el-tooltip>
    <el-tooltip effect="dark" content="添加组件" placement="top">
      <div class="menu-item" @click="handleAddComponent">
        <i class="el-icon-plus"></i>
      </div>
    </el-tooltip>
  </nav>
  <!-- filters -->
  <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
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
  emits: ['addComponent', 'showGlobalConfig'],
  setup(props, { emit }) {
    const store = useStore()
    const isLock = computed(() => store.state.isLock)
    return {
      isLock,
      handleAddComponent () {
        emit('addComponent')
      },
      handleShowGlobalConfig () {
        emit('showGlobalConfig')
      },
      handleSetLock () {
        store.commit('updateIsLock', !isLock.value)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
//vars
//config
$menu-items:3;
%goo{
  filter:url('#shadowed-goo');
}
%ball{
  background: $--color-primary;
  border-radius:100%;
  width:40px;
  height:40px;
  position:absolute;
  top:4px;
  right: 0;
  color:white;
  text-align:center;
  line-height:40px;
  transform:translate3d(0,0,0);
  transition:transform ease-out .2s, background-color ease-out .2s, color ease-out .2s;
  box-shadow: 0 0 2px #cecece;
}
.menu-open{
  display:none;
}
.menu-item{
  @extend %ball;
}
.hamburger{
  $width:16px;
  $height:2px;
  width:$width;
  height:$height;
  background:#fff;
  display:block;
  position:absolute;
  top:50%;
  left:50%;
  margin-left:-$width/2;
  margin-top:-$height/2;
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
  $width:300px;
  $height:48px;
  position: fixed;
  right: 3vw;
  bottom: 5vh;
  width:$width;
  height:$height;
  box-sizing:border-box;
  font-size: 20px;
  text-align:right;
  z-index: 99999;
}
.menu-item{
  &:hover{
    background: lighten($--color-primary, 80);
    color:$--color-primary;
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
svg {
  display: none;
}
</style>
