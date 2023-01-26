<template>
  <el-card class="box-card">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级分类">
        <el-select v-model="category1Id" :disabled="!isForbiddenForm" placeholder="请选择">
          <el-option :label="c1.name" v-for="c1 in categoryStore.category1List" :key="c1.id" :value="c1.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="category2Id" placeholder="请选择">
          <el-option :label="c2.name" v-for="c2 in categoryStore.category2List" :key="c2.id" :value="c2.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="category3Id" placeholder="请选择">
          <el-option :label="c3.name" v-for="c3 in categoryStore.category3List" :key="c3.id" :value="c3.id" />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "CategorySelector",
  props: {
    // 设置默认类型
    isForbiddenForm: {
      type: Boolean,
    }
  }
};
</script>
<script lang="ts" setup>
import { reactive, onMounted, computed, ref } from "vue";
import {
  reqGetCategory1ListData,
  reqGetCategory2ListData,
  reqGetCategory3ListData,
} from "@/api/product/category";
// 引入categoryListStore数据过来
import { useCategoryListStore } from "@/stores/categoryList";
// const props = defineProps(["isForbiddenForm"]);

const isShowAttrList = ref<boolean>(true)

// 创建store对象实列
const categoryStore = useCategoryListStore();

// 1. 页面挂载完成之后要发送请求获取一级导航数据
onMounted(() => {
  categoryStore.getCategory1ListData();
});

// 计算属性检测1Id变化
const category1Id = computed({
  get() {
    return categoryStore.category1Id as number;
  },
  set(val: number) {
    //去获取二级下拉框数据
    categoryStore.getCategory2ListData(val);
  },
});

//计算属性检测2Id变化
const category2Id = computed({
  get() {
    return categoryStore.category2Id as number;
  },
  set(val: number) {
    categoryStore.getCategory3ListData(val);
  },
});
//  计算属性检测3Id变化
const category3Id = computed({
  get() {
    return categoryStore.category3Id as number;
  },
  set(val: number) {
    categoryStore.setCategory3Id(val);
  },
});
</script>

<style>

</style>
