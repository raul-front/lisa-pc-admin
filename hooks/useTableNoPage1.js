/*
 * @Descripttion: 没有分页的table页面
 * @Author: pujianguo
 * @Date: 2021-07-28 19:24:55
 */

import { reactive, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { copy } from 'lisa/utils/func'

const useTablePage = (getDataHandle) => {
  const route = useRoute()
  const router = useRouter()

  const editDialogData = reactive({
    visible: false,
    data: { action: 'add' },
  })

  const routeName = route.name

  const tableData = reactive({
    tableData: [],
    tableLoading: false,
  })

  onMounted(() => {
    getData()
  })

  const getData = () => {
    tableData.tableLoading = true
    getDataHandle().then(list => {
      tableData.tableData = list
      tableData.tableLoading = false
    }).catch(_ => {
      console.log('e', _)
      tableData.tableData = []
      tableData.tableLoading = false
    })
  }

  const handleRefresh = () => {
    getData()
  }

  const openAddDialog = () => {
    editDialogData.data = { action: 'add' }
    editDialogData.visible = true
  }
  const openUpdateDialog = (item) => {
    editDialogData.data = copy(item)
    editDialogData.visible = true
  }

  const goAddPage = () => {
    router.push({ name: `${routeName}_Add`, query: {} })
  }
  const goUpdatePage = (id) => {
    router.push({ name: `${routeName}_Update`, params: { id: id } })
  }

  return {
    tableData,
    handleRefresh,
    goAddPage,
    goUpdatePage,
    openAddDialog,
    openUpdateDialog,
    editDialogData,
  }
}

export default useTablePage
