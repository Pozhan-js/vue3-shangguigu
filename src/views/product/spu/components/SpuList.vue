<template>
  <div>
    <el-button
      :disabled="!categoryStore.category3Id"
      :icon="Plus"
      type="primary"
      @click="toAddSpuInfo"
      >添加SPU</el-button
    >
    <el-table border :data="spuList" style="margin: 20px 0">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column label="SPU名称" prop="spuName"></el-table-column>
      <el-table-column label="SPU描述" prop="description"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button
            size="small"
            title="添加SKU"
            type="primary"
            :icon="Plus"
            @click="toAddSkuInfo(row)"
          ></el-button>
          <el-button
            size="small"
            title="修改SPU"
            type="warning"
            :icon="Edit"
            @click="toEditSpuInfo(row)"
          ></el-button>
          <el-button
            size="small"
            title="查看SKU列表"
            type="info"
            :icon="InfoFilled"
            @click="toCheckSkuList(row.id)"
          ></el-button>
          <el-popconfirm
            confirm-button-text="确认"
            cancel-button-text="取消"
            :icon="InfoFilled"
            icon-color="orange"
            title="确定要删除此属性值吗?"
            @confirm="deleteSpuInfo(row.id)"
          >
            <template #reference>
              <el-button title="删除" size="small" type="danger" :icon="Delete" />
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!--分页器-->
    <el-pagination
      v-model:currentPage="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[3, 6, 9, 12]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout=" prev, pager, next, jumper,->, sizes,total"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <!-- 弹出框列表 -->
    <el-dialog v-model="dialogSkuTableVisible" title="查看Sku数据列表">
      <el-table :data="skuList" v-loading="loading">
        <el-table-column label="名称" prop="skuName" />
        <el-table-column label="价格(元)" prop="price" />
        <el-table-column label="重量(KG)" prop="weight" />
        <el-table-column label="默认图片">
          <template v-slot="{ row }">
            <el-image
              :src="row.skuDefaultImg"
              style="width: 100px; height: 100px"
            ></el-image>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export default {
  name: "SpuList",
};
</script>
<script lang="ts" setup>
// 引入接口函数
import { reqDeleteSpuInfo, reqGetSpuListData } from "@/api/product/spu";
import { reqGetSkuListData } from "@/api/product/sku";
import { useCategoryListStore } from "@/stores/categoryList";
import { ref, watch } from "vue";
import { ElMessage } from "element-plus";
import { Plus, Edit, Delete, InfoFilled } from "@element-plus/icons-vue";
import type { SpuInfoModel } from "@/api/product/model/spuModel";
const emits = defineEmits(["changeScene", "getSpuInfo"]); // 接收自定义事件

const small = ref(false); //控制按钮大小
const background = ref(false);
const disabled = ref(false); //禁止属性
const categoryStore = useCategoryListStore(); //store对象
// 分页相关的变量
const currentPage = ref<number>(1); //当前页
const pageSize = ref<number>(3); //页面数据大小
const total = ref<number>(1); //总数
const spuList = ref([]); //列表数据

const skuList = ref([]);
const dialogSkuTableVisible = ref(false);
const loading = ref(false);

//请求获取数据列表和数据总数
const getSpuListData = async () => {
  const result = await reqGetSpuListData(
    currentPage.value,
    pageSize.value,
    categoryStore.category3Id as number
  );
  //  获取总数和数据数组
  total.value = result?.total;
  spuList.value = result?.records;
  ElMessage.success("获取数据成功");
};

//检测三级下拉框id是否变化
watch(
  () => categoryStore.category3Id,
  async (category3Id) => {
    if (!category3Id) {
      //如果是没有发生变化,就直接返回
      return;
    }
    //  发送请求 只要检测到3id发生变化就发送请求获取最新数据
    getSpuListData();
  },
  { immediate: true }
);

//当分页器发生改变时重新发送请求
const handleSizeChange = (val: number) => {
  //  改变每页多少条
  pageSize.value = val;
  //  默认当前页为1
  currentPage.value = 1;
  //  重新发送请求
  getSpuListData();
};

const handleCurrentChange = async (val: number) => {
  //  改变当前页面数
  currentPage.value = val;
  //  默认每页为5
  // pageSize.value = 5;
  //  重新发送请求
  await getSpuListData();
};
// 5. 删除spuInfo
const deleteSpuInfo = async (id: number) => {
  await reqDeleteSpuInfo(id);
  // 重新渲染一下剩余数据
  getSpuListData();
  // 提示一下用户  删除成功
  ElMessage.success("删除SPU成功");
};

// 6. 编辑SpuInfo 之数据回显
const toEditSpuInfo = (row: SpuInfoModel) => {
  // 跳转到SpuForm.vue页面
  emits("changeScene", 2);
  // 将当前待编辑的数据传递给父组件index.vue
  // console.log('rrow',row)
  // emits('getSpuInfo',row)
  emits("getSpuInfo", {
    ...row,
    spuImageList: [], // 把缺少的两项，手动补上
    spuSaleAttrList: [],
  });
};

// 显示添加spu
// 7. 去添加spuInfo
const toAddSpuInfo = () => {
  // 跳转到spuForm.vue页面
  emits("changeScene", 2);

  // 清空原来的旧数据
  emits("getSpuInfo", {});
};
// 8. 去添加SkuInfo
const toAddSkuInfo = (row: SpuInfoModel) => {
  // 实现页面的切换
  emits("changeScene", 3);

  // 实现数据传递
  emits("getSpuInfo", row);
};
// 9. 查看skuList
const toCheckSkuList = async (id: number) => {
  dialogSkuTableVisible.value = true;
  try {
    loading.value = true;
    // 发送请求获取弹窗信息
    skuList.value = await reqGetSkuListData(id);
  } finally {
    // 去掉loading
    loading.value = false;
  }
};
</script>

<style scoped></style>
