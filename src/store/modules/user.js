import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter,anyRoutes,asyncRoutes,constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes:[],
    resultAsyncRoutes:[],//最后比较计算出的异步路由
    resultAllRoutes:[],//合并后的最终路由

  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // }
  SET_USERINFO:(state,userInfo)=>{
    state.name = userInfo.name;
    state.avatar = userInfo.avatar;
    state.routes = userInfo.routes
  },
  SET_ROUTES:(state,resultAsyncRoutes)=>{
    state.resultAsyncRoutes = resultAsyncRoutes
    const resultAllRoutes = anyRoutes.concat(constantRoutes,resultAsyncRoutes)
    state.resultAllRoutes = resultAllRoutes
    router.addRoutes(anyRoutes.concat(resultAsyncRoutes))
  }
}
const computeAsyncRoutes=(asyncRoutes,routes)=>{

  return asyncRoutes.filter((item)=>{
    if(routes.indexOf(item.name)!=-1){
      if(item.children&&item.children.length){
        item.children=computeAsyncRoutes(item.children,routes)
      }
      return true
    }
  })
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({ username: username.trim(), password: password })
    // console.log(result)
    if(result.code==20000){
      commit('SET_TOKEN', result.data.token)
      setToken(result.data.token)
      return 'ok'
    }else{
      return Promise.reject(new Error('faile'))
    }
    
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        commit('SET_USERINFO',data)
        commit('SET_ROUTES',computeAsyncRoutes(asyncRoutes,data.routes))
        console.log(data)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

