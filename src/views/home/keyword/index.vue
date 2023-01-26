<template>
  <div class="bottom-view">
    <el-card shadow="hover" class="view">
      <template #header>
        <div>搜索关键词</div>
      </template>
      <div class="search-view">
        <div class="chart-wrap">
          <div class="chart">
            <div class="title">搜索用户数</div>
            <div class="count">{{ numberFormat(lineChartData.totalUser) }}</div>
            <v-chart :option="getLineOption('userList')"></v-chart>
          </div>
          <div class="chart">
            <div class="title">搜索量</div>
            <div class="count">{{ numberFormat(lineChartData.totalCount) }}</div>
            <v-chart :option="getLineOption('countList')"></v-chart>
          </div>
        </div>
        <div class="search-table">
          <el-table :data="tableData">
            <el-table-column label="排名" prop="rankNo"></el-table-column>
            <el-table-column label="关键字" prop="word"></el-table-column>
            <el-table-column label="搜索数量" prop="count"></el-table-column>
            <el-table-column label="搜索用户数" prop="user"></el-table-column>
            <el-table-column label="搜索占比数" prop="range"></el-table-column>
          </el-table>
          <el-pagination layout="prev, pager, next" :total="tableTotalData?.length" v-model:currentPage="currentPage"
            v-model:page-size="pageSize" />
        </div>
      </div>
    </el-card>
    <el-card shadow="hover" class="view">
      <template #header>
        <div>分类销售排行</div>
        <el-radio-group v-model="radioSelect" size="small">
          <el-radio-button label="品类" />
          <el-radio-button label="商品" />
        </el-radio-group>
      </template>
      <div class="search-view">
        <v-chart :option="getPieOption()" autoresize></v-chart>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useReportDataStore } from '@/stores/reportData'
import useFormat from '@/hooks/useFormat'
import Item from '@/layout/components/Sidebar/Item';
const reportDataStore = useReportDataStore()
const { numberFormat, moneyFormat } = useFormat()
// 分页器数据
const currentPage = ref(1)
const pageSize = ref(5)

// 改变选项组
const radioSelect = ref('品类')
//先分别获取关键字和饼状图的数据
// 获取关键字搜索
const searchWord = computed(() => reportDataStore.reportData.searchWord)
// 获取分类销售排行 （饼状图数据）
const saleRank = computed(() => reportDataStore.reportData.saleRank)

// 获取表格需要的数据  （因为请求来的数据还缺少一些需要计算才能得出的属性）
const tableTotalData = computed(() => {
  // 当没有请求到表格需要的数据时，返回一个空数组
  if (!searchWord) return []
  return searchWord.value?.map((item, index) => {
    return {
      ...item,
      rankNo: index + 1,  //列表中的排序
      range: ((item.user / item.count) * 100).toFixed(2) + '%'  //保留小数点后两位小数  列表中的百分比
    }
  })
})

// 计算得到折线图的数据
const lineChartData = computed(() => {
  const lineData = {
    wordList: [] as string[], // 水平轴需要的数据
    userList: [] as number[], // 搜索用户数的Y轴使用的数据
    countList: [] as number[], // 搜索量图形Y轴要使用的数据
    totalUser: 0, // 总的搜索用户数
    totalCount: 0 //
  }

  if (tableTotalData.value && tableTotalData.value.length > 0) {
    tableTotalData.value.forEach((item) => {
      lineData.wordList.push(item.word)
      lineData.userList.push(item.user)
      lineData.countList.push(item.count)
      lineData.totalUser += item.user //计算得到总用户数
      lineData.totalCount += item.count //计算得到总搜索量
    })
  }

  return lineData
})


// 为了给表格数据分页分表、
const tableData = computed(() => {
  return tableTotalData.value?.slice((currentPage.value - 1) * pageSize.value, currentPage.value * pageSize.value)
})

// 开始获取折线图数据  通过我们计算我们的两个折线图数据是 userList 和 countList
const getLineOption = (listName: 'userList' | 'countList') => {
  return {
    xAxis: {
      boundaryGap: false, // 去掉两边留白
      data: lineChartData.value.wordList  //x轴的数据
    },
    yAxis: {
      show: false
    },
    series: {
      type: 'line',
      data: lineChartData.value[listName],
      smooth: true,
      areaStyle: {
        color: '#c7e7e7'
      },
      // 折点 就是小圆圈
      itemStyle: {
        opacity: 0
      },
      lineStyle: {
        color: '#5FBBFF'
      }
    },
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  }
}

// ======================================================
// 饼状图图表
const getPieOption = () => {
  const list = radioSelect.value === '品类' ? pieChartData.value.categoryList : pieChartData.value.goodsList
  const total = radioSelect.value === '品类' ? pieChartData.value.cTotal : pieChartData.value.gTotal
  return {
    title: [
      {
        text: `${radioSelect.value}分布`,
        textStyle: {
          color: '#666',
          fontSize: 14
        },
        left: 20, //离左 20px
        top: 20
      },
      {
        text: '累计订单量',
        subtext: total,
        textStyle: {
          fontSize: 14,
          color: '#999'
        },
        subtextStyle: {
          fontSize: 28,
          color: '#333'
        },
        left: '34.5%',
        top: '42.5%',
        textAlign: 'center'
      }
    ],
    // 鼠标移入时显示的效果
    tooltip: {
      //显示饼状图数据
      trigger: 'item',
      //鼠标移入数据项 (提示浮层)
      formatter: (params: any) => {
        // 返回HTML元素
        return `${radioSelect.value}分布<br/>
                ${params.marker + params.data.labelName}<br/>
                ${params.marker + '数量: ' + params.data.value}<br/>
                ${params.marker + '占比: ' + params.data.percent}<br/>
        `
      }

    },
    legend: {
      left: '68%',
      top: 'middle',
      orient: 'horizontal', //选项表的排列方式
      textStyle: {
        color: '#8c8c8c'
      }
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['35%', '50%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {  //该属性是设置描边线的
          // borderRadius: 10,  //控制饼状图圆角属性
          borderColor: '#fff',  //描边线颜色
          borderWidth: 2  //描边线宽度
        },
        label: {
          // show: false,
          // position: 'center'
          // 设置引导线 在圆圈外层
          position: 'outside',
          // 指定标题
          formatter: (params: any) => {
            return params.data.labelName
          }
        },
        // 引导线样式
        labelLine: {
          length: 7,
          length2: 5
        },
        data: list
      }
    ]
  }
}

//将数据处理成所需格式
const pieChartData = computed(() => {
  const pieData = {
    categoryList: [] as any[], // 品类
    goodsList: [] as any[], // 商品
    cTotal: 0, // 分类的数量
    gTotal: 0 // 商品的数量
  }

  // 开始处理数据、
  // 判断是否请求回来数据了
  if (!saleRank.value) return {} as any  //返回一个any属性的对象
  // 通过解构赋值活的商品和分类的数据
  const { category: { axisX, data1 }, goods: { axisX: axisX2, data1: data2 } } = saleRank.value
  // 品类总数
  const total1 = data1.reduce((prev, count) => prev + count, 0)  //将所有数据相加
  pieData.cTotal = total1
  const total2 = data2.reduce((prev, count) => prev + count, 0) //
  pieData.gTotal = total2

  //得到要显示的数据
  axisX.forEach((item, index) => {
    const percent = ((data1[index] / total1) * 100).toFixed(2) + '%'
    pieData.categoryList.push({
      name: item + ' | ' + percent,  //组合形成的名字
      value: data1[index],
      percent, //百分比
      labelName: item   //分类名
    })
  })


  // 商品要显示的数据
  axisX2.forEach((item, index) => {
    const percent = ((data2[index] / total2) * 100).toFixed(2) + '%'
    pieData.goodsList.push({
      name: item + ' | ' + percent,  //组合形成的名字
      value: data2[index],
      percent, //百分比
      labelName: item   //分类名
    })
  })

  return pieData
})

</script>

<style lang="scss" scoped>
.bottom-view {
  display: flex;
  margin-top: 20px;

  .view {
    flex: 1;

    &:first-child {
      margin-right: 10px;
    }

    &:last-child {
      margin-left: 10px;
    }

    :deep(.el-card__header) {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 60px;
    }

    .search-view {
      height: 450px;
      display: flex;
      flex-direction: column;

      .chart-wrap {
        display: flex;

        .chart {
          flex: 1;

          &:first-child {
            margin-right: 5px;
          }

          &:last-child {
            margin-left: 5px;
          }

          .title {
            font-size: 14px;
            color: #999;
          }

          .count {
            font-size: 22px;
            color: #333;
            font-weight: 500;
            letter-spacing: 2px;
          }

          .echarts {
            height: 50px;
          }
        }
      }

      .search-table {
        flex: 1;
        margin-top: 20px;

        .el-pagination {
          text-align: right;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>