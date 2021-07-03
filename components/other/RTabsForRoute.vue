<template>
  <r-tabs class="r-route-tabs" v-show="show" v-model="active"
    :list="list" @on-change="handleChange">
  </r-tabs>
</template>

<script>
// n级路由tabs
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export default {
  props: {
    level: {
      type: Number,
      default: 3,
    },
    list: Array,
  },
  setup (props) {
    const route = useRoute()
    const router = useRouter()

    const active = ref('')
    const show = computed(() => {
      return route.meta.showRouteTabs
    })
    watch(() => route.path, n => {
      if (show.value) {
        getActive()
      }
    })

    const getActive = () => {
      active.value = route.path.split('/')[props.level]
    }
    getActive()

    const handleChange = (item) => {
      router.push({ name: item.pageName }).catch(() => {})
    }

    return {
      active,
      show,
      handleChange,
    }
  },
}
</script>
<style lang="scss">
.r-route-tabs{
  margin: 0 20px;
}
</style>
