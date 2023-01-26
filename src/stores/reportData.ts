// // 1. 引入组件及接口
// import { defineStore } from "pinia";
// import type { ReportDataModel } from "@/api/mock/model/data";
// import { reqGetReportData } from "@/api/mock";

// export const useReportDataStore = defineStore({
//   id:'reportData',  //store的唯一标识符 相当于实现了命名空间的操作
//   state(){
//     return {
//       reportData: {} as ReportDataModel
//     }
//   },
//   actions:{
//     // 请求接口函数存储到state中
//     async getReportData(){
//       console.log('store开始');
//       const result = await reqGetReportData()
//       console.log('pinia存储mock数据');
      
//       // 在pinia中可以直接通过this来访问state中的数据
//       this.reportData = result
//     }
//   }
// })

// 统一来存储home页面中的数据
import { defineStore } from "pinia";
import type { ReportDataModel } from "@/api/mock/model/data";
import { reqGetReportData } from "@/api/mock";

// 定义store
// export const useReportDataStore = defineStore('reportData', {
  // state: ():ReportDataModel => {
  //   return {

  //   }
  // }
// })
export const useReportDataStore = defineStore({
  id: 'reportData',
  state() {
    return {
      // 对象中有一个属性是reportData 属性值还是对象
      reportData: {} as ReportDataModel
    }
  },
  actions: {
    async getReportData() {
      const result = await reqGetReportData()
      // console.log('home', result)
      this.reportData = result
    }
  }
})