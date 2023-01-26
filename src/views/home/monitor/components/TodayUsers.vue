<template>
  <common-card title="今日交易用户数" :value="numberFormat(orderUser)">
    <div ref="barChartRef" style="width:100%;height:100%"></div>
    <template #footer>
      <span>退货率</span>
      <span class="emphasis">{{returnRate}}%</span>
    </template>
  </common-card>
</template>

<script lang="ts">
import CommonCard from './CommonCard.vue'
export default {
  name: 'TodayUsers',
  components: {
    CommonCard
  }
}
</script>

<script lang="ts" setup>
import * as echarts from 'echarts'
import type { EChartsType } from 'echarts'
import { ref, reactive, onMounted, computed, watch } from 'vue'
import { useReportDataStore } from '@/stores/reportData'
import useFormat from '@/hooks/useFormat'
const reportDataStore = useReportDataStore()

const { numberFormat, moneyFormat } = useFormat()
const barChartRef = ref() //
let myChart: EChartsType

// 使用计算属性来存储即将要渲染的数据
const orderUser = computed(() => reportDataStore.reportData.orderUser)
const returnRate = computed(() => reportDataStore.reportData.returnRate)
const orderUserTrend = computed(() => reportDataStore.reportData.orderUserTrend)
const orderUserTrendAxis = computed(() => reportDataStore.reportData.orderUserTrendAxis)

// 准备配置项数据
const getOption = () => {
  return {
    // 使用定位的方式来生成对应的结构
    grid: {
      left: 0,
      right: 0
    },
    xAxis: {
      show: false,
      // data: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
      data: orderUserTrendAxis.value
    },
    yAxis: {
      show: false
    },
    series: {
      type: 'bar',
      // data: [44, 126, 55, 88, 133, 99, 33, 113, 63, 98, 77, 123]
      data: orderUserTrend.value
    }
  }
}

// 1. 当页面组件挂载完毕的时候 才要使用数据生成对应的图形
onMounted(() => {
  myChart = echarts.init(barChartRef.value) // lineChartRef.value存着对应的div标签对象

  // 当浏览器宽度发生变化的时候，图表也要发生变化
  window.addEventListener('resize', () => {
    myChart && myChart.resize()
  })
})

watch(orderUser, () => {
  myChart.setOption(getOption())
})
</script>


<style>
</style>