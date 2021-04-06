<script>
import { h } from 'vue'
export default {
  name: "JsxRender",
  props: {
    scope: Object,
    render: Function
  },
  setup(props) {
    return () => props.render(h, props.scope)
  }
}
</script>
