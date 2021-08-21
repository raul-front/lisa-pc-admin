/*
 * @Descripttion: 公共方法
 * @Author: pujianguo
 * @Date: 2021-04-02 09:41:58
 */
import * as filterConst from '@/filter/const'
import * as filterConstLisa from 'lisa/filter/const'
import formatFunc from '@/filter/format'
import formatFuncLisa from 'lisa/filter/format'
import { ElMessageBox } from 'element-plus'

/** *************** 数据相关 *************** **/
/**
 * 深拷贝数据
 * @param {Object} data 要拷贝的原数据
 * @return {Object} 拷贝后的数据
 */
export const copy = data => {
  return JSON.parse(JSON.stringify(data))
}
/**
 * 将const中的数据转化为下拉框选择时可用的数组
 * @param {Object} obj  const中的数据
 * @param {Object|null} firstItem 下拉框第一项，如：{value: '', label: '请选择xxx'}
 * @param {Boolean} isNumber key是否是number类型
 * @return {Array} 转换后的数据
 */
export const constDataToArray = (obj, firstItem = null, isNumber = false) => {
  const arr = []
  if (isNumber) {
    Object.getOwnPropertyNames(obj).forEach(k => {
      if (k !== 'default') {
        arr.push({ value: Number(k), label: obj[k] })
      }
    })
  } else {
    Object.getOwnPropertyNames(obj).forEach(k => {
      if (k !== 'default') {
        arr.push({ value: k, label: obj[k] })
      }
    })
  }
  firstItem && arr.unshift(firstItem)
  return arr
}

/**
 * filter过滤器 优先选择项目中的过滤器
 * @param {String} filterName 过滤器名称
 * @param {String} arg 参数
 * @return {String|Number} 转换结果，一般结果为字符串或数字
 */
export const filter = (filterName, arg) => {
  let data = filterConst[`${filterName}Data`]
  if (data) {
    return data[arg] || data.default
  } else {
    data = filterConstLisa[`${filterName}Data`]
    return data ? (data[arg] || data.default) : ''
  }
}
/**
 * format格式化 优先执行项目中的方法
 * @param {String} formatName 过滤器名称
 * @param {Array} args 任意多个参数
 * @return {String|Number} 转换结果，一般结果为字符串或数字
 */
export const format = (formatName, ...args) => {
  return formatFunc[formatName] ? formatFunc[formatName](...args) : (formatFuncLisa[formatName] ? formatFuncLisa[formatName](...args) : '')
}

/** *************** 时间相关 *************** **/
/**
 * 获取最近几小时的时间
 * @param {number} n 最近n小时，负数表示向前
 * @param {Date|String} t 计算的开始时间，为空时默认取当前时间
 * @param {string} filterName 最后格式化的filter名称，取值为：month、date、minute、second
 * @return {String} 计算后的格式化时间
 */
export const getRecentHour = (n, t, filterName = 'second') => {
  const now = t ? (new Date(t)) : new Date()
  now.setHours(now.getHours() + n)
  return filter(filterName, now)
}
/**
 * 获取最近几天的时间
 * @param {number} n 最近n天，负数表示向前
 * @param {Date|String} t 计算的开始时间，为空时默认取当前时间
 * @param {string} filterName 最后格式化的filter名称，取值为：month、date、minute、second
 * @return {String} 计算后的格式化时间
 */
export const getRecentDate = (n, t, filterName = 'date') => {
  const now = t ? (new Date(t)) : new Date()
  now.setDate(now.getDate() + n)
  return filter(filterName, now)
}

/**
 * 异步延迟
 * @param {number} n 延迟时间 毫秒
 * @return {Promise}
 */
export const sleep = (s) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve('')
    }, s)
  })
}

// 确认执行dialog
export const confirmExecHandle = (title, text, callback, cancelCallBack = null) => {
  return ElMessageBox.confirm(text, title, {
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '执行中...'
        instance.showClose = false
        instance.closeOnClickModal = false
        instance.closeOnPressEscape = false
        instance.showCancelButton = false

        callback().finally(() => {
          done()
          setTimeout(() => {
            instance.confirmButtonLoading = false
          }, 300)
        })
      } else {
        done()
        // ElMessage.info('取消操作')
        cancelCallBack && cancelCallBack()
      }
    },
  }).then(() => { // 在 beforeClose 中已经对then和catch后的事件做了处理，then可省略； 省略catch时，点击取消会提示错误
  }).catch(() => {
  })
}
// confirmExecHandle 使用示例：
// confirmExecHandle('提示', '此操作将删除xxx，是否继续？', () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
//   }).catch(_ => console.log('Oops errors!'))
// })

/** *************** table route相关 *************** **/
export const getRouteQuery = (query) => {
  const q = Object.assign({}, query)
  delete q.t
  // 根据需要做转换
  // if (q.store_ids) {
  //   q.store_ids = q.store_ids.split(',')
  // }
  // 根据需要做转换
  // if (q.begin_time) {
  //   q.begin_time = format('submitTime', q.begin_time)
  // }
  // if (q.end_time) {
  //   q.end_time = format('submitTime', q.end_time)
  // }
  return q
}
export const updateRouteQuery = (route, router, store, obj, clearOtherQuery = false) => {
  let q // 最后设置的query
  let s // 最后保存在store中的query
  let isPage = true
  // 不含分页的query
  if (!obj.hasOwnProperty('offset') && route.query.offset !== undefined) {
    if (clearOtherQuery) {
      s = Object.assign({ limit: 10, offset: 0, current: 1, total: 0 }, obj)
      q = Object.assign({ limit: 10, offset: 0 }, obj)
    } else {
      isPage = false
      s = Object.assign({}, route.query, obj, { offset: 0, current: 1 })
      q = Object.assign({}, route.query, obj, { offset: 0 })
    }
  } else { // 分页相关
    s = Object.assign({}, route.query, obj)
    // 路由里面不用存放current 和 total
    delete obj.current
    delete obj.total
    q = Object.assign({}, route.query, obj)
  }
  delete s.t

  // 清除q中的null，s中的null不清除无影响
  for (const k in q) {
    if (q[k] === null) {
      delete q[k]
    }
  }

  // 保存到store中
  store.commit('lisa/SET_PAGE_OPTION', {
    routerName: route.name,
    isPage: isPage,
    data: s,
  })
  q.t = (new Date()).getTime()
  router.replace({ query: q })
}
export const clearRouteQuery = (router, store, routerName) => {
  store.commit('lisa/CLEAR_PAGE_OPTION', routerName)
  router.replace({ query: {} })
}

// 用于调试
// 在打印json数据时，控制台默认收缩的数据，不方便查看内层数据
export const console = function (json, flag = 'log') {
  const a = [`${flag}--------------------`]
  for (const k in json) {
    if (typeof json[k] === 'object') {
      a.push(`${k}: ${JSON.stringify(json[k])}`)
    } else {
      a.push(`${k}: ${json[k]}`)
    }
  }
  a.push('--------------------')
  window.console.log(a.join('\n'))
}

/**
 * 数字转英文字母
 * 如：1->A
 * @param num
 * @returns {string}
 */
export const convert = (num) => {
  let result = ''
  while (num) {
    result = String.fromCharCode(--num % 26 + 65) + result
    num = Math.floor(num / 26)
  }
  return result
}

/**
 * 获取图片URL
 * @param {Blob} file 文件
 * @return {Boolean} 判断结果
 */
export const getImageObjectURL = (file) => {
  let url = null
  if (window.createObjectURL !== undefined) { // basic
    url = window.createObjectURL(file)
  } else if (window.URL !== undefined) { // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL !== undefined) { // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

/**
 * 无限极分类
 * @param {Array} cate 数组
 * @param {Number} pid 父级id
 * @param {String} k id标识
 * @return {Array} 层级嵌套的结果
 */
export const unlimitedForLayer = (cate, pid = 0) => {
  const arr = []
  cate.forEach(x => {
    if (x.parentId === pid) {
      x.children = unlimitedForLayer(cate, x.id)
      arr.push(x)
    }
  })
  return arr
}
