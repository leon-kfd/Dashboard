<script>
import { h, defineComponent, defineAsyncComponent } from 'vue'
export default defineComponent({
  name: 'JsxRender',
  components: {
    EngineConfig: defineAsyncComponent(() => import('@/materials/Search/EngineConfig.vue'))
  },
  props: {
    scope: Object,
    render: Function
  },
  setup(props) {
    return () => props.render(h, props.scope)
  }
})
</script>
