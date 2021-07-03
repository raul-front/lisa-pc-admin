<template>
  <div class="r-tabs">
    <div v-for="item in list" :key="item.value"
      class="item" :class="{active: active === item.value}"
      @click="handleClick(item)"
    >{{item.label}}</div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'

export default {
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
      if (n === '') {
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

<style lang="scss">
.r-tabs{
  padding: 0 20px;
  background: #e4ebf1;
  .item{
    margin-right: 5px;
    padding: 10px 18px;
    font-size: 12px;
    display: inline-block;
    border-radius: 3px 3px 0 0;
    background: #d5e0e9;
    color: #324558;
    cursor: pointer;
    &:hover{
      background: #c6d5e1;
    }
    &.active{
      background: #ffffff;
      font-weight: bold;
    }
  }
}
</style>
