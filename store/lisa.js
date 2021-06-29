/*
 * @Descripttion:
 * @Author: pujianguo
 * @Date: 2021-06-29 11:02:31
 */

import storage from 'lisa/utils/storage'

const state = {
  menuCollapsed: false,
  token: '',
  pageOption: {},
}

export default {
  namespaced: true,
  state,
  actions: {
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      storage.setToken(token)
    },
    // 设置菜单收缩
    SET_MENU_COLLAPSED (state, payload) {
      storage.setMenuCollapsed(payload)
      state.menuCollapsed = payload
    },
    SET_PAGE_OPTION (state, { routerName, data, isPage }) {
      let option = state.pageOption[routerName] ? state.pageOption[routerName] : {}
      if (isPage) {
        option = data
      } else {
        option = Object.assign({}, option, data)
      }
      state.pageOption[routerName] = option
      storage.setPageOption(state.pageOption)
    },
    CLEAR_PAGE_OPTION (state, routerName) {
      delete state.pageOption[routerName]
      storage.setPageOption(state.pageOption)
    },

    // 设置初始数据
    SET_INITDATA_FROM_STORAGE (state, { token, pageOption, menuCollapsed }) {
      if (token) {
        state.token = token
      }
      if (pageOption) {
        state.pageOption = pageOption
      }
      if (menuCollapsed !== null) {
        // 注意：storage里面存放的是字符串，这里需要转换
        state.menuCollapsed = menuCollapsed === 'true'
      }
    },
  },
}
