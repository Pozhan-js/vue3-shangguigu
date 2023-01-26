<template>
  <div>
    <!-- 当spu不是显示的列表数据时，三级联动下拉框为禁止输入状态  isForbiddenForm-->
    <CategorySelector :isForbiddenForm="scene == 1"></CategorySelector>
    <el-card style="margin-top: 10px">
      <SpuList
        v-if="scene == 1"
        @changeScene="saveScene"
        @getSpuInfo="saveSpuInfo"
      ></SpuList>
      <SpuForm
        v-if="scene == 2"
        @changeScene="saveScene"
        :currentSpuInfo="currentSpuInfo"
      ></SpuForm>
      <SkuForm
        v-if="scene == 3"
        :currentSpuInfo="currentSpuInfo"
        @changeScene="saveScene"
      ></SkuForm>
    </el-card>
  </div>
</template>

<script lang="ts">
export default {
  name: "Spu",
};
</script>
<script lang="ts" setup>
import CategorySelector from "@/components/CategorySelect/index.vue";
import type { SpuInfoModel } from "@/api/product/model/spuModel";
import SpuForm from "./components/SpuForm.vue";
import SpuList from "./components/SpuList.vue";
import SkuForm from "./components/SkuForm.vue";
import { ref } from "vue";
// // const className = ref("SpuList")
// // console.log(SpuList.name);
//控制组件显示
const scene = ref(1);
const currentSpuInfo = ref<SpuInfoModel>();
const saveScene = (val: number) => {
  scene.value = val;
};

const saveSpuInfo = (spuInfo: SpuInfoModel) => {
  currentSpuInfo.value = spuInfo;
};
//指定切换组件的方法
</script>

<style></style>
