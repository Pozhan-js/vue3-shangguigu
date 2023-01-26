// 1. 引入异步对象
import request from "@/utils/request";
import type { skuInfoModel } from "./model/skuModel";
// 2. 使用枚举来存储接口
enum Api {
  // 根据spuId 获取sku数据
  getSkuListApi = "/admin/product/findBySpuId",
  // 添加SkuInfo
  saveSkuInfoApi = "/admin/product/saveSkuInfo",
  // 查看所有的skuList数据
  getAllSkuListApi = "/admin/product/list",
  // sku上架
  skuOnSaleApi = "/admin/product/onSale",
  // sku下架
  skuCancleSaleApi = "/admin/product/cancelSale",
  // 删除sku
  deleteSkuInfoApi = "/admin/product/deleteSku",
  // 根据id获取一条skuInfo的详细数据
  // getSkuInfoApi = '/admin/product/getSkuInfo'
  getSkuInfoApi = "/admin/product/getSkuById",
}
// 3. 定义接口函数
// 3.1 添加SkuInfo数据
export const reqSaveSkuInfo = (skuInfo: skuInfoModel) => {
  return request.post<any, any>(Api.saveSkuInfoApi, skuInfo);
};

// 3.2 根据spuId获取sku列表
export const reqGetSkuListData = (spuId: any) => {
  return request.get<any, any>(`${Api.getSkuListApi}/${spuId}`);
};

// 3.3 查看所有的sku数据
export const reqGetAllSkuListData = (page: number, limit: number) => {
  return request.get<any, any>(Api.getAllSkuListApi + `/${page}/${limit}`);
};

// 3.4 sku商品上架
export const reqSkuOnSale = (skuId: number) => {
  return request.get<any, any>(Api.skuOnSaleApi + `/${skuId}`);
};

// 3.5 sku商品下架
export const reqSkuCancelSale = (skuId: number) => {
  return request.get<any, any>(Api.skuCancleSaleApi + `/${skuId}`);
};

// 3.6 删除sku
export const reqDeleteSkuInfo = (skuId: number) => {
  return request.delete<any, null>(Api.deleteSkuInfoApi + `/${skuId}`);
};

// 3.7 获取skuInfo详情信息
export const reqGetOneSkuInfo = (skuId:number) => {
  return request.get<any,any>(Api.getSkuInfoApi+`/${skuId}`)
}
