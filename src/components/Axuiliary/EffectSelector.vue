<template>
  <div class="wrapper">
    <div class="title">
      {{ $t('壁纸动画特效') }}
    </div>
    <div class="content">
      <el-alert
        :title="$t('bgEffectSelectorTips')"
        type="warning"
        :closable="false"
        style="margin-bottom: 8px"
      />
      <div class="effect-list">
        <div
          v-for="item in effectList"
          :key="item.value"
          :class="['effect-list-item', item.value === effectActive && 'active']"
          @click="onSelect(item.value)"
        >
          <div class="img-wrapper">
            <img v-if="item.img" :src="item.img" :alt="item.name" loading="lazy">
          </div>
          <div class="effect-name">
            {{ $t(item.name) }}
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <button class="btn btn-primary" @click="onSubmit">
        {{ $t('应用') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from '@/store'
const store = useStore()
const effectActive = ref(0)
onMounted(() => {
  effectActive.value = store.backgroundEffectActive
})
const effectList = ref([
  {
    img: 'https://cdn.kongfandong.cn/img/animate-effect/disabled.png',
    name: '禁用',
    value: 0
  },
  {
    img: 'https://cdn.kongfandong.cn/img/animate-effect/rain-drop.gif',
    name: '雨滴',
    value: 1
  },
  {
    img: 'https://cdn.kongfandong.cn/img/animate-effect/snow.gif',
    name: '飘雪',
    value: 2
  },
  {
    img: 'https://cdn.kongfandong.cn/img/animate-effect/Star.gif',
    name: '星空',
    value: 3
  },
  {
    img: 'https://cdn.kongfandong.cn/img/animate-effect/FireFlies.gif',
    name: '萤火虫',
    value: 4
  },
  {
    img: 'https://cdn.kongfandong.cn/img/animate-effect/Focus.gif',
    name: '聚焦',
    value: 5
  }
])

const onSelect = (value: number) => {
  effectActive.value = value
}

const onSubmit = () => {
  // Can't not find the way to destory webgl2
  // It add a button to confirm reload the page
  if (confirm('该配置需刷新页面后才起效')) {
    store.updateState({
      key: 'backgroundEffectActive',
      value: effectActive.value
    })
    window.location.reload()
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 10px;
  display: flex;
  flex-direction: column;
  height: 100%;
  .title {
    color: $color-grey1;
    margin-bottom: 8px;
    position: relative;
    font-weight: bold;
    align-self: flex-start;
    &:after {
      position: absolute;
      content: '';
      left: 0;
      width: 100%;
      bottom: 0;
      height: 8px;
      background: rgba(233, 174, 49, 0.2);
    }
  }
  .content {
    height: 100%;
    overflow: auto;
    :deep(.el-alert) {
      padding: 8px 4px;
    }
    .effect-list {
      .effect-list-item {
        display: inline-block;
        width: 49%;
        padding: 10px;
        .img-wrapper {
          width: 100%;
          padding-bottom: 100%;
          position: relative;
          border-radius: 4px;
          outline: 2px solid #aaa;
          cursor: pointer;
          overflow: hidden;
          background: #e9e9e9;
          img {
            position: absolute;
            width: 100%;
            height: 100%;
          }
        }
        .effect-name {
          margin-top: 10px;
          text-align: center;
          text-overflow: ellipsis;
          font-size: 14px;
          color: #888;
        }
        &.active {
          .img-wrapper {
            outline: 2px solid $color-primary;
            box-shadow: 0 0 10px rgba($color-primary, 0.4);
          }
          .effect-name {
            color: $color-primary;
          }
        }
        &:hover {
          .img-wrapper {
            box-shadow: 0 0 10px rgba($color-primary, 0.4);
          }
        }
      }
    }
  }
  .footer {
    display: flex;
    flex-direction: row-reverse;
    margin-top: 10px;
  }
}
</style>
