<template>
  <div class="wrapper">
    <div class="title">页面分身</div>
    <div class="content">
      <el-alert
        title="页面分身是一个多标签页的功能，允许用户配置出多个独立的页面，并允许使用快捷键切换。"
        type="info"
        :closable="false"
        style="margin-bottom: 8px;" />
    </div>
  </div>
</template>

<script lang="ts" setup>

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
  }
}
</style>
