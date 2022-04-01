<template>
  <div class="faq-md-wrapper">
    <FAQ class="faq-md" />
  </div>
</template>

<script setup>
import FAQ from './FAQ.md'
</script>
<style lang="scss">
.faq-md-wrapper {
  padding: 10px;
  .faq-md {
    h3 {
      color: $color-grey1;
      font-weight: bold;
      font-size: 16px;
      margin-bottom: 8px;
      display: inline-block;
      position: relative;
      &:after {
        position: absolute;
        content: "";
        left: 0;
        width: 100%;
        bottom: 0;
        height: 8px;
        background: rgba(233, 174, 49, 0.2);
      }
      &:not(:first-child) {
        margin-top: 20px;
        margin-bottom: 8px;
      }
    }
    p {
      color: $color-grey2;
      font-size: 14px;
      code {
        display: inline-block;
        padding: 0 2px;
        background: rgb(255,241,234);
        border-radius: 2px;
      }
    }
  }
}
</style>
