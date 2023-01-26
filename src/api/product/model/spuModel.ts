export interface SpuSaleAttrValueModel {
  id?: number;
  baseSaleAttrId?: number;
  saleAttrName: string;
  saleAttrValueName?: string;
}

export type SpuSaleAttrValueListModel = SpuSaleAttrValueModel[];

export interface SpuSaleAttrModel {
  id?: number;
  saleAttrName: string;
  baseSaleAttrId?: number;
  inputVisible?: boolean;
  // spuSaleAttrValueList:[]
  spuSaleAttrValueList: SpuSaleAttrValueListModel;
}
export type SpuSaleAttrListModel = SpuSaleAttrModel[];

export interface BaseSaleAttrModel {
  id: number;
  name: string;
}

export type BaseSaleAttrListModel = BaseSaleAttrModel[];

export interface SpuInfoModel {
  id?: number;
  spuName: string;
  spuId?: number;
  tmId?: number | string;
  description: string;
  spuImageList: any[];
  // spuSaleAttrList: [],
  spuSaleAttrList: SpuSaleAttrListModel;
  spuSaleAttr?: string;
  category3Id?: number;
}

category3Id: 61;
description: "小米122145";
id: 5475;
spuImageList: [];
spuName: "小米";
spuSaleAttrList: [];
tmId: 1;
