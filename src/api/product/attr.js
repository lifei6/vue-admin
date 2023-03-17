import request from '@/utils/request.js'

// /admin/product/getCategory1
export const reqCategory1List = ()=>request({url:'/admin/product/getCategory1',method:'get'})
// GET /admin/product/getCategory2/{category1Id}
export const reqCategory2List = (category1Id)=>request({url:`/admin/product/getCategory2/${category1Id}`,method:'get'})

// GET /admin/product/getCategory3/{category2Id}
export const reqCategory3List = (category2Id)=>request({url:`/admin/product/getCategory3/${category2Id}`,method:'get'})

// GET /admin/product/attrInfoList/{category1Id}/{category2Id}/{category3Id}
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'})

// POST /admin/product/saveAttrInfo
export const reqAddAttrInfo=(data)=>request({url:'/admin/product/saveAttrInfo',method:'post',data})

// DELETE /admin/product/deleteAttr/{attrId}
export const reqDeleteAttr=(attrId)=>request({url:`/admin/product/deleteAttr/${attrId}`,method:'delete'})