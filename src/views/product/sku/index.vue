<template>
  <el-card>
    <el-table border :data="skuList">
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="80px"
      ></el-table-column>
      <el-table-column label="名称" prop="skuName"></el-table-column>
      <el-table-column label="描述" prop="skuDesc"></el-table-column>
      <el-table-column label="默认图片">
        <template v-slot="{ row }">
          <el-image
            :src="row.skuDefaultImg"
            style="width: 100px; height: 100px"
          ></el-image> </template
      ></el-table-column>
      <el-table-column label="重量(KG)" prop="weight"></el-table-column>
      <el-table-column label="价格(元)" prop="price"></el-table-column>
      <el-table-column label="操作" width="280px">
        <template v-slot="{ row, $index }">
          <el-tooltip content="上架" placement="top" v-if="row.isSale === 0">
            <el-button
              type="success"
              :icon="Top"
              @click="onlineSku(row)"
              size="small"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="下架" placement="top" v-else>
            <el-button
              type="danger"
              :icon="Bottom"
              @click="downLineSku(row)"
              size="small"
            ></el-button>
          </el-tooltip>
          <el-tooltip content="修改SKU" placement="top">
            <el-button type="primary" :icon="Edit" size="small"></el-button>
          </el-tooltip>
          <el-tooltip content="查看详情" placement="top">
            <el-button type="info" :icon="InfoFilled" @click="getSkuInfo(row.id)" size="small"></el-button>
          </el-tooltip>
          <el-tooltip content="删除SKU" placement="top">
            <el-button
              type="danger"
              @click="deleteCountSku(row)"
              :icon="Delete"
              size="small"
            ></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页的内容 -->
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :pager-count="7"
      :page-sizes="[3, 5, 8, 10, 15]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,total, sizes"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer
    v-model="drawer"
    title="查看Sku详情"
    size="40%"
    :direction="direction"
  >
  <el-row :gutter="10" style="margin-bottom: 10px;">
    <el-col :span="7">
      <div>名称</div>
    </el-col>
    <el-col :span="17">
      <div>{{ skuDrawerInfo.skuName }}</div>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin-bottom: 10px;">
    <el-col :span="7">
      <div>描述</div>
    </el-col>
    <el-col :span="17">
      <div>{{ skuDrawerInfo.skuDesc }}</div>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin-bottom: 10px;">
    <el-col :span="7">
      <div>价格</div>
    </el-col>
    <el-col :span="17">
      <div>{{ skuDrawerInfo.price + '/元' }}</div>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin-bottom: 10px;">
    <el-col :span="7">
      <div>平台属性</div>
    </el-col>
    <el-col :span="17">
      <el-tag v-for="attrValue in skuDrawerInfo.skuAttrValueList" :key="attrValue.id">{{ attrValue.valueName }}</el-tag>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin-bottom: 10px;">
    <el-col :span="7">
      <div>销售属性</div>
    </el-col>
    <el-col :span="17">
      <el-tag v-for="saleValue in skuDrawerInfo.skuSaleAttrValueList" :key="saleValue.id">{{ saleValue.saleAttrName }}</el-tag>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin-bottom: 10px;">
    <el-col :span="7">
      <div>商品图片</div>
    </el-col>
    <el-col :span="17">
      <el-carousel height="150px">
      <el-carousel-item v-for="image in skuDrawerInfo.skuImageList" :key="image.id">
        <el-image style="width: 100px; height: 100px" :src="image.imgUrl"></el-image>
      </el-carousel-item>
    </el-carousel>
    </el-col>
  </el-row>
  </el-drawer>
  </el-card>
</template>
<script lang="ts">
export default {
  name: "Sku",
};
</script>
<script lang="ts" setup>
import { Top, Edit, Delete, InfoFilled, Bottom } from "@element-plus/icons-vue";
import {
  reqGetAllSkuListData,
  reqSkuOnSale,
  reqSkuCancelSale,
  reqDeleteSkuInfo,
  reqGetOneSkuInfo
} from "@/api/product/sku";
import type { skuInfoModel } from "@/api/product/model/skuModel";
import type { skuInfo} from './model/skuInfoModel'
import { ElMessage } from "element-plus";
import { ref, onMounted } from "vue";
// 分页器相关变量与函数
const page = ref<number>(1);
const limit = ref<number>(3);
const total = ref<number>(0);
const skuList = ref([]);
// 定义一个skuInfo对象 用来渲染抽屉中的效果
const skuDrawerInfo = ref({});

// 抽屉变量
const drawer = ref<boolean>(false)
const direction = ref<string>('rtl')

const handleSizeChange = (val: number) => {
  limit.value = val;
  page.value = 1;
  // 发送请求
  getSkuList();
};
const handleCurrentChange = (val: number) => {
  page.value = val;
  // 发送请求
  getSkuList();
};
//获取列表数据
const getSkuList = async () => {
  const skuListData = await reqGetAllSkuListData(page.value, limit.value);
  total.value = skuListData?.total;
  skuList.value = skuListData?.records;
};
// 上线
const onlineSku = async (row: skuInfo) => {
  await reqSkuOnSale(row.id);
  row.isSale = 1;
  ElMessage.success("商品上线成功");
};
// 下线
const downLineSku = async (row: skuInfo) => {
  await reqSkuCancelSale(row.id);
  row.isSale = 0;
  ElMessage.success("商品下线成功");
};

//删除sku列表数据
const deleteCountSku = async (row: skuInfo) => {
  await reqDeleteSkuInfo(row.id);
  getSkuList();
  ElMessage.success("商品删除成功");
};

// 获取抽屉效果
const getSkuInfo = async(id:number)=>{
  // 发送请求获取抽屉信息
  const oneSaleData = await reqGetOneSkuInfo(id)
  // console.log('抽屉效果',oneSaleData);
  skuDrawerInfo.value = oneSaleData
  // 显示抽屉效果
  drawer.value = true
}

onMounted(() => {
  // 当组件挂在时记载列表所需数据
  getSkuList();
});
</script>

<style lang="less" scoped></style>
