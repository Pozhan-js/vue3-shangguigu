<template>
  <el-card class="box-card">
    <template #header>
      <div class="card-header">
        <!-- dialogFormVisible = true -->
        <el-button type="primary" :icon="Plus" @click="showTrademarkDialog"
          >添加</el-button
        >
      </div>
    </template>
    <!-- 表格 -->
    <el-table :data="trademarkList" v-loading="loading" border style="width: 100%">
      <el-table-column type="index" label="序号" align="center" width="180" />
      <el-table-column prop="tmName" label="品牌名" align="center" width="180" />
      <el-table-column label="品牌Logo" align="center">
        <template v-slot="{ row }">
          <img :src="row.logoUrl" alt="平牌logo" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作 ">
        <template v-slot="{ row }">
          <el-button
            type="warning"
            size="small"
            :icon="Edit"
            @click="editTrademark(row)"
          />
          <el-button
            type="danger"
            size="small"
            :icon="Delete"
            @click="deleteTrademark(row.id)"
          />
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器   -->
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

    <!-- 对话框 -->
    <el-dialog
      v-model="dialogFormVisible"
      :title="`${trademark.id ? '修改' : '添加'}品牌`"
    >
      <!-- 表单校验 -->
      <el-form :model="trademark" ref="ruleFormRef" :rules="rules">
        <el-form-item label="品牌名" prop="tmName" label-width="90px" width="75%">
          <el-input v-model="trademark.tmName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="品牌名" prop="logoUrl" label-width="90px" width="75%">
          <el-upload
            class="avatar-uploader"
            :action="`${BASE_URL}/admin/product/upload`"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="trademark.logoUrl" :src="trademark.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon">
              <Plus />
            </el-icon>
            <template #tip>
              <div class="el-upload__tip">
                只能上传jpg/jpeg/png等格式图片,且大小不能超过2M
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="btnTradeMark">{{
            trademark.id ? "修改" : "添加"
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<script lang="ts">
export default {
  name: "Trademark",
};
</script>

<script lang="ts" setup>
import { Plus, Edit, Delete } from "@element-plus/icons-vue";
import {
  reqGetAllTrademarkListData,
  reqSaveTrademarkInfo,
  reqDeleteTrademarkInfo,
  reqUpdateTrademarkInfo,
} from "@/api/product/trademark";
import type {
  TrademarkListModel,
  TrademarkModel,
} from "@/api/product/model/trademarkModel";
import { onMounted, ref, reactive } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import type { FormInstance, FormRules, UploadProps } from "element-plus";

//loading效果变量
let loading = ref<boolean>(true);
// 表格数据源
let trademarkList = ref<TrademarkListModel>([]);

// 分页器变量
const currentPage = ref<number>(1);
const pageSize = ref<number>(5);
const total = ref<number>(0);

const small = ref<boolean>(false);
const disabled = ref<boolean>(false);
const background = ref<boolean>(false);

// 对话框变量
const dialogFormVisible = ref<boolean>(false);
const formLabelWidth = "140px";

// 数据源 为了保证每次的上传对象 都是新的对象 采用函数形式返回对象
const trademarkInfo = () => {
  return {
    logoUrl: "",
    tmName: "",
  };
};

// 约束trademark类型
const trademark = reactive<TrademarkModel>(trademarkInfo());

// 动态读取环境变量中的值
const BASE_URL = import.meta.env.VITE_API_URL;

// 表单信息
const formSize = ref("default");
const ruleFormRef = ref<FormInstance>();

// 校验规则
const rules = reactive<FormRules>({
  tmName: [
    {
      required: true,
      message: "商品名不能为空,请输入你的商品名",
      trigger: "blur",
    },
    { min: 1, max: 10, message: "商品名长度只能为3-5个字符", trigger: "blur" },
  ],
  logoUrl: [
    {
      required: true,
      message: "请添加要上传的照片",
      trigger: "change",
    },
  ],
});

// 分页器函数
const handleSizeChange = (val: number) => {
  // val是我当前点击分页器的页数
  // 此时我是需要点击分页器发送请求 获取新页面的数据
  // 页面显示数据多少
  pageSize.value = val;
  // 当前页数
  currentPage.value = 1;
  // 记载效果
  loading.value = true;
  // 重新发送请求
  getTrademarkListData();
};
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  // 重新发送请求
  getTrademarkListData();
};

// 提交表单校验的按钮方法
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log("submit!");
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 表单提交照片成功函数
const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  // 将图片存储在服务器上的地址保存在logoUrl中显示图片
  trademark.logoUrl = response.data;

  // 清除表单验证  上传成功之后清除图片校验
  ruleFormRef.value?.clearValidate(["logoUrl"]);
};

// 限定图片上传的格式及大小
const beforeAvatarUpload: UploadProps["beforeUpload"] = (rawFile) => {
  const imgTypes = ["image/jpeg", "image/jpg", "image/png"];
  // if (rawFile.type !== 'image/jpeg') {
  if (!imgTypes.includes(rawFile.type)) {
    ElMessage.error("上传图片的格式只能是jpg/png/jepg,请重新选择");
    return false;
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error("图片大小不能超过2M,请重新选择...!");
    return false;
  }
  return true;
};

// 添加商品按钮函数
const btnTradeMark = async () => {
  if (trademark.id) {
    // 修改商品
    await reqUpdateTrademarkInfo(trademark);
  } else {
    // 发送请求 添加商品
    await reqSaveTrademarkInfo(trademark);
  }
  ElMessage.success((trademark.id ? "修改" : "添加") + `品牌成功`);
  // ElMessage({
  //   type: "success",
  //   message: "添加品牌成功",
  // });
  dialogFormVisible.value = false;
  // 当添加照片成功时应当重新发送请求获取分页器第一页数据
  currentPage.value = 1;
  // 重新发送请求
  getTrademarkListData();
};

// 点击外层添加函数显示表单
const showTrademarkDialog = () => {
  // 清空原值
  Object.assign(trademark, trademarkInfo());
  // 删除对象中的id
  delete trademark.id;

  dialogFormVisible.value = true;
};

// 删除商品
const deleteTrademark = (id: number) => {
  ElMessageBox.confirm("确定要删除商品?", "提示", {
    confirmButtonText: "删除",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      // 删除成功时要发送请求
      await reqDeleteTrademarkInfo(id);

      ElMessage({
        type: "success",
        message: "删除成功",
      });
      // 重新发送请求获取最新数据
      getTrademarkListData();
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "Delete canceled",
      });
    });
};

// 更新品牌数据之弹框显示待更新的品牌数据
const editTrademark = (row: TrademarkModel) => {
  // 将需要显示出来的品牌数据给trademark进行赋值，因为数据是响应式的，页面会渲染出来
  Object.assign(trademark, row); // 注意 此时的row当中，是有id的
  dialogFormVisible.value = true; // 显示对话框
};

// 发送请求函数
const getTrademarkListData = async () => {
  const result = await reqGetAllTrademarkListData(
    currentPage.value as number,
    pageSize.value as number
  );
  // console.log(result);
  // if(result.code==200){
  trademarkList.value = result.records;
  // 得到total数量
  total.value = result.total;
  // 隐藏加载效果
  loading.value = false;
  // }
};
onMounted(() => {
  // 在挂载时发送请求
  getTrademarkListData();
});
</script>

<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
