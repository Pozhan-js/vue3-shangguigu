<template>
  <common-card title="累计用户数" :value="numberFormat(usersTotal)">
    <div ref="barChartRef" style="width:100%;height:100%"></div>
    <template #footer>
      <div class="footer">
        <span>日同比</span>
        <span class="emphasis">{{userGrowthLastDay}}%</span>
        <span class="increment"></span>
        <span>月同比</span>
        <span class="emphasis">{{userGrowthLastMonth}}%</span>
        <span class="decrement"></span>
      </div>
    </template>
  </common-card>
</template>

<script lang="ts">
import CommonCard from './CommonCard.vue'
export default {
  name: 'TotalUsers',
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

// 准备数据
const usersTotal = computed(()=>reportDataStore.reportData.usersTotal)
const usersLastMonth = computed(()=>reportDataStore.reportData.usersLastMonth)
const userGrowthLastDay = computed(()=>reportDataStore.reportData.userGrowthLastDay)
const userGrowthLastMonth = computed(()=>reportDataStore.reportData.userGrowthLastMonth)

// 准确配置项
const getOption = () => {
  return {
    grid: {
      left: 0,
      right: 0
    },
    xAxis: {
      show: false,
      // data:['数据']
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      data: ['数据']
    },
    series: {
      type: 'bar',
      data: [42],
      // 设置柱条的宽度
      barWidth: 10,
      // 设置标签字体样式
      label: {
        show: true,
        formatter: '|',
        position: 'right'
      },
      // 显示柱条的背景颜色
      showBackground: true,
      // 柱条的颜色
      itemStyle: {
        color: 'orangered'
      }
    }
  }
}

// 1. 当页面组件挂载完毕的时候 才要使用数据生成对应的图形
onMounted(() => {
  myChart = echarts.init(barChartRef.value) // lineChartRef.value存着对应的div标签对象
  myChart.setOption(getOption())

  // 当浏览器宽度发生变化的时候，图表也要发生变化
  window.addEventListener('resize', () => {
    myChart && myChart.resize()
  })
})
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  align-items: center;
}
</style>