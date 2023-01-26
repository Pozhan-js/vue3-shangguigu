export interface skuAttrValueMode {
  attrId: string;
  attrName: string;
  valueId: string;
  valueName: string;
}

export type skuAttrValueListModel = skuAttrValueMode[];

export interface skuSaleAttrValueModel {
  saleAttrId: string;
  saleAttrName: string;
  saleAttrValueId: string;
  saleAttrValueName: string;
}

export type skuSaleAttrValueListModel = skuSaleAttrValueModel[];

export interface skuImageModel {
  imgName: string;
  imgUrl: string;
  isDefault: string;
  spuImgId: number;
}

export type skuImageListModel = skuImageModel[];
// sku相关的内容
export interface skuInfoModel {
  id?: number;
  spuId?: number;
  skuName: string;
  price: number;
  weight: number;
  skuDesc: string;
  category3Id?: number | undefined;
  skuDefaultImg: string;
  // skuAttrValueList: [];
  skuAttrValueList: skuAttrValueListModel;
  // skuImageList: any[];
  skuImageList: skuImageListModel;
  // skuSaleAttrValueList: []
  skuSaleAttrValueList: skuSaleAttrValueListModel;
}
