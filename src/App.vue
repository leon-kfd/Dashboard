<template>
  <Layout v-model:list="list" />
  <Setting />
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import Layout from '@/components/Layout.vue'
import Setting from '@/components/Setting.vue'
export default defineComponent({
  name: 'App',
  components: {
    Layout,
    Setting
  },
  setup () {
    const list = ref([
      {
        id: 1,
        w: 4,
        h: 2
      },
      {
        id: 2,
        w: 8,
        h: 2
      },
      {
        id: 3,
        w: 6,
        h: 2
      },
      {
        id: 4,
        w: 6,
        h: 2
      },
      {
        id: 5,
        w: 6,
        h: 2
      },
      {
        id: 6,
        w: 6,
        h: 2
      },
      {
        id: 7,
        w: 6,
        h: 2
      },
      {
        id: 8,
        w: 24,
        h: 2
      },
      {
        id: 9,
        w: 8,
        h: 2
      },
      {
        id: 10,
        w: 4,
        h: 2
      },
      {
        id: 11,
        w: 3,
        h: 2
      },
      {
        id: 12,
        w: 2,
        h: 2
      }
    ])
    return {
      list
    }
  }
})
</script>
<style lang="scss">
body {
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
    background-color: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    border-radius: 10px;
  }

  &:hover::-webkit-scrollbar-thumb {
    background-color: rgba(69, 90, 100, 0.2);
  }
}
</style>