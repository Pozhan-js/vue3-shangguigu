// 引入axios实列对象
import request from "@/utils/request";
import type {
  TrademarkListDataModel,
  TrademarkModel,
} from "./model/trademarkModel";

enum Api {
  // 获取品牌列表的接口
  getTrademarkListApi = "/admin/product/baseTrademark",
  // 添加品牌
  saveTrademarkApi = "/admin/product/baseTrademark/save",
  // 删除品牌请求
  removeTrademarkApi = "/admin/product/baseTrademark/remove",
  // 修改一条数据
  updateTrademarkApi = "/admin/product/baseTrademark/update",
}

// 3获取品牌列表数据
export const reqGetAllTrademarkListData = (page: number, limit: number) => {
  return request.get<any, TrademarkListDataModel>(
    `${Api.getTrademarkListApi}/${page}/${limit}`
  );
};

// 4.添加品牌请求
export const reqSaveTrademarkInfo = (trademark: TrademarkModel) => {
  return request.post<any, null>(Api.saveTrademarkApi, trademark);
};

// 5. 删除品牌
export const reqDeleteTrademarkInfo = (id: number) => {
  // 由于响应回来的数据中data是null,所以下面设置的也是null
  return request.delete<any, null>(`${Api.removeTrademarkApi}/${id}`);
};

// 6. 更新品牌
export const reqUpdateTrademarkInfo = (trademark: TrademarkModel) => {
  // 由于响应回来的数据中data是null,所以下面设置的也是null
  return request.put<any, null>(Api.updateTrademarkApi, trademark);
};
