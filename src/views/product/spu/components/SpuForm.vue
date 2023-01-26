<template>
  <el-form label-width="100px" :model="spuInfo" :rules="spuRules" ref="spuFormRef">
    <el-form-item label="SPU名称" prop="spuName">
      <el-input v-model="spuInfo.spuName" placeholder="SPU名称"></el-input>
    </el-form-item>
    <el-form-item label="品牌" prop="tmId">
      <el-select v-model="spuInfo.tmId" placeholder="请选择品牌">
        <el-option
          v-for="trademark in trademarkList"
          :key="trademark.id"
          :label="trademark.tmName"
          :value="(trademark.id as number)"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述" prop="description">
      <el-input v-model="spuInfo.description" type="textarea" :rows="3"></el-input>
    </el-form-item>
    <!-- action="/app-dev/admin/product/fileUpload" -->
    <el-form-item label="SPU图片" prop="spuImageList">
      <el-upload
        v-model:file-list="spuInfo.spuImageList"
        :action="`${BASE_URL}/admin/product/upload`"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible" width="340px">
        <img w-full class="spu-img" :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="销售属性" prop="spuSaleAttrList">
      <el-select
        v-model="spuInfo.spuSaleAttr"
        :placeholder="`还有${filterBaseSaleAttrList?.length}个待选择`"
      >
        <el-option
          v-for="baseSaleAttr in filterBaseSaleAttrList"
          :key="baseSaleAttr.id"
          :label="baseSaleAttr.name"
          :value="baseSaleAttr.name"
        />
      </el-select>
      <el-button :disabled="!spuInfo.spuSaleAttr" type="primary" @click="addSpuSaleAttr"
        >添加销售属性</el-button
      >
    </el-form-item>
    <el-form-item>
      <el-table :data="spuInfo.spuSaleAttrList" style="margin-top: 10px" border>
        <el-table-column
          label="序号"
          width="100px"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="属性名"
          prop="saleAttrName"
          align="center"
          width="100px"
        ></el-table-column>
        <el-table-column label="属性值名称列表">
          <template v-slot="{ row }">
            <!--  -->
            <el-tag
              v-for="tag in row.spuSaleAttrValueList"
              :key="tag"
              class="mx-1"
              closable
              :disable-transitions="false"
              @close="handleClose(row, tag)"
            >
              {{ tag.saleAttrValueName }}
            </el-tag>
            <!--   -->
            <el-input
              v-if="row.inputVisible"
              ref="InputRef"
              v-model="inputValue"
              class="ml-1 w-20"
              style="width: 100px"
              size="small"
              @keyup.enter="handleInputConfirm(row)"
              @blur="handleInputConfirm(row)"
            />
            <!--  -->
            <el-button
              v-else
              class="button-new-tag ml-1"
              size="small"
              @click="showInput(row)"
            >
              + New
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ $index }">
            <el-popconfirm
              confirm-button-text="确认"
              cancel-button-text="取消"
              :icon="InfoFilled"
              icon-color="orange"
              title="确定要删除此属性吗?"
              @confirm="deleteAttr($index)"
            >
              <template #reference>
                <el-button title="删除" size="small" type="danger" :icon="Delete" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitSpuForm(spuFormRef)">保存</el-button>
      <el-button @click="emits('changeScene', 1)">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script lang="ts">
export default {
  name: "SpuForm",
};
</script>
<script lang="ts" setup>
import { ref, reactive, onMounted, computed, nextTick } from "vue";
import { ElMessage, ElInput } from "element-plus";
import { useCategoryListStore } from "@/stores/categoryList";
import { Plus, Delete, InfoFilled } from "@element-plus/icons-vue";
import {
  reqGetAllTrademarkList,
  reqGetBaseSaleAttrList,
  reqGetSpuImageList,
  reqGetSpuSaleAttrList,
  reqSaveSpuInfo,
  reqUpdateSpuInfo,
} from "@/api/product/spu";
import type {
  BaseSaleAttrListModel,
  BaseSaleAttrModel,
  SpuInfoModel,
  SpuSaleAttrListModel,
  SpuSaleAttrModel,
} from "@/api/product/model/spuModel";
import type { TrademarkListModel } from "@/api/product/model/trademarkModel";
import type {
  UploadProps,
  UploadUserFile,
  FormInstance,
  FormRules,
  UploadFile,
  UploadFiles,
} from "element-plus";

const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const InputRef = ref<InstanceType<typeof ElInput>>();
const props = defineProps(["currentSpuInfo"]);
const emits = defineEmits(["changeScene"]);

// 获取pinia中的数据
const categoryStore = useCategoryListStore();
const spuFormRef = ref<FormInstance>();

//添加属性按钮的输入框
const inputValue = ref<string>("");
// 全局环境变量
const BASE_URL = import.meta.env.VITE_API_URL;
// 定义一个存储spu相关数据的变量
const spuInfo = reactive<SpuInfoModel>({
  spuName: "", // spu的名称
  tmId: "", // spu品牌
  description: "", // spu描述
  spuImageList: [], // 存储spu图片的数组
  spuSaleAttrList: [], // 基本销售属性
  spuSaleAttr: "", // 收集选中的属性 颜色 版本  尺寸
  category3Id: 0, // 三级id
  ...props.currentSpuInfo,
});

//准备数组接收请求回来的数据
let trademarkList = ref<TrademarkListModel>([]); //商品属性
let baseSaleAttrList = ref<BaseSaleAttrListModel>([]); //销售属性

// 添加校验规则
const spuRules = reactive<FormRules>({
  spuName: [
    { required: true, message: "请输入SPU名称", trigger: "blur" },
    { min: 1, max: 10, message: "SPU名称在1-10个字符之间", trigger: "blur" },
  ],
  tmId: [{ required: true, message: "请选择SPU品牌", trigger: "change" }],
  description: [{ required: true, message: "请输入SPU描述", trigger: "blur" }],
  spuImageList: [
    {
      required: true,
      message: "请选择一张图片",
      type: "array",
      trigger: "change",
    },
  ],
  spuSaleAttrList: [
    {
      required: true,
      message: "请至少添加一个属性",
      type: "array",
      trigger: "click",
    },
  ],
});
const formSize = ref("default");

//缩略图上传相关的事件处理程序
//删除图片要执行的钩子函数
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  // console.log("缩略图数据", uploadFile, uploadFiles);
};
// //预览图片的狗子函数
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};
// // 2. 上传成功后的操作
const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response: any,
  uploadFile: UploadFile,
  uploadFiles: UploadFiles
) => {
  spuInfo.spuImageList = uploadFiles;
  // 清空校验规则
  spuFormRef.value!.clearValidate(["spuImageList"]);
};
// //3.上传照片之前的狗子函数
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const imgTypes = ["image/jpeg", "image/jpg", "image/png", "image/jfif"];
  if (!imgTypes.includes(rawFile.type)) {
    ElMessage.error("Avatar picture must be JPG format!");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("Avatar picture size can not exceed 2MB!");
    return false;
  }
  return true;
};
// 4. 添加销售属性值
const addSpuSaleAttr = () => {
  // 6.1 添加属性之间要做个判断 如果有某个属性没有属性值的话，是不能添加新属性的
  const spuSaleAttrList = spuInfo.spuSaleAttrList;
  if (
    spuSaleAttrList.length &&
    spuSaleAttrList.some((item: any) => item.spuSaleAttrValueList.length == 0)
  ) {
    ElMessage.error("属性值不能为空,请添加...");
    return; // 不要向下执行  也就是不要添加新的属性
  }

  const id = (baseSaleAttrList.value.find(
    (item) => item.name == spuInfo.spuSaleAttr
  ) as BaseSaleAttrModel).id;

  // 6.2 添加新的属性
  spuInfo.spuSaleAttrList.push({
    baseSaleAttrId: id,
    inputVisible: false, // 给当前行对象添加一个属性，用于控制按钮和输入框的显示
    saleAttrName: spuInfo.spuSaleAttr as string, // 属性名 颜色 版本  尺寸
    spuSaleAttrValueList: [], // 当前属性名对应的那些详细的属性值
  });

  // 清空一下下拉框
  spuInfo.spuSaleAttr = "";
};

// 5. 删除属性列表
const deleteAttr = (index: number) => {
  spuInfo.spuSaleAttrList.splice(index, 1);
};

// 6. 计算销售属性
const filterBaseSaleAttrList = computed(() => {
  return baseSaleAttrList.value?.filter((item: any) => {
    return !spuInfo.spuSaleAttrList?.find((data: any) => item.name === data.saleAttrName);
  });
});

// 7.让输入框显示的事件
const showInput = (row: SpuSaleAttrModel) => {
  row.inputVisible = true;
  nextTick(() => {
    InputRef.value!.input!.focus();
  });
};

// 8.输入框显示时监视事件
const handleInputConfirm = (row: SpuSaleAttrModel) => {
  if (inputValue.value) {
    // 如果当前需要添加的属性值已经存在了，则不能再添加 需要提示
    const spuSaleAttrValueList = row.spuSaleAttrValueList;
    if (
      spuSaleAttrValueList.length &&
      spuSaleAttrValueList.find((item) => item.saleAttrValueName === inputValue.value)
    ) {
      ElMessage.error("属性值不能重复,请更换一个");
      row.inputVisible = false;
      inputValue.value = "";
      return; // 不要向下执行了 也就是不要再添加属性了
    }
    const id = (baseSaleAttrList.value.find(
      (item) => item.name === row.saleAttrName
    ) as BaseSaleAttrModel).id;
    // dynamicTags.value.push(inputValue.value)
    row.spuSaleAttrValueList.push({
      baseSaleAttrId: id,
      saleAttrName: row.saleAttrName, // 当前属性名称 比如 颜色 版本 尺寸
      saleAttrValueName: inputValue.value, // 具体的属性值
    });
  }
  // inputVisible.value = false
  row.inputVisible = false;
  inputValue.value = "";
};

//9.标签删除事件
const handleClose = (row: SpuSaleAttrModel, tag: any) => {
  // 查找tag所在数组中的索引值
  let index = row.spuSaleAttrValueList.indexOf(tag);
  row.spuSaleAttrValueList.splice(index, 1);
};

// 10.提交表单信息
const submitSpuForm = async (formEl: FormInstance | undefined) => {
  // 如果没有添加表单信息就结束函数
  if (!formEl) return;
  // 在提交表单信息时要校验一下是修改是还添加spu
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // 将销售属性赋值给变量，检测销售属性是否有被存到列表中
      const spuSaleAttrList = spuInfo.spuSaleAttrList;
      // 这里是检测当销售属性列表虽然有基础属性但是没有对应销售属性的tag属性时不能提交
      if (
        spuSaleAttrList.length &&
        !spuSaleAttrList.every((item) => item.spuSaleAttrValueList.length)
      ) {
        ElMessage.error("tag属性为空不能进行提交");
        return;
      }

      // 准备要上传的照片的数据
      spuInfo.spuImageList = spuInfo.spuImageList.map((item) => {
        return {
          imgUrl: item.response?.data || item.url,
          imgName: item.name,
        };
      });

      // 获取下拉框的3id
      spuInfo.category3Id = categoryStore.category3Id;
      // 发送请求 判断是否有id 如果有id 就表示是修改操作
      if (spuInfo.id) {
        // 此时是更新操作
        await reqUpdateSpuInfo(spuInfo);
        ElMessage.success("修改Spu成功");
      } else {
        // 才是真正的添加spuInfo
        await reqSaveSpuInfo(spuInfo);
        ElMessage.success("添加Spu成功");
      }
      // 跳转到列表页
      emits("changeScene", 1);
    } else {
      // console.log('error submit!', fields)
      ElMessage.error("提交失败...");
    }
  });
};

//但组件挂载时 发送请求获取 商品列表和 属性列表 如果是修改操作会触发其余请求
onMounted(async () => {
  try {
    const id = spuInfo.id;
    let promises = [reqGetAllTrademarkList(), reqGetBaseSaleAttrList()];
    if (id) {
      // 如果有id，此时说明是编辑操作
      promises = promises.concat([reqGetSpuImageList(id), reqGetSpuSaleAttrList(id)]);
    }
    const [
      responseTrademarkList,
      responseBaseSaleAttrList,
      responseSpuImageList,
      responseSpuSaleAttrList,
    ] = await Promise.all(promises);
    ElMessage.success("SpuForm页面获取数据成功");
    // console.log(responseTrademarkList, responseBaseSaleAttrList);
    trademarkList.value = responseTrademarkList;
    baseSaleAttrList.value = responseBaseSaleAttrList;
    if (responseSpuImageList && responseSpuSaleAttrList) {
      //改造请求回来的图片数据
      spuInfo.spuImageList = responseSpuImageList.map((item: any) => {
        return {
          ...item,
          name: item.imgName,
          url: item.imgUrl,
        };
      });
      spuInfo.spuSaleAttrList = responseSpuSaleAttrList;
    }
  } catch (e) {
    ElMessage.error(`${e}`);
  }
});
</script>
<style scope>
.spu-img {
  width: 300px;
  height: 300px;
}
</style>
