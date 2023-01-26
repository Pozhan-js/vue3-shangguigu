// 当前这个文件是与属性管理相关的接口文件
// 1. 引入异步对象
import request from '@/utils/request'

// 引入TS接口约束
import type { AttrInfoModel, AttrListModel } from './model/attrModel'
import type { CategoryIdsModel } from './model/categoryModel'
// 2. 使用枚举来保存服务器接口
enum Api {
  // 获取属性列表的API
  getAttrListApi = '/admin/product/attrInfoList',
  // 删除属性的API
  deleteAttrApi = '/admin/product/deleteAttr',
  // 添加或更新属性的API
  addOrUpdateAttrApi = '/admin/product/saveAttrInfo'
}
// 3. 获取属性列表
/**
 * 根据三级导航ID来获取属性列表的接口函数
 * @param param0
 * @returns
 */
export const reqGetAttrListData = ({ category1Id, category2Id, category3Id }:CategoryIdsModel) => {
  return request.get<any,any>(Api.getAttrListApi+`/${category1Id}/${category2Id}/${category3Id}`)
}

/**
 * 封装了一个删除属性的接口函数
 * @param attrId
 * @returns
 */
export const reqDeleteOneAttr = (attrId:number) => {
  return request.delete<any,null>(Api.deleteAttrApi+`/${attrId}`)
}

/**
 * 封装了一个添加或更新属性的接口函数
 * @param attrInfo
 * @returns
 */
export const reqAddOrUpdateAttrInfo = (attrInfo:AttrInfoModel) => {
  return request.post<any,null>(Api.addOrUpdateAttrApi,attrInfo)
}