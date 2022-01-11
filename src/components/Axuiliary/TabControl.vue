<template>
  <div class="wrapper">
    <div class="title">页面分身</div>
    <div class="content">
      <el-alert
        title="页面分身是一个多标签页的功能，允许用户配置出多个独立的页面，并允许使用快捷键切换。"
        type="warning"
        :closable="false"
        style="margin-bottom: 8px;" />
      <div class="list-wrapper">
        <div class="item" v-for="(item, index) in tabList" :key="item.id" :data-idx="index + 1">
          <div class="name" @dblclick="handleRename(item.id)">{{ item.name || '未命名' }}</div>
          <div class="operation-wrapper">
            <button v-if="item.selected" class="operation btn btn-small btn-info" disabled>当前应用</button>
            <template v-else>
              <button class="operation btn btn-small btn-warning" @click="handleSelected(item.id)">应用</button>
              <button class="operation btn btn-small btn-danger" style="margin-left: 10px" @click="handleDel(item.id)">删除</button>
            </template>
          </div>
        </div>
        <div class="btn-add-wrapper">
          <button class="btn btn-primary" @click="handleAdd">新增</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useStore } from 'vuex'
import { uid } from '@/utils'
const store = useStore()
const tabList = computed(() => store.state.tabList)
onMounted(() => {
  if (!tabList.value || tabList.value.length === 0) {
    // 设置初始tabList
    const tabList = [{ id: uid(), selected: true }]
    store.dispatch('updateTabList', tabList)
  }
})

const handleRename = (id: string) => {
  const name = window.prompt('重命名标签页')
  if (name) {
    const _tabList = JSON.parse(JSON.stringify(tabList.value))
    const index = _tabList.findIndex((item: any) => item.id === id)
    if (~index) {
      _tabList[index].name = name
      store.dispatch('updateTabList', _tabList)
    }
  }
}

const handleAdd = () => {
  const newTab = { id: uid(), data: null }
  const _tabList = JSON.parse(JSON.stringify(tabList.value))
  _tabList.push(newTab)
  store.dispatch('updateTabList', _tabList)
}

const handleDel = (id: string) => {
  if (window.confirm('删除后不可恢复, 确认要删除该标签页?')) {
    const _tabList = JSON.parse(JSON.stringify(tabList.value))
    const index = _tabList.findIndex((item: any) => item.id === id)
    if (~index) {
      _tabList.splice(index, 1)
      store.dispatch('updateTabList', _tabList)
    }
  }
}

const handleSelected = (id: string) => {
  const _tabList = JSON.parse(JSON.stringify(tabList.value))
  const index = _tabList.findIndex((item: any) => item.id === id)
  if (~index) {
    const { list, affix, global, showBackgroundEffect, showRefreshBtn } = store.state
    const current = _tabList.find((item: any) => !!item.selected)
    current.selected = false
    current.data = JSON.parse(JSON.stringify({ list, affix, global, showBackgroundEffect, showRefreshBtn }))
    _tabList[index].selected = true
    _tabList[index].data = null
    store.dispatch('updateTabList', _tabList)
  }
}
</script>
<style lang='scss' scoped>
.wrapper {
  padding: 10px;
  .title {
    color: $--color-grey1;
    margin-bottom: 8px;
    position: relative;
    font-weight: bold;
    display: inline-block;
    &:after {
      position: absolute;
      content: "";
      left: 0;
      width: 100%;
      bottom: 0;
      height: 8px;
      background: rgba(233, 174, 49, 0.2);
    }
  }
  .content {
    &:deep {
      .el-alert {
        padding: 8px 4px;
      }
    }
    .list-wrapper {
      .item {
        display: flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 4px;
        margin-bottom: 10px;
        background: rgb(248, 246, 246);
        font-family: PingFang SC,HarmonyOS_Medium,Helvetica Neue,Microsoft YaHei,sans-serif;
        user-select: none;
        &::before {
          content: attr(data-idx);
          font-size: 32px;
          font-weight: bold;
          color: #000;
          width: 16px;
          opacity: 0.1;
          transition: 0.25s;
          transform: translateX(-4px);
        }
        .name {
          width: 100%;
          flex: 1;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          color: #686868;
          font-weight: 500;
          font-size: 14px;
          margin: 0 8px;
          line-height: 24px;
        }
        .operation-wrapper {
          display: flex;
          .operation {
            padding: 8px 12px;
            margin: 0;
          }
        }
      }
      .btn-add-wrapper {
        text-align: center;
        margin-top: 20px;
      }
    }
  }
}
</style>
