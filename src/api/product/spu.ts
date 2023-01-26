// 书写SPU模块相关的接口函数

// 1. 引入异步模块
import request from "@/utils/request";
// 2. 使用枚举存储接口地址
enum Api {
  // 获取spu列表的API
  getSpuListApi = "/admin/product",
  // 添加SPU的API
  saveSpuInfoApi = "/admin/product/saveSpuInfo",
  // 更新SPU的API
  updateSpuInfoApi = "/admin/product/updateSpuInfo",
  // 删除SPU的API
  deleteSpuInfoApi = "/admin/product/deleteSpu",
  // 获取所有trademark数据
  getTrademarkApi = "/admin/product/baseTrademark/getTrademarkList",
  // 获取所有的属性数据
  getBaseSaleAttrApi = "/admin/product/baseSaleAttrList",
  // 根据spuId获取相关的销售属性值
  getSpuSaleAttrListApi = "/admin/product/spuSaleAttrList",
  // 根据SpuId获取待更新的图片列表
  getSpuImageListApi = "/admin/product/spuImageList",
}
// 3. 定义接口函数

/**
 * 3.1 定义一个获取spu列表的接口函数
 * @param page
 * @param limit
 * @returns
 */
export const reqGetSpuListData = (
  page: number,
  limit: number,
  category3Id: number
) => {
  return request.get<any, any>(
    Api.getSpuListApi + `/${page}/${limit}?category3Id=${category3Id}`
  );
};

/**
 * 3.2 定义一个添加spu数据的接口函数
 * @param spuInfo
 * @returns
 */
export const reqSaveSpuInfo = (spuInfo: any) => {
  return request.post<any, any>(Api.saveSpuInfoApi, spuInfo);
};

/**
 * 3.3 定义一个更新spu数据的接口函数
 * @param spuInfo
 * @returns
 */
export const reqUpdateSpuInfo = (spuInfo: any) => {
  return request.post<any, any>(Api.updateSpuInfoApi, spuInfo);
};

/**
 * 3.4 定义一个删除spu信息的接口函数
 * @returns
 */
export const reqDeleteSpuInfo = (spuId: number) => {
  return request.delete(Api.deleteSpuInfoApi + `/${spuId}`);
};

/**
 * 3.5 获取所有的trademark品牌数据
 * @returns
 */
export const reqGetAllTrademarkList = () => {
  return request.get<any, any>(Api.getTrademarkApi);
};

// 3.6 获取所有的销售属性列表数据
export const reqGetBaseSaleAttrList = () => {
  return request.get<any, any>(Api.getBaseSaleAttrApi);
};

// 3.8 定义一个根据SpuId获取图片列表的接口函数
export const reqGetSpuImageList = (spuId: number) => {
  return request.get<any, any>(Api.getSpuImageListApi + `/${spuId}`);
};

// 3.9 定义一个根据spuId获取销售属性列表的接口函数
export const reqGetSpuSaleAttrList = (spuId: number) => {
  return request.get<any, any>(Api.getSpuSaleAttrListApi + `/${spuId}`);
};
