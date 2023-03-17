import request from '@/utils/request'

// GET /admin/product/{page}/{limit}
export const reqSpuList = (page,limit,category3Id)=>request({url:`/admin/product/${page}/${limit}`,method:'get',params:{category3Id}})

// GET /admin/product/getSpuById/{spuId}
export const reqSpuById=(spuId)=>request({url:`/admin/product/getSpuById/${spuId}`,method:'get'})

// GET /admin/product/baseTrademark/getTrademarkList
export const reqTradeMarkList = ()=>request({url:'/admin/product/baseTrademark/getTrademarkList',method:'get'})


// GET /admin/product/spuImageList/{spuId}
export const reqSpuImageList=(spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'})

// GET /admin/product/baseSaleAttrList
export const reqSaleAttrList = ()=>request({url:'/admin/product/baseSaleAttrList',method:'get'})


// POST /admin/product/saveSpuInfo
// POST /admin/product/updateSpuInfo
export const reqAddOrUpdateSpu = (data)=>{
    if(data.id){
    return request({url:'/admin/product/updateSpuInfo',method:'post',data})
    }else{
    return request({url:'/admin/product/saveSpuInfo',method:'post',data})
    }
}

// DELETE /admin/product/deleteSpu/{spuId}

export const reqDeletSpu = (spuId)=>request({url:`/admin/product/deleteSpu/${spuId}`,method:'delete'})
// 






//获取销售属性的数据
///admin/product/spuSaleAttrList/{spuId}  get
export const reqSpuSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});


//获取平台属性的数据
//GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id} 
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});


//添加SKU
///admin/product/saveSkuInfo  post
export const reqAddSku = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});


//获取SKU列表数据的接口
//GET /admin/product/findBySpuId/{spuId}  
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:'get'});