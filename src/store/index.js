import Vue from 'vue'
import Vuex from 'vuex'
import posts from '@/modules/posts'

const isDev = process.env.NODE_ENV !== 'production'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: { posts },
  strict: isDev
})
