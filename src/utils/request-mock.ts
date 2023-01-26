// import axios,{type AxiosResponse} from 'axios'
// import { ElMessage } from 'element-plus';

// /* 定义response对象的data接口 */
// interface ResponseData<T> {
//   code: number;
//   data: T;
//   message: string;
// }


// // 获取axios实例
// // 配置新建一个 axios 实例
// const service = axios.create({
//   // baseURL: import.meta.env.VITE_API_URL,
//   baseURL: '/mock', //服务器地址
//   timeout: 1000,
// });

// // 配置请求拦截器 （其实mock没有真实发送请求从浏览器到服务器 所以不需要配置请求拦截器）
// // 添加请求拦截器
// service.interceptors.request.use(
//   (config) => {
//     return config;
//   }
// );

// // 响应拦截器
// service.interceptors.response.use(
//   // 注意响应是一个异步操作
//   async(response: AxiosResponse<ResponseData<any>>)=>{
//     const res = response.data
//     return res.data
//   },
//   (error) => {
//     // 对响应错误做点什么
//     ElMessage.error('网络超时');
//     // 返回一个失败的promise
//     return Promise.reject(error);
//   }
// )


// // 将请求实列暴露出去
// export default service

import axios, { type AxiosResponse } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';

/* 定义response对象的data接口 */
interface ResponseData<T> {
  code: number;
  data: T;
  message: string;
}

// 配置新建一个 axios 实例
const service = axios.create({
  // baseURL: import.meta.env.VITE_API_URL,
  baseURL: '/mock',
  timeout: 1000,
});

// 添加请求拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  }
);


// 添加响应拦截器
service.interceptors.response.use(
  /* 约束一下response */
  async (response: AxiosResponse<ResponseData<any>>) => {
    // 对响应数据做点什么
    const res = response.data;
    return res.data; /* 返回成功响应数据中的data属性数据 */
  },
  (error) => {
    // 对响应错误做点什么
    ElMessage.error('网络超时');
    return Promise.reject(error);
  }
);

export default service;
