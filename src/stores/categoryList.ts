import {defineStore} from 'pinia';
import {reqGetCategory1ListData,reqGetCategory2ListData,reqGetCategory3ListData} from '@/api/product/category'
import type { CategoryStore } from '@/api/product/model/categoryModel'

// 创建三级导航store对象
export const useCategoryListStore = defineStore('categoryList',{
  state: ():CategoryStore=> {
    return {
      // 三级分类id
      category1Id:undefined,
      category2Id:undefined,
      category3Id:undefined,

      // 三级分类数据列表
      category1List: [],
      category2List: [],
      category3List: []
    }
  },
  actions:{
     // 1. 获取一级分类数据
     async getCategory1ListData() {
      // 发送请求获取新项目
     const result = await reqGetCategory1ListData()
     // console.log('一级分类',result);
      this.category1List = result
    },
    // 2.获取二级分类数据
    async getCategory2ListData(category1Id:number){
      // 得到二级下拉框数据
      const result  = await reqGetCategory2ListData(category1Id);
      // console.log('二级下拉菜单',result);
      this.category2List = result
    //  得到一级id
      this.category1Id = category1Id
    },
    // 2.获取二级分类数据
    async getCategory3ListData(category2Id:number){
      // 得到三级下拉框数据
      const result  = await reqGetCategory3ListData(category2Id);
      // console.log('三级下拉菜单',result);
      this.category3List = result
      //  得到二级id
      this.category2Id = category2Id
    },
    //设置3Id
    setCategory3Id(id:number) {
      this.category3Id = id
    }
  }
})