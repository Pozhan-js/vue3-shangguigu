<template>
  <common-card title="今日订单" :value="numberFormat(orderToday)">
    <!-- 如果不写template,则接下来的这一行代码就相当于是默认插槽 -->
    <div ref="lineChartRef" style="width:100%;height:100%;"></div>
    <template #footer>
      <span>昨日订单量</span>
      <span class="emphasis">{{moneyFormat(orderLastDay)}}</span>
    </template>
  </common-card>
</template>

<script lang="ts">
import CommonCard from './CommonCard.vue'
export default {
  name: 'TodayOrders',
  components: {
    CommonCard
  }
}
</script>

<script lang="ts" setup>
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import {ref,reactive,onMounted,computed,watch} from 'vue'
import {useReportDataStore} from '@/stores/reportData'
import useFormat from '@/hooks/useFormat'
const reportDataStore = useReportDataStore()

const {numberFormat,moneyFormat}  = useFormat()
const lineChartRef = ref() //
let myChart: EChartsType

// 还是使用计算属性简化数据
const orderToday = computed(()=>reportDataStore.reportData.orderToday)
const orderLastDay = computed(()=>reportDataStore.reportData.orderLastDay)
const orderTrend = computed(()=>reportDataStore.reportData.orderTrend)
const orderTrendAxis = computed(()=>reportDataStore.reportData.orderTrendAxis)
// console.log('ff',orderTrendAxis)
// const getOption = {} 如果直接写对象，在组件挂载完毕的时候，就会有这些数据
// 可以使用箭头函数的方式来书写配置项，当函数被调用的时候才执行里面的代码
const getOption = () => {
  return {
    xAxis: {
      boundaryGap: false, // 两侧不留空白
      // data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'] // x轴数据列表
      data:orderTrendAxis.value
    },
    yAxis: {
      // 不显示Y轴的数值
      show: false
    },
    series: [
      {
        name: '实时订单数',
        type: 'line',
        // 列表数据
        // data: orderTrend.value,
        // data: [44, 126, 55, 88, 133, 99, 33, 113, 63, 98, 77, 123],
        data:orderTrend.value,
        // 曲线平滑
        smooth: true,
        // 设置区域样式 来代替折线
        areaStyle: {
          color: 'purple'
        },
          // 折线点的样式
        itemStyle: {
          opacity: 0
        },
        // // 线的样式
        lineStyle: {
          opacity: 0
        }
      }
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    },
    //  显示提示
    tooltip: {
      trigger: 'axis',
      confine: true
    }
  }
}

// 1. 当页面组件挂载完毕的时候 才要使用数据生成对应的图形
onMounted(() => {
  myChart = echarts.init(lineChartRef.value) // lineChartRef.value存着对应的div标签对象

  // 当浏览器宽度发生变化的时候，图表也要发生变化
  window.addEventListener('resize', () => {
    // myChart.resize()这个方法是echarts来根据页面变化监测改变图标的大小的方法
    // 这段代码的意思是当图标被加载出来时，再根据页面大小调整图表的大小
    myChart && myChart.resize()
  })
})

// 添加一个监视 因为数据的获取是异步的
watch(orderToday,()=>{
  // 当检测到请求回来有数据是在给图表设置配置对象中的数据
  myChart.setOption(getOption())
})
</script>

<style>
</style>