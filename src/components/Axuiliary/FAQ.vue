<template>
  <div class="faq-md-wrapper">
    <FAQ class="faq-md" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue-demi'
import FAQ from './FAQ.md'
import { annotate } from 'rough-notation'
import { RoughAnnotation } from 'rough-notation/lib/model';

type AnnotateHTMLElement = HTMLElement & { _anno: RoughAnnotation }

const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.intersectionRatio > 0) {
      const el = entry.target as AnnotateHTMLElement
      el._anno.show()
    }
  })
}, {
  root: document.querySelector('#pane-FAQ'),
  threshold: 1
});
const annoArr: RoughAnnotation[] = []

onMounted(() => {
  const outlinkArr = document.querySelectorAll('.faq-md a');
  outlinkArr.forEach((a: Element) => {
    a.setAttribute('target', '_blank')
  })

  const elTypeMap = {
    h3: { type: 'highlight', color: 'rgba(233, 174, 49, 0.2)' },
    // code: { type: 'box', strokeWidth: 1, padding: 1, color: '#4A148C', multiline: true },
    strong: { type: 'underline', strokeWidth: 1, padding: 1, color: '#B71C1C', multiline: true, iterations: 2 }
  }

  Object.keys(elTypeMap).map(key => {
    const elArr = document.querySelectorAll(`.faq-md ${key}`) as NodeListOf<AnnotateHTMLElement>;
    elArr.forEach((el: AnnotateHTMLElement) => {
      const an = annotate(el, elTypeMap[key])
      annoArr.push(an)
      el._anno = an
      io.observe(el)
    })
  })
})

onUnmounted(() => {
  io.disconnect()
  annoArr.map(an => an.remove())
})

</script>
<style lang="scss">
.faq-md-wrapper {
  padding: 0 10px 20px;
  margin-top: -20px;
  .faq-md {
    position: relative;
    h3 {
      color: $color-grey1;
      font-weight: bold;
      font-size: 16px;
      display: inline-block;
      position: relative;
      margin-top: 30px;
      margin-bottom: 10px;
      // &:after {
      //   position: absolute;
      //   content: "";
      //   left: 0;
      //   width: 100%;
      //   bottom: 0;
      //   height: 8px;
      //   background: rgba(233, 174, 49, 0.2);
      // }
    }
    p {
      color: $color-grey2;
      font-size: 14px;
      line-height: 1.5;
      code {
        display: inline-block;
        padding: 0 2px;
        background: #fff2f2;
        border-radius: 2px;
        margin: 0 2px;
        font-size: 13px;
        font-weight: bold;
        font-family: inherit;
      }
    }
  }
}
</style>
