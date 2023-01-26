// 给属性管理当中的数据添加一些TS约束

// 定义一个约束属性数组列表中对象的接口
export interface AttrValueInfoModel {
  id?: number;
  valueName: string;
  attrId?: number,
  isShowInput: boolean
}

// 给数组约束设置一个别名
export type AttrValueListModel = AttrValueInfoModel[]

// 发送给服务器的属性对象，做一个约束接口
export interface AttrInfoModel {
  id?: number;
  attrName: string;
  // attrValueList: AttrValueInfoModel[];
  attrValueList: AttrValueListModel;
  categoryId: number | undefined;
  categoryLevel: number
}

// 属性列表接口约束 就是给attrList数组做约束的
export type AttrListModel = AttrInfoModel[]