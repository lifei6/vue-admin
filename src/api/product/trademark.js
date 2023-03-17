import request from '@/utils/request.js'

// /admin/product/baseTrademark/{page}/{limit}
export const reqTradeMarkList=(page,limit)=>request({url:`/admin/product/baseTrademark/${page}/${limit}`,method:'get'})

// /admin/product/baseTrademark/save

// /admin/product/baseTrademark/update
export const reqAddOrUpdateTradeMark = (tmList)=>{
    if(tmList.id){
        return request({url:'/admin/product/baseTrademark/update',method:'put',data:tmList})
    }else{
        return request({url:'/admin/product/baseTrademark/save',method:'post',data:tmList})

    }
}

// /admin/product/baseTrademark/remove/{id}
export const reqRemoveTradeMark=(id)=>request({url:`/admin/product/baseTrademark/remove/${id}`,method:'delete'})