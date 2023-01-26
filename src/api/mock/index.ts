// // 1. 引入异步对象
// import request from '@/utils/request-mock';
// import type {ReportDataModel} from './model/data'

// // mock'请求接口
// export const reqGetReportData = ()=>request.get<any,ReportDataModel>('/report/data')


// 此文件是用来写mock服务器相关的接口函数的

import request from '@/utils/request-mock'

import type { ReportDataModel } from './model/data'

// 书写mock服务器的接口函数
export const reqGetReportData = ()=> request.get<any,ReportDataModel>('/report/data')