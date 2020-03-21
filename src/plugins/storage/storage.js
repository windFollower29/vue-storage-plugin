// TODO: 直接通过'='修改还是通过方法修改？

class Storage {

  /**
   * 提供给Vue安装的函数
   * @param {Function} Vue 
   * @param {String} nameSpace 每个字段的前缀
   * @param {Object} options 所有将使用到的storage的key/value
   */
  static install (Vue, nameSpace, options) {

    if (typeof nameSpace === 'object') {
      options = nameSpace
      nameSpace = 'vue-storage'
    }

    return new Storage(Vue, nameSpace, options)
  }

  constructor (Vue, nameSpace, options = {}) {
    const self = this
    this.Vue = Vue
    this.nameSpace = `${nameSpace}-`
    this.options = options

    // 刷新页面时，把本地storage重新取出来
    const cacheStorage = Object.keys(window.localStorage)
      .filter(key => new RegExp(`^${this.nameSpace}`).test(key))
      .reduce((acc, key) => Object.assign(acc, {
        [ key.replace(this.nameSpace, '') ]: window.localStorage[key]
      }), {})

    // 每种数据类型的默认值
    const keyMap = [
      [ String, '' ],
      [ Boolean, '' ],
      [ Number, '' ],
      [ Array, [] ],
      [ Object, {} ],
    ]
    const map = this.typeMap = new Map(keyMap)

    let _storage = this.storage = {
      ...(
        Object.keys(options).reduce((acc, key) => {

          const { type, default: val } = options[key]
          if (!type) {
            Vue.util.warn(`type of the field 'key' is required`)
            return acc
          }

          return Object.assign(acc, {
            [key]: val === undefined ? map.get(type) : val
          })
        }, {})
      ),
      ...cacheStorage
    }
    // console.log(_storage)

    Object.keys(_storage).forEach(key => {
      
      try {

        const val = _storage[key]
        this.set(key, val)

      } catch (e) {

        Vue.util.warn('vue-storage-error', e)
      }

      Object.defineProperty(_storage, key, {
        get () {
          // return _storage[key]
          return self.get(key)
        },
        set (val) {
          // console.log('setter', val)
          self.set(key, val)
        },
        configurable: true
      })

      // 定义storage属性为可响应字段，（必须放在defineProperty后面，因为defineReactive里重写了一遍defineProperty，但对前者进行了兼容。如果放在前面，会被我们的getter和setter覆盖了，导致双向绑定失效。详情需看源码）且初始值为_storage
      Vue.util.defineReactive(_storage, key, _storage[key])

    })

    // 代理_storage
    Object.defineProperty(Vue.prototype, '$storage', {
      get () {
        // console.log('getter_$storage', a, b)
        return _storage
      }
    })

    // 代理Storage实例
    Object.defineProperty(Vue.prototype, '$storager', {
      get () { return self }
    })

    Vue.storage = _storage
    Vue.storager = self
    
  }

  /**
   * 根据field的类型还原storage值
   * @param {String} key 字段key
   * @param {String} val 字段value
   */
  _parse (key, val) {

    const def = this.options[key]
    if (!def) return val;

    switch (def.type) {

      case String:
        return val

      case Boolean:
        return val === 'true'

      case Number:
        const _v = parseFloat(val)
        // 处理值为空字符串的情况
        return isNaN(_v) ? '' : _v

      case Array:
      case Object:
        return JSON.parse(val)

      default:
        return val
    }
  }

  /**
   * 为字段添加特定标识前缀
   * @param {String} key storage字段值
   */
  _getKey (key) {
    return `${this.nameSpace}${key}`
  }

  /**
   * 获取storage的字段值
   * @param {String} key storage字段值
   */
  get (key) {
    // console.log('get')
    let val = window.localStorage.getItem(this._getKey(key))
    val = this._parse(key, val)
    return val
  }

  /**
   * 设置storage
   * @param {String} key storage字段值
   * @param {String} val storage字段对应值
   */
  set (key, val) {

    try {

      val = typeof val === 'object' ? JSON.stringify(val) : val
      window.localStorage.setItem(this._getKey(key), val)

    } catch (e) {
      Vue.util.warn(`storage setting fail, please check the value`)
    }
  }

  /**
   * 删除storage某个字段
   * @param {String} key storage字段值
   */
  remove (key) {
    window.localStorage.removeItem(this._getKey(key))
  }

  /**
   * 删除初始化设置的所有的storage
   */
  clear () {

    Object.keys(this.storage).forEach(key => {
      const lsKey = this._getKey(key)

      if (window.localStorage.hasOwnProperty(lsKey)) {
        window.localStorage.removeItem(lsKey)
      }
    })
    // this.storage = {}
  }
}


export default Storage