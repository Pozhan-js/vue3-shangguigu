<template>
  <el-card class="common-card">
    <div class="card-title">{{title}}</div>
    <div class="card-value">{{value}}</div>
    <div class="card-chart">
      <slot></slot> <!--  默认插槽 -->
    </div>
    <div class="card-line"></div>
    <div class="card-footer">
      <slot name="footer"></slot>
    </div>
  </el-card>
</template>

<script lang="ts">
export default {
  name: 'CommonCard',
  props: {
    title: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  }
}
</script>

<script lang="ts" setup>
</script>

<style lang="scss" scoped>
.common-card {
  .card-title {
    font-size: 12px;
    color: #999;
  }
  .card-value {
    font-size: 25px;
    margin: 5px 0;
    letter-spacing: 1px;
  }
  .card-chart {
    // 在响应式的布局当中，高度可以设置固定值
    height: 50px;
  }
  .card-line {
    border: 1px solid #eee;
    margin: 10px 0;
  }
  .card-footer {
    font-size: 12px;
    color: #666;
  }
}
</style>