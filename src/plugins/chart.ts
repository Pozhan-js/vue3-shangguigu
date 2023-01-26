import * as $echarts from 'echarts'
import type { App } from 'vue'
import VueEcharts from 'vue-echarts'

const vueEcharts = (app: App) => {
  // 全局注册vue-echarts组件 这个插件提供了我们所需的基本列表和图表
  app.component('v-chart', VueEcharts)
}

export {
  $echarts,
  vueEcharts
}