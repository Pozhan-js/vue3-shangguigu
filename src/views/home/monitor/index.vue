<template>
  <el-row :gutter="10" class="monitor">
    <el-col :span="6">
      <TodaySales></TodaySales>
    </el-col>
    <el-col :span="6">
      <TodayOrders></TodayOrders>
    </el-col>
    <el-col :span="6">
      <TodayUsers></TodayUsers>
    </el-col>
    <el-col :span="6">
      <TotalUsers></TotalUsers>
    </el-col>
  </el-row>
</template>
<script lang="ts">
import TodaySales from './components/TodaySales.vue'
import TodayOrders from './components/TodayOrders.vue'
import TodayUsers from './components/TodayUsers.vue'
import TotalUsers from './components/TotalUsers.vue'
export default {
  name: 'Monitor',
  components: {
    TodaySales,
    TodayOrders,
    TodayUsers,
    TotalUsers
  }
}
</script>

<style lang="scss">
.monitor {
  .emphasis {
    color: #333;
    font-weight: 600;
    margin:0 5px;
  }
  .increment {
    width: 0;
    height: 0;
    border-width: 4px;
    border-color: transparent transparent green transparent;
    border-style: solid;
  }
  .decrement {
    width: 0;
    height: 0;
    border-width: 4px;
    border-color: red transparent transparent transparent;
    border-style: solid;
  }
}
</style>