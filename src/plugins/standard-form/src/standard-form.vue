<template>
  <el-form
    v-bind="$attrs"
    :model="formData"
    :rules="formRules"
    ref="form"
    class="standard-form">
    <el-form-item
      v-for="(item, key) in filterFormConf"
      :label="item.label && $t(item.label)"
      :title="item.label && $t(item.label)"
      :key="key"
      :prop="key"
      class="form-item-control"
      :style="[item.tips && 'padding-right: 30px', item.formItemStyle]"
    >
      <template v-if="typeLimit.includes(item.type)">
        <el-date-picker
          v-if="item.type === 'date-picker'"
          v-bind="{ ...item.attrs }"
          v-on="{ ...item.events }"
          v-model="formData[key]"
        />
        <component
          v-else
          :is="`el-${item.type}`"
          :clearable="['input'].includes(item.type)"
          v-bind="{ ...item.attrs }"
          v-on="{ ...item.events }"
          v-model="formData[key]"
        >
          <template v-if="item.text">{{ $t(item.text) }}</template>
          <template v-if="item.type === 'select'">
            <el-option
              v-for="(option, index) in item.option.list"
              :key="index"
              :label="$t(item.option.label ? option[item.option.label] : option)"
              :value="item.option.value ? option[item.option.value] : option"
            ></el-option>
          </template>
          <template v-if="item.type === 'radio-group'">
            <el-radio
              v-for="(radio, index) in item.radio.list"
              :key="index"
              :label="item.radio.value ? radio[item.radio.value] : radio"
              v-bind="{ ...item.radio.attrs }"
              >{{
                $t(item.radio.label
                  ? radio[item.radio.label]
                  : item.radio.value
                  ? radio[item.radio.value]
                  : radio)
              }}</el-radio
            >
          </template>
          <template v-if="item.type === 'checkbox-group'">
            <el-checkbox
              v-for="(checkbox, index) in item.checkbox.list"
              :key="index"
              :label="item.checkbox.value ? checkbox[item.checkbox.value] : checkbox"
              v-bind="{ ...item.checkbox.attrs }"
              >{{
                $t(item.checkbox.label
                  ? checkbox[item.checkbox.label]
                  : item.checkbox.value
                  ? checkbox[item.checkbox.value]
                  : checkbox)
              }}</el-checkbox
            >
          </template>
        </component>
      </template>
      <template v-if="item.slot">
        <slot v-if="!isFn(item.slot)" :name="item.slot"></slot>
        <jsx-render v-if="typeof item.slot === 'function'" :render="item.slot"></jsx-render>
      </template>
      <template v-if="item.unit">
        <span class="unit">{{ item.unit }}</span>
      </template>
      <template v-if="item.tips">
        <el-tooltip
          effect="dark"
          :show-after="200"
          popper-class="tools-tips"
          :content="$t(item.tips)"
          placement="bottom">
          <div class="form-item-tips">
            <Icon name="infomation" size="20" />
          </div>
        </el-tooltip>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
import JsxRender from './jsx-render.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'StandardForm',
  components: {
    JsxRender
  },
  props: {
    formConf: {
      type: Object,
      default: () => {}
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      typeLimit: [
        'input',
        'input-number',
        'select',
        'switch',
        'radio',
        'radio-group',
        'checkbox',
        'checkbox-group',
        'button',
        'button-group',
        'time-select',
        'date-picker',
        'color-picker'
      ]
    }
  },
  computed: {
    filterFormConf() {
      const newConf = {}
      Object.keys(this.formConf).map((key) => {
        if (typeof this.formConf[key].when === 'function') {
          if (this.formConf[key].when(this.formData)) {
            newConf[key] = this.formConf[key]
          }
        } else {
          newConf[key] = this.formConf[key]
        }
      })
      return newConf
    },
    formRules() {
      const rules = {}
      Object.keys(this.formConf).map((key) => {
        if (this.formConf[key].rules) {
          rules[key] = this.formConf[key].rules
        }
      })
      return rules
    }
  },
  mounted() {
    const { validate, validateField, resetFields, clearValidate } = this.$refs.form
    const obj = { validate, validateField, resetFields, clearValidate }
    Object.keys(obj).map((key) => {
      this[key] = obj[key]
    })
  },
  methods: {
    isFn(value) {
      return typeof value === 'function'
    }
  }
})
</script>
<style lang="scss" scoped>
.form-item-control {
  position: relative;
}
.unit {
  font-weight: bold;
  font-size: 12px;
  margin-left: 8px;
}
:deep(.form-item-tips) {
  position: absolute;
  top: 0;
  right: -24px;
  height: 32px;
  display: flex;
  align-items: center;
  font-size: 20px;
  cursor: pointer;
  color: $color-grey4;
}
:deep(.block-radio-group .el-radio) {
  line-height: 30px;
  display: block;
}
:deep(.font-selector.wrapper) {
  .el-select {
    width: calc(100% - 30px);
  }
  .icon-refresh {
    margin-left: 4px;
  }
}
</style>
