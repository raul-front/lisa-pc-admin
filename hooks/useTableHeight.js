/*
 * @Descripttion: 设置table高度
 * @Author: pujianguo
 * @Date: 2021-07-28 19:24:55
 */

import { ref, onMounted, nextTick } from 'vue'

const useTableHeight = () => {
  const componentFlexPageRef = ref(null)
  const componentFlexTableRef = ref(null)

  const tableHeight = ref(null)

  onMounted(() => {
    nextTick(() => [
      setTableHeight(),
    ])
  })

  const setTableHeight = () => {
    const pageHeight = componentFlexPageRef.value.offsetHeight - 20
    const cTableHeight = componentFlexTableRef.value.$el.offsetHeight
    let height = pageHeight - cTableHeight + 105
    if (height < 100) {
      height = null
    }
    tableHeight.value = height
  }

  return {
    componentFlexPageRef,
    componentFlexTableRef,
    tableHeight,
  }
}

export default useTableHeight
