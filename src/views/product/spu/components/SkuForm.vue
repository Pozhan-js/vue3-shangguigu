<template>
  <el-form label-width="100px" :rules="skuRules" :model="skuInfo" ref="skuFormRef">
    <el-form-item label="SPU名称">
      <span>{{ props.currentSpuInfo.spuName }}</span>
    </el-form-item>
    <el-form-item label="SKU名称" prop="skuName">
      <el-input placeholder="SKU名称" v-model="skuInfo.skuName"></el-input>
    </el-form-item>
    <el-form-item label="价格(元)" prop="price">
      <el-input-number class="mx-4" style="width: 100%" :min="1" :max="10" controls-position="right"
        v-model="skuInfo.price" />
    </el-form-item>
    <el-form-item label="重量(千克)" prop="weight">
      <el-input-number style="width: 100%" class="mx-4" :min="1" :max="10" controls-position="right"
        v-model="skuInfo.weight" />
    </el-form-item>
    <el-form-item label="规格描述" prop="skuDesc">
      <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc" />
    </el-form-item>
    <el-form-item label="平台属性" prop="skuAttrValueList">
      <el-row :gutter="20">
        <el-col v-for="(attr, index) in attrList" :key="attr.id" :md="12" :sm="12" :xs="24" :lg="8">
          <el-form-item :label="attr.attrName">
            <el-select v-model="skuInfo.skuAttrValueList[index]" @change="clearAttrRules">
              <el-option v-for="attrValue in attr.attrValueList" :key="attrValue.id"
                :value="`${attr.id}:${attr.attrName}:${attrValue.id}:${attrValue.valueName}`"
                :label="attrValue.valueName" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="销售属性" prop="skuSaleAttrValueList">
      <el-row :gutter="20">
        <el-col :md="12" :sm="12" :xs="24" :lg="8" v-for="(saleAttr, index) in spuSaleAttrList" :key="saleAttr.id">
          <el-form-item :label="saleAttr.saleAttrName">
            <el-select v-model="skuInfo.skuSaleAttrValueList[index]" @change="clearSaleAttrRules">
              <el-option v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :value="`${saleAttr.id}:${saleAttr.saleAttrName}:${saleAttrValue.id}:${saleAttrValue.saleAttrValueName}`"
                :label="saleAttrValue.saleAttrValueName" :key="saleAttrValue.id" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="图片列表" prop="skuImageList">
      <el-table border :data="spuImageList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="60"></el-table-column>
        <el-table-column label="图片">
          <template v-slot="{ row }">
            <el-image style="width: 100px; height: 100px" :alt="row.imgName" :src="row.imgUrl" />
          </template></el-table-column>
        <el-table-column label="名称" prop="imgName"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="primary" v-if="row.isDefault === '0'" @click="setDefaultImage(row)">设置为默认项</el-button>
            <el-button type="success" v-else disabled>默认图片</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="primary" @click="submitForm(skuFormRef)">保存</el-button>
      <el-button @click="emits('changeScene', 1)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
export default {
  name: "SkuForm",
};
</script>

<script lang="ts" setup>
import { reactive, ref, onMounted } from "vue";
import { reqGetSpuImageList, reqGetSpuSaleAttrList } from "@/api/product/spu";
import { reqGetAttrListData } from "@/api/product/attr";
import { useCategoryListStore } from "@/stores/categoryList";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { reqSaveSkuInfo } from "@/api/product/sku";
import type { skuInfoModel } from "@/api/product/model/skuModel";
import type { AttrListModel } from "@/api/product/model/attrModel";
import type { SpuSaleAttrListModel } from "@/api/product/model/spuModel";

const categoryStore = useCategoryListStore();
const props = defineProps(["currentSpuInfo", "xxx", "aaa", "bbb"]);
const emits = defineEmits(["changeScene"]);
// 存储平台选项信息
const skuAttrValueList = ref<string[]>([]);
// 存储销售信息
const skuSaleAttrValueList = ref<string[]>([]);
// 表单真实dom
const skuFormRef = ref<FormInstance>();
// 图片列表
const spuImageList = ref([]);
// spu基础属性列表
const spuSaleAttrList = ref<SpuSaleAttrListModel>([]);
// 平台属性列表
const attrList = ref<AttrListModel>([]);

// 表单要上传的数据
const skuInfo = reactive<skuInfoModel>({
  // spu名称
  skuName: "",
  // 价格
  price: 0,
  // 重量
  weight: 0,
  // 描述
  skuDesc: "",
  // 默认图片
  skuDefaultImg: "",
  // 平台属性
  skuAttrValueList: [],
  // 图片列表
  skuImageList: [],
  // 销售属性列表
  skuSaleAttrValueList: [],
});

// 书写一个图片的自定义校验规则
const skuImageListValidate = (rule: any, value: any, callback: any) => {
  console.log("rule", rule, value, callback);
  if (value.length === 0) {
    callback("请至少选择一张图片...");
    return;
  }
  if (!value.find((item: any) => item.isDefault === "1")) {
    callback("请选择默认图片...");
    return;
  }
  callback(); // 什么参数都不写，表示放行
};
const skuAttrValueListValidate = (rule: any, value: any, callback: any) => {
  // console.log(rule,value)
  if (!value.length) {
    return callback("请选择一个平台属性");
  }
  callback();
};
const skuSaleAttrValueListValidate = (rule: any, value: any, callback: any) => {
  // console.log(rule,value)
  if (!value.length) {
    return callback("请选择一个平台属性");
  }
  callback();
};
// 定义校验规则
const skuRules = reactive<FormRules>({
  skuName: [
    { required: true, message: "请输入sku名称", trigger: "blur" },
    { min: 1, max: 10, message: "长度在1到10之间", trigger: "blur" },
  ],
  price: [{ required: true, message: "请输入sku价格", trigger: "blur" }],
  weight: [{ required: true, message: "请输入sku重量", trigger: "blur" }],
  skuDesc: [{ required: true, message: "请输入sku描述", trigger: "blur" }],
  skuAttrValueList: [
    { required: true, validator: skuAttrValueListValidate, trigger: "change" },
  ],
  // 自定义校验规则
  skuImageList: [{ required: true, validator: skuImageListValidate, trigger: "change" }],
  skuSaleAttrValueList: [
    { required: true, validator: skuSaleAttrValueListValidate, trigger: "change" },
  ],
});

// 3. 收集图片数据
const handleSelectionChange = (val: any) => {
  // val就是我们选择的数据 （表格当前项）
  skuInfo.skuImageList = val;
};

// 设置默认图片
const setDefaultImage = (row: any) => {
  //  排他
  spuImageList.value.forEach((item: any) => {
    item.isDefault = "0";
  });
  row.isDefault = "1";
  // 2.3 将当前默认项收集起来
  skuInfo.skuDefaultImg = row.imgUrl;
};

// 5. 清空平台属性的校验规则
const clearAttrRules = () => {
  skuFormRef.value?.clearValidate(["skuAttrValueList"]);
};

// 6. 清空销售属性的校验规则
const clearSaleAttrRules = () => {
  skuFormRef.value?.clearValidate(["skuSaleAttrValueList"]);
};

//提交按钮事件
const submitForm = async (formEl: FormInstance | undefined) => {
  //先判断是添加还是修改
  //当获取不到表单真实dom时提交事件不触发
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    // 表示校验通过的数据
    if (valid) {
      skuInfo.spuId = props.currentSpuInfo.id;
      skuInfo.category3Id = props.currentSpuInfo.category3Id;
      skuInfo.skuAttrValueList = skuAttrValueList.value.filter(Boolean).map((item) => {
        const [attrId, attrName, valueId, valueName] = item.split(":");
        return {
          attrId,
          attrName,
          valueId,
          valueName,
        };
      });
      skuInfo.skuSaleAttrValueList = skuSaleAttrValueList.value
        .filter(Boolean)
        .map((item) => {
          const [
            saleAttrId,
            saleAttrName,
            saleAttrValueId,
            saleAttrValueName,
          ] = item.split(":");
          return {
            saleAttrId,
            saleAttrName,
            saleAttrValueId,
            saleAttrValueName,
          };
        });
      await reqSaveSkuInfo(skuInfo);
      ElMessage.success("添加sku数据成功...");
      emits("changeScene", 1);
    } else {
      console.log("error submit!", fields);
    }
  });
};

onMounted(async () => {
  // all可以一次性发送多个请求，如果成功，则会将返回值按书写顺序赋值,有一个失败，则最终结果 都是reject 都失败了 整体性比较强
  // allSettled 可以一次性发送多个请求 即使有个别的失败也不会影响整体结果
  // 可以有成功，也可以有失败 响应结果还是按顺序赋值
  const spuId = props.currentSpuInfo.id;
  const [resSpuImageList, resSpuSaleAttrList, resAttrList] = await Promise.allSettled([
    reqGetSpuImageList(spuId),
    reqGetSpuSaleAttrList(spuId),
    reqGetAttrListData({
      category1Id: categoryStore.category1Id as number,
      category2Id: categoryStore.category2Id as number,
      category3Id: categoryStore.category3Id as number,
    }),
  ]);
  console.log("skuForm", resSpuImageList, resSpuSaleAttrList, resAttrList);
  // 先判断再赋值
  if (resSpuImageList?.status === "fulfilled") {
    // 对返回的照片数组的数据进行处理赋予一个默认属性
    spuImageList.value = resSpuImageList.value.map((item: any) => {
      return {
        ...item,
        isDefault: "0", // 0 表示正常显示 1 表示默认项
      };
    });
  }
  if (resSpuSaleAttrList?.status === "fulfilled") {
    spuSaleAttrList.value = resSpuSaleAttrList.value;
    console.log('销售属性', spuSaleAttrList.value);

  }
  if (resAttrList?.status === "fulfilled") {
    attrList.value = resAttrList.value;
  }
});
</script>

<style>

</style>
