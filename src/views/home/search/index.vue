<template>
  <el-card class="search">
    <template #header>
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">销售额</el-menu-item>
        <el-menu-item index="2">访问量</el-menu-item>
      </el-menu>
      <div class="right">
        <el-radio-group v-model="radio1">
          <el-radio-button label="今日" />
          <el-radio-button label="本周" />
          <el-radio-button label="本年" />
          <el-radio-button label="今年" />
        </el-radio-group>
        <el-date-picker style="width:320px;margin-left:10px;" v-model="DateTime.time2" type="daterange"
          range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间" />
      </div>

    </template>
    <!-- 表格展现 -->
    <div class="content">
      <!-- 一定要给容器元素指定确定高度 -->
      <v-chart :option="getBarOption()" autoresize></v-chart>

      <!-- 右侧排行榜 -->
      <div class="rank-list">
        <div class="title">{{ DateTime.activeIndex === '1' ? '门店销售额排名' : '门店访问量排名' }}</div>
        <div class="list">
          <div class="list-item" v-for="item in rankData">
            <div class="no" :class="item.no <= 3 ? 'top-no' : ''">{{ item.no }}</div>
            <div class="name">{{ item.name }}</div>
            <div class="count">{{ item.count }}</div>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { ref, reactive, computed } from 'vue'
import { useReportDataStore } from '@/stores/reportData'
const reportDataStore = useReportDataStore()
const activeIndex = ref<string>('1')
const radio1 = ref<string>('今日')

// 1. 使用计算属性来简化一下数据
const orderFullYear = computed(() => reportDataStore.reportData.orderFullYear)
const userFullYear = computed(() => reportDataStore.reportData.userFullYear)
const orderFullYearAxis = computed(() => reportDataStore.reportData.orderFullYearAxis)
const userFullYearAxis = computed(() => reportDataStore.reportData.userFullYearAxis)
const orderRank = computed(() => reportDataStore.reportData.orderRank)
const userRank = computed(() => reportDataStore.reportData.userRank)
// const rankData = computed(() => {
//   return state.activeIndex === '1' ? orderRank : userRank
// })
const rankData = computed(() => (DateTime.activeIndex === '1' ? orderRank.value : userRank.value))

//准备好请求需要的数据
const DateTime = reactive({
  activeIndex: '1',
  time: '本周',
  time2: ''
})

// 函数切换
const handleSelect = (key: string) => {
  //当标题切换的时候触发
  DateTime.activeIndex = key
}
// 因为图标的数据是要动态切换的
// 所以配置对象就不能是固定的 要动态创建配置对象 所以我们可以通过调用函数返回对象的方式来动态创建配置对象

const getBarOption = () => {
  let text = DateTime.activeIndex === '1' ? '销售额趋势' : '访问量趋势'
  return {
    title: {
      text,
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      // 当鼠标移动到柱状图时，会浮现出数据
      trigger: 'axis',
      axisPointer: {
        // 当鼠标移动到柱子时显现出来的样式
        type: 'shadow'
      }
    },
    // x轴下标
    xAxis: {
      type: 'category',
      // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      data: DateTime.activeIndex === '1' ? orderFullYearAxis.value : userFullYearAxis.value
    },
    // y轴下标
    yAxis: {
      // y轴坐标线的样式
      splitLine: {
        lineStyle: {
          color: '#eee', //线的颜色
          type: 'dotted' // 点状线
        }
      }
    },
    // 数据设置
    series: [
      {
        // data: [120, 200, 150, 80, 70, 110, 130],
        data: DateTime.activeIndex === '1' ? orderFullYear.value : userFullYear.value,
        barWidth: '35%', //柱状宽度
        type: 'bar',
        showBackground: true,
        backgroundStyle: {
          color: 'rgba(180, 180, 180, 0.2)'
        }
      }
    ],
    // 图表中的网格
    grid: {
      left: 50,
      right: 50,
      bottom: 50,
      top: 50
    }
  }
}
</script>

<style lang="scss" scoped>
// 通过深度选择器选择组件中的dom来修改样式
.search {
  margin-top: 20px;

  :deep(.el-card__header) {
    position: relative;
    border-bottom: none;
    padding: 0 20px;

    .right {
      position: absolute;
      top: 16px;
      right: 20px;
      display: flex;
      align-items: center;
    }
  }

  .content {
    display: flex;
    height: 270px;

    .echarts {
      flex: 5;
    }

    .rank-list {
      flex: 2;

      .title {
        font-size: 14px;
        color: #333;
        font-weight: 500;
        margin-top: 20px;
      }

      //列表数据
      .list {
        margin-top: 15px;

        .list-item {
          display: flex;
          align-items: center;
          height: 20px;
          font-size: 12px;
          margin: 6px 20px 6px 0;
        }

        .no {
          width: 20px;
          height: 20px;
          color: #333;
          display: flex;
          justify-content: center;
          align-items: center;

          &.top-no {
            border-radius: 50%;
            background-color: #333;
            color: #fff;
            font-weight: 300;
          }
        }

        .name {
          margin-left: 10px;
        }

        .count {
          flex: 1;
          text-align: right;
        }
      }
    }
  }
}
</style>