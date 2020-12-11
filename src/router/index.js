import Vue from 'vue'
import VueRouter from 'vue-router'
import ListPosts from '@/components/ListPosts.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: { name: 'ListPosts' }
  },
  {
    path: '*',
    redirect: { name: 'ListPosts' }
  },
  {
    path: '/posts',
    name: 'ListPosts',
    component: ListPosts
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

export default router
