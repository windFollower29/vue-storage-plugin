
import Vue from 'vue'
import Storage from './storage'
window.Vue = Vue
const storage = Vue.use(Storage, 'my-namespace', {
  string: {
    type: String,
    default: 'test'
  },
  number: {
    type: Number
  },
  boolean: {
    type: Boolean
  },
  array: {
    type: Array,
    default: [1, 2, 3]
  },
  object: {
    type: Object,
    default: {
      hello: 'world'
    }
  }
})

export default storage
