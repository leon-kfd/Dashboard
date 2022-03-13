<template>
  <div class="wrapper">
    <div class="title">{{$t('多页设置')}}</div>
    <div class="content">
      <el-alert
        :title="$t('tabsTips')"
        type="warning"
        :closable="false"
        style="margin-bottom: 8px"
      />
      <div class="list-wrapper">
        <div class="item" v-for="(item, index) in tabList" :key="item.id" :data-idx="index + 1">
          <div class="name" @dblclick="handleRename(item.id)">{{ item.name || $t('未命名') }}</div>
          <div class="operation-wrapper">
            <button v-if="item.selected" class="operation btn btn-small btn-info" disabled>
              {{$t('当前应用')}}
            </button>
            <template v-else>
              <button class="operation btn btn-small btn-warning" @click="handleSelected(item.id)">
                {{$t('应用')}}
              </button>
              <button
                class="operation btn btn-small btn-danger"
                style="margin-left: 10px"
                @click="handleDel(item.id)"
              >
                {{$t('删除')}}
              </button>
            </template>
          </div>
        </div>
        <div class="btn-add-wrapper">
          <button class="btn btn-primary" @click="handleAdd">
            <Icon name="add" size="1.2em" style="margin-right: 4px" /> {{$t('新增')}}
          </button>
        </div>
      </div>
    </div>

    <div class="title" style="margin-top: 20px">{{$t('其他设置')}}</div>
    <div class="content">
      <el-form label-width="110px">
        <el-form-item :label="$t('展示切换按钮')">
          <div class="flex-center-y" style="height: 100%">
            <el-switch v-model="showTabSwitchBtn"></el-switch>
            <Tips :content="$t('tabsSwitchBtnTips')" />
          </div>
        </el-form-item>
        <el-form-item :label="$t('方向键切换')">
          <div class="flex-center-y" style="height: 100%">
            <el-switch v-model="enableKeydownSwitchTab"></el-switch>
            <Tips :content="$t('tabsKeyboardSwitchTips')" />
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue'
import { useStore } from '@/store'
import { uid } from '@/utils'
import Tips from '@/components/Tools/Tips.vue'
import { useI18n } from 'vue-i18n'
const store = useStore()
const tabList = computed(() => store.tabList)
const { t } = useI18n()
onMounted(() => {
  if (!tabList.value || tabList.value.length === 0) {
    // 设置初始tabList
    const tabList = [{ id: uid(), selected: true }]
    store.updateTabList(tabList)
  }
})

const handleRename = (id: string) => {
  const name = window.prompt(t('重命名标签页'))
  if (name) {
    const _tabList = JSON.parse(JSON.stringify(tabList.value))
    const index = _tabList.findIndex((item: any) => item.id === id)
    if (~index) {
      _tabList[index].name = name
      store.updateTabList(_tabList)
    }
  }
}

const handleAdd = () => {
  const newTab = {
    id: uid(),
    data: {
      list: [],
      affix: [],
      global: {
        background: '#242428',
        backgroundFilter: 'brightness(0.8)',
        gutter: 10,
        css: '',
        js: '',
        globalFontFamily: '',
        siteTitle: ''
      },
      showBackgroundEffect: false,
      showRefreshBtn: true
    }
  }
  const _tabList = JSON.parse(JSON.stringify(tabList.value))
  if (_tabList.length > 6) {
    alert(t('标签页已达上限，无法添加'))
    return
  }
  _tabList.push(newTab)
  store.updateTabList(_tabList)
}

const handleDel = (id: string) => {
  if (window.confirm(t('删除后不可恢复, 确认要删除该标签页?'))) {
    const _tabList = JSON.parse(JSON.stringify(tabList.value))
    const index = _tabList.findIndex((item: any) => item.id === id)
    if (~index) {
      _tabList.splice(index, 1)
      store.updateTabList(_tabList)
    }
  }
}

const handleSelected = (id: string) => {
  store.updateTabSelected(id)
}

const showTabSwitchBtn = computed({
  get: () => store.showTabSwitchBtn,
  set: (value: boolean) => {
    store.updateState({ key: 'showTabSwitchBtn', value })
  }
})
const enableKeydownSwitchTab = computed({
  get: () => store.enableKeydownSwitchTab,
  set: (value: boolean) => {
    store.updateState({ key: 'enableKeydownSwitchTab', value })
  }
})
</script>
<style lang='scss' scoped>
.wrapper {
  padding: 10px;
  .title {
    color: $color-grey1;
    margin-bottom: 8px;
    position: relative;
    font-weight: bold;
    display: inline-block;
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
    :deep(.el-alert) {
      padding: 8px 4px;
    }
    .list-wrapper {
      .item {
        display: flex;
        align-items: center;
        padding: 4px 12px;
        border-radius: 4px;
        margin-bottom: 10px;
        background: rgb(248, 246, 246);
        font-family: PingFang SC, HarmonyOS_Medium, Helvetica Neue, Microsoft YaHei, sans-serif;
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
