<template>
  <el-button-group>
    <el-button v-for="item in list" :key="item.value"
      :type="active === item.value ? 'primary' : 'default'"
      @click="handleClick(item)">{{item.label}}</el-button>
  </el-button-group>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'r-select-button-group',
  props: {
    modelValue: [String, Number],
    list: Array,
    isSetFirst: {
      type: Boolean,
      default: false,
    },
  },
  setup (props, { emit }) {
    const active = ref('')

    const handleClick = (item) => {
      if (active.value !== item.value) {
        active.value = item.value
        emit('update:modelValue', active.value)
        emit('on-change', item)
      }
    }

    watch(() => props.modelValue, n => {
      if (!n) {
        if (props.isSetFirst) {
          handleClick(props.list[0])
        }
      } else {
        if (n !== active.value) {
          active.value = n
        }
      }
    }, { immediate: true })

    return {
      active,
      handleClick,
    }
  },
}
</script>
