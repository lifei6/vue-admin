import request from '@/utils/mockRequest.js'
const state = {
    list:{}
}
const mutations = {
    GETDATA(state,list){
        state.list = list
    }
}
const actions = {
    async getData({commit}){
        let res = await request({url:'/home/list',method:'get'})
        console.log(res)
        if(res.code==20000){
            commit('GETDATA',res.data)
        }
    }
}
const getters = {}
export default {
    state,
    mutations,
    actions,
    getters
}