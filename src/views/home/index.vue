<template>
  <div class="home">
    <Monitor></Monitor>
    <Search></Search>
    <Keyword></Keyword>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
import Keyword from './keyword/index.vue'
import Monitor from './monitor/index.vue'
import Search from './search/index.vue'
// import {useReportDataStore} from '@/stores/reportData'
// import {ref,onMounted} from 'vue'

// //获取到状态管理器
// const reportDataStore = useReportDataStore()

// onMounted(()=>{
//   // 当组件挂载时将数据存储到状态管理器中
//   reportDataStore.getGetReportData()  //调用store中的这个方法请求mock数据
// })
import { onMounted } from 'vue'
import { useReportDataStore } from '@/stores/reportData'
const reportDataStore = useReportDataStore()
// 页面挂载完毕就发送请求 获取数据
onMounted(() => {
  // 获取到mock服务器上的数据了
  reportDataStore.getReportData()
})
</script>

<style scoped>
  .home {
    width: 100%;
    height: 100%;
    padding: 20px;
    background-color: #eee;
  }
</style>
