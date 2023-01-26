import { createApp } from 'vue'
import pinia from './stores'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import './styles/index.scss'
import ElSvg from './components/SvgIcon/ElSvg'
import './permission'
import './mockServer' // 启动mock服务器
import {vueEcharts} from '@/plugins/chart'

const app = createApp(App)

// 创建全局报错检测函数
app.config.errorHandler = (err,vm,info)=>{
  console.log('[全局异常]',err,vm,info);
}



ElSvg(app)

app.use(pinia)
  .use(router)
  .use(vueEcharts)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .mount('#app')
