<script>
import { h, defineComponent, defineAsyncComponent } from 'vue'
export default defineComponent({
  name: 'JsxRender',
  components: {
    EngineConfig: defineAsyncComponent(() => import('@/materials/Search/EngineConfig.vue')),
    PositionSelector: defineAsyncComponent(() => import('@/plugins/position-selector')),
    FontSelector: defineAsyncComponent(() => import('@/components/FormControl/FontSelector.vue')),
    StandardColorPicker: defineAsyncComponent(() => import('@/components/FormControl/StandardColorPicker.vue'))
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
