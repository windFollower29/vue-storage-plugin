import Vue from 'vue'
import VueRouter from 'vue-router'
import Storage from '../pages/Storage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Storage',
    component: Storage
  },
  {
    path: '/Storage',
    name: 'Storage',
    component: Storage
  }
]

const router = new VueRouter({
  routes
})

export default router
