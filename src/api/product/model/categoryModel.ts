// 当前文件是用TS对数据实现类型约束

export type Numberable = number | undefined

export interface CategoryModel {
  id: number;
  name: string,
  hasChildren?: boolean,
  level?:number
}

export type CategoryListModel = CategoryModel[]

// 给三个ID的数据添加一个约束的接口
export interface CategoryIdsModel {
  category1Id: Numberable;
  category2Id: Numberable;
  category3Id: Numberable;
}

// 接口是可以继承的

export interface CategoryStore extends CategoryIdsModel{
 
  category1List: CategoryListModel;
  category2List: CategoryListModel;
  category3List: CategoryListModel;
}