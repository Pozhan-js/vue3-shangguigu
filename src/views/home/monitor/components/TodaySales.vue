<template>
  <common-card title="今日销售额" :value="numberFormat(salesToday)">
    <div class="compare-wrap">
      <div class="compare">
        <span>日同比</span>
        <span class="emphasis">{{salesGrowthLastDay}}%</span>
        <span class="decrement"></span>
      </div>
      <div class="compare">
        <span>月同比</span>
        <span class="emphasis">{{salesGrowthLastMonth}}%</span>
        <span class="increment"></span>
      </div>
    </div>
    <template #footer>
      <span>昨日销售额</span>
      <span class="emphasis">{{moneyFormat(salesLastDay)}}</span>
    </template>
  </common-card>
</template>

<script lang="ts">
import CommonCard from './CommonCard.vue'
export default {
  name: 'TodaySales',
  components: {
    CommonCard
  }
}
</script>
<script lang="ts" setup>
import {ref,reactive,onMounted,computed} from 'vue'
import {useReportDataStore} from '@/stores/reportData'
import useFormat from '@/hooks/useFormat'
const reportDataStore = useReportDataStore()

const {numberFormat,moneyFormat}  = useFormat()
// 使用计算属性来精简数据层次
// 1. 今日销售额
// const salesToday = computed(()=>{
//   return reportDataStore.reportData.salesToday
// })
// 当箭头函数当中只有一行代码的时候，是可以省略return和大括号的 简写如下
const salesToday = computed(()=>reportDataStore.reportData.salesToday)
// 2. 昨天销售额
const salesLastDay = computed(()=>reportDataStore.reportData.salesLastDay)
// 3. 昨天增长量
const salesGrowthLastDay = computed(()=>reportDataStore.reportData.salesGrowthLastDay)
// 4. 上月增长量
const salesGrowthLastMonth = computed(()=>reportDataStore.reportData.salesGrowthLastMonth)
</script>


<style lang="scss" scoped>
.compare-wrap {
  height: 100%;
  font-size: 12px;
  font-weight: 700;
  color: #666;
  display: flex;
  flex-direction: column;
  .compare {
    flex: 1;
    display: flex;
    align-items: center;
  }
}
</style>