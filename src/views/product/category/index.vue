<template>
  <el-card>
    <el-table :data="category1List" style="width: 100%" :row-key="getRowKey" v-loading="loading" border lazy
      :load="load" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column prop="id" label="分类ID" />
      <el-table-column prop="name" label="分类名称" />
      <el-table-column label="操作">
        <template #header>
          <el-input placeholder="按Enter键添加一级分类"></el-input>
        </template>
        <template v-slot="{ row }">
          <el-button type="primary" size="small" :icon="Plus"></el-button>
          <el-button type="primary" size="small" :icon="Edit"></el-button>
          <el-button type="danger" size="small" :icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "Category",
};
</script>
<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { Delete, Edit, Plus, Message, Search } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import {
  reqGetCategory1ListData,
  reqGetCategory2ListData,
  reqGetCategory3ListData,
} from "@/api/product/category";
import type { CategoryListModel, CategoryModel } from "@/api/product/model/categoryModel";

const loading = ref<boolean>(false)
// 表格数据源
const category1List = ref<CategoryListModel>([]);
const category2List = ref<CategoryListModel>([]);
const category3List = ref<CategoryListModel>([]);
// 用于给每一行添加一个唯一的row-key值，防止出现死递归
const getRowKey = (row: CategoryModel) => {
  return `${row.level}-${row.id}`;
};

// 表格懒加载
const load = async (
  row: CategoryModel,
  treeNode: unknown,
  resolve: (date: CategoryListModel) => void
) => {

  if (row.level === 1) {
    // 获取二级列表的数据
    category2List.value = await reqGetCategory2ListData(row.id)

    //给二级列表的数据添加等级和有子节点的字段
    category2List.value.forEach((category) => {
      category.hasChildren = true; //让其能展开
      category.level = 2 //表示这个是以及标题
    })
    // 可以用resolve函数将获取到的等级数据
    resolve(category2List.value)
  } else if (row.level === 2) {
    // 获取二级列表的数据
    category3List.value = await reqGetCategory3ListData(row.id)

    //给二级列表的数据添加等级和有子节点的字段
    category3List.value.forEach((category) => {
      category.hasChildren = false; //让其能展开
      category.level = 3 //表示这个是以及标题
    })
    // 可以用resolve函数将获取到的等级数据
    resolve(category3List.value)
  }
}
//获取表格数据
const reqCategory1ListData = async () => {
  try {
    loading.value = true;
    category1List.value = await reqGetCategory1ListData();
    ElMessage.success('获取表格数据成功')
    // 处理数据
    category1List.value.forEach((category) => {
      category.hasChildren = true; //让其能展开
      category.level = 1  //表示这个是以及标题
    })
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  reqCategory1ListData()
});
</script>

<style lang="less" scoped>

</style>
