// 当前此文件是对trademark模块中的数据做TS约束
// 只要你想说明一个对象中具有哪些属性及类型，就可以使用接口

// 声明单个品牌对象中的属性及类型
export interface TrademarkModel {
  id?: number;
  tmName: string;
  logoUrl: string;
}

// 相当于是取一个别名
// 声明品牌列表中存储的内容项
export type TrademarkListModel = TrademarkModel[];

// 添加一个服务器端响应回来数据的约束的接口
export interface TrademarkListDataModel {
  total: number;
  // records: TrademarkMode[]
  records: TrademarkListModel;
  abc333: number;
}
