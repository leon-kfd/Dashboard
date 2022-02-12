<template>
  <div
    v-if="updateFlag"
    ref="editorRef"
    class="milkdown-wrapper"
    :style="{
      width: '100%',
      height: '100%',
      fontSize: fontSize + 'px'
    }"
  />
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, computed } from 'vue'
import { Editor, rootCtx, defaultValueCtx, editorViewOptionsCtx } from '@milkdown/core'
import { commonmark } from '@milkdown/preset-commonmark'
import { listener, listenerCtx } from '@milkdown/plugin-listener'
import { gfm } from '@milkdown/preset-gfm'
import nord from './custom-nord'
import './icon-font.css'
import { lightenDarkenColor } from '@/utils/color'

const props = defineProps({
  enableTooltip: {
    type: Boolean,
    default: false
  },
  enableSlash: {
    type: Boolean,
    default: false
  },
  enableHistory: {
    type: Boolean,
    default: false
  },
  enablePrism: {
    type: Boolean,
    default: false
  },
  enableClipboard: {
    type: Boolean,
    default: false
  },
  markdown: {
    type: String,
    default: ''
  },
  textColor: {
    type: String,
    default: '#494e59'
  },
  fontSize: {
    type: Number,
    default: 16
  }
})

const emit = defineEmits(['change'])

const placeHolderColor = computed(() => lightenDarkenColor(props.textColor, 50))

const editorRef = ref()
const updateFlag = ref(true)

onMounted(() => {
  setEditorCtx()
})

let _markdown = ''
const setEditorCtx = async () => {
  const editor = Editor.make().config((ctx) => {
    ctx.set(rootCtx, editorRef.value);
    ctx.set(defaultValueCtx, props.markdown);
    ctx.set(editorViewOptionsCtx, { editable: () => true })
    ctx.set(listenerCtx, {
      markdown: [
        (getMarkdown) => {
          _markdown = getMarkdown()
          emit('change', _markdown)
        }
      ]
    })
  }).use(nord).use(commonmark).use(gfm).use(listener)
  if (props.enableTooltip) {
    const { tooltip } = await import('@milkdown/plugin-tooltip')
    editor.use(tooltip)
  }
  if (props.enableSlash) {
    const { slash } = await import('@milkdown/plugin-slash')
    editor.use(slash)
  }
  // if (props.enablePrism) {
  //   const { prism } = await import('@milkdown/plugin-prism')
  //   importPrismStyle()
  //   editor.use(prism)
  // }
  if (props.enableHistory) {
    const { history } = await import('@milkdown/plugin-history')
    editor.use(history)
  }
  if (props.enableClipboard) {
    const { clipboard } = await import('@milkdown/plugin-clipboard')
    editor.use(clipboard)
  }
  editor.create()
}

// const importPrismStyle = () => {
//   const target = document.querySelector('#prism-theme');
//   if (target) {
//     return target;
//   }
//   const link = document.createElement('link');
//   link.id = 'prism-theme';
//   link.setAttribute('rel', 'stylesheet');
//   link.setAttribute('href', 'https://unpkg.com/prism-themes/themes/prism-material-light.css');
//   document.head.appendChild(link);
// }

const update = async () => {
  updateFlag.value = false
  await nextTick()
  updateFlag.value = true
  await nextTick()
  setEditorCtx()
}

defineExpose({
  update
})
</script>
<style lang="scss">
.milkdown-wrapper {
  overflow-y: auto;
  .milkdown {
    max-width: inherit;
    padding: .4em .2em;
    background: transparent;
    color: v-bind(textColor);
    box-shadow: none;
    ul, li {
      list-style: revert;
    }
    ul:not(.code-fence_select),
    ol {
      padding-left: 2.3em;
    }
    .h1, .h2, .h3 {
      margin: 0.5em 0 !important;
    }
    .h1 {
      font-size: 2em;
      line-height: 2em;
    }
    .h2 {
      font-size: 1.6em;
      line-height: 1.6em;
    }
    .h3 {
      font-size: 1.3em;
      line-height: 1.3em;
    }
    .paragraph {
      font-size: 1em;
      line-height: 1.2em;
      &::before {
        color: v-bind(placeHolderColor)
      }
    }
    .code-fence {
      font-size: 0.85em;
      .code-fence_value,
      .code-fence_select {
        width: 10.25em;
      }
    }

    .editor > * {
      margin: .6em 0;
    }

    // blockquote
    .blockquote {
      padding-left: 1.5em;
      line-height: 1.5em;
    }

    // table
    .tableWrapper table * {
      font-size: 1em;
    }
    .tableWrapper table th,
    .tableWrapper table td {
      height: 2em;
      padding: .6em;
    }

    // task-list
    .task-list-item {
      list-style: none;
      label {
        position: absolute;
        top: 0;
        left: -1.5em;
        width: 1.5em;
        height: 1.5em;
        margin: 0.5em 0;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        .ed-icon {
          font-size: 1.5em;
        }
      }
      .paragraph {
        height: 1.5em;
        line-height: 1.5em;
        margin: 0.5em 0;
      }
    }
  }
}
</style>
