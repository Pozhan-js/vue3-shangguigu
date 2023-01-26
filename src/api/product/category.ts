import request from '@/utils/request'
import type {CategoryListModel} from '@/api/product/model/categoryModel'


// 2. 使用枚举定义接口
enum Api {
  getCategory1ListApi = '/admin/product/getCategory1',
  getCategory2ListApi = '/admin/product/getCategory2',
  getCategory3ListApi = '/admin/product/getCategory3'
}

/**
 * 3. 获取一级分类数据
 * @returns 
 */
export const reqGetCategory1ListData = () => {
  return request.get<any,CategoryListModel>(Api.getCategory1ListApi)
}
/**
 * 4. 获取二级分类数据
 * @param category1Id 
 * @returns 
 */
export const reqGetCategory2ListData = (category1Id:number) => {
  return request.get<any,CategoryListModel>(`${Api.getCategory2ListApi}/${category1Id}`)
}
/**
 * 5. 获取三级分类数据
 * @param category2Id 
 * @returns 
 */
export const reqGetCategory3ListData = (category2Id:number) => {
  return request.get<any,CategoryListModel>(`${Api.getCategory3ListApi}/${category2Id}`)
}