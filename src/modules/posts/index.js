import api from '@/modules/api'
import axios from 'axios'
import { maxBy } from 'lodash'

const GET_POSTS = 'GET_POSTS'
const CREATE_POST = 'CREATE_POST'
const DELETE_POST = 'DELETE_POST'
const CHANGE_POST = 'CHANGE_POST'
const SET_POST_COMMENTS = 'GET_POST_COMMENTS'
const SET_ALL_COMMENTS = 'SET_ALL_COMMENTS'
const ADD_COMMENT = 'ADD_COMMENT'
const DELETE_COMMENT = 'DELETE_COMMENT'

export default {
  state: {
    posts: [],
    comments: [],
    allComments: []
  },
  getters: {
    getCurrentPostComments: state => id => state.allComments.filter(item => item.postId === id)
  },
  actions: {
    fetchPosts ({ commit, dispatch }) {
      api.get('posts').then(response => {
        commit(GET_POSTS, response.data)
        dispatch('fetchComments')
      }).catch((e) => {
        console.error(e)
      })
    },
    createPost ({ commit }, data) {
      api.post('posts', data).then(response => {
        commit(CREATE_POST, response.data)
      }).catch((e) => {
        console.error(e)
      })
    },
    changePost ({ commit }, data) {
      api.put(`posts/${data.id}`, data).then(response => {
        commit(CHANGE_POST, response.data)
      }).catch((e) => {
        console.error(e)
      })
    },
    deletePost ({ commit }, id) {
      api.delete(`posts/${id}`).then(() => {
        commit(DELETE_POST, id)
      }).catch((e) => {
        console.error(e)
      })
    },
    // Getting comments on a some post from the api
    fetchPostComments({ commit }, id) {
      api.get(`/posts/${id}/comments`).then(response => {
        commit(SET_POST_COMMENTS, response.data)
      }).catch((e) => {
        console.error(e)
      })
    },
    async fetchComments({ commit, state }) {
      const arrAxios = state.posts.reduce((arr, current) => {
        arr.push(api.get(`/posts/${current.id}/comments`))
        return arr
      }, [])
      let arrComments = []
      await axios.all(arrAxios).then(
        axios.spread(function(...args) {
          args.forEach(
            item => {
              arrComments = [...arrComments, ...item.data]
            }
          )
        })
      )
      commit(SET_ALL_COMMENTS, arrComments)
    },
    createComment ({ commit }, data) {
      commit(ADD_COMMENT, data)
    },
    deleteComment ({ commit }, id) {
      commit(DELETE_COMMENT, id)
    }
  },
  mutations: {
    [GET_POSTS] (state, data) {
      state.posts = [...data]
    },
    [CREATE_POST] (state, data) {
      state.posts.push(data)
    },
    [CHANGE_POST] (state, data) {
      let list = state.posts
      let post = list.find(item => item.id === data.id)
      if (post) {
        Object.assign(post, data)
      }
    },
    [DELETE_POST] (state, id) {
      const index = state.posts.findIndex(item => item.id === id)
      if (index > -1) {
        state.posts.splice(index, 1)
      }
    },
    [SET_POST_COMMENTS] (state, data) {
      state.comments = [...data]
    },
    [SET_ALL_COMMENTS] (state, data) {
      state.allComments = [...data]
    },
    [ADD_COMMENT] (state, data) {
      const max = maxBy(state.allComments, 'id')
      const comment = {...data, id: max.id + 1}
      state.allComments.push(comment)
    },
    [DELETE_COMMENT] (state, id) {
      const index = state.allComments.findIndex(item => item.id === id)
      if (index > -1) {
        state.allComments.splice(index, 1)
      }
    }
  }
}
