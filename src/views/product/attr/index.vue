<template>
  <div>
    <!-- 三级分类导航栏 -->
    <CategorySelector :isForbiddenForm="isShowAttrList"></CategorySelector>
    <el-card>
      <div v-if="isShowAttrList">
        <el-button type="primary" :icon="Plus" @click="toSaveAttrValue">添加属性</el-button>
        <el-table v-loading="loading" :data="attrList" border style="margin-top: 10px">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性名称" prop="attrName"></el-table-column>
          <el-table-column label="属性值列表">
            <template v-slot="{ row }">
              <el-tag v-for="attr in row.attrValueList" :key="attr.id" class="ml-2" type="success">{{
                attr.valueName
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row }">
              <el-button :icon="Edit" size="small" type="warning" @click="editeAttr(row)"></el-button>
              <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" :icon="InfoFilled" icon-color="#626AEF"
                title="你确定要删除此条属性?" @confirm="confirmEvent(row.id)">
                <template #reference>
                  <el-button :icon="Delete" size="small" type="danger"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-form>
          <el-form-item label="属性名" style="width: 300px">
            <el-input placeholder="请输入属性名" v-model="attrInfo.attrName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="!attrInfo.attrName" :icon="Plus"
              @click="addAttrValue">添加属性值</el-button>
            <el-button type="default" @click="isShowAttrList = true">取消</el-button>
          </el-form-item>
        </el-form>
        <el-table border :data="attrInfo.attrValueList" style="margin-bottom: 20px">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性值名称">
            <template v-slot="{ row, $index }">
              <el-input ref="inputRef" size="small" v-model="row.valueName" v-if="row.isShowInput"
                @blur="deleteCurrentRow(row, $index)">
              </el-input>
              <span v-else @dblclick="toEditAttrValue(row)" style="display: inline-block; width: 100%">{{
                row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="{ row, $index }">
              <el-popconfirm confirm-button-text="Yes" cancel-button-text="No" :icon="InfoFilled" icon-color="#626AEF"
                title="确认删除这条属性值?" @confirm="confirmDeletAttr(row)">
                <template #reference>
                  <el-button :icon="Delete" type="danger" size="small"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" :disabled="!attrInfo.attrName" @click="saveAttrInfo">保存</el-button>
        <el-button type="default" @click="isShowAttrList = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts">
export default {
  name: "Attr",
};
</script>
<script lang="ts" setup>
import { ref, reactive, watch, nextTick } from "vue";
import { Plus, Edit, Delete, InfoFilled } from "@element-plus/icons-vue";
import { useCategoryListStore } from "@/stores/categoryList";
import type {
  AttrInfoModel,
  AttrValueListModel,
  AttrListModel,
  AttrValueInfoModel,
} from "@/api/product/model/attrModel";
import {
  reqGetAttrListData,
  reqDeleteOneAttr,
  reqAddOrUpdateAttrInfo,
} from "@/api/product/attr";
import CategorySelector from "@/components/CategorySelect/index.vue";
import { ElMessage } from "element-plus";

//布尔值变量
const isShowAttrList = ref<boolean>(true);

//加载效果
const loading = ref<boolean>(false);

//创建store对象
const categoryStore = useCategoryListStore();

//得到属性列表
const attrList = ref<AttrListModel>([]);

//获取输入框真实dom
const inputRef = ref<HTMLInputElement>();

//发送请求获取属性列表数据
const getAttrListData = async () => {
  // 请求之前开启loading效果
  loading.value = true;
  const result = await reqGetAttrListData({
    category1Id: categoryStore.category1Id as number,
    category2Id: categoryStore.category2Id as number,
    category3Id: categoryStore.category3Id as number,
  });
  attrList.value = result;
  // 清除loading效果
  loading.value = false;
};

//监视页面中3id的变化
watch(
  () => categoryStore.category3Id,
  async (category3Id) => {
    //3id没有发生改变时就不发送请求
    if (!category3Id) {
      attrList.value = [];
      return;
    }
    //当进入页面发送请求获取属性数据
    getAttrListData();
    ElMessage.success("请求属性列表数据成功");
  },
  {
    immediate: true,
    deep: true,
  }
);

//删除按钮气泡显示
const confirmEvent = async (id: number) => {
  // console.log('confirm!')
  // 发送请求删除数据
  await reqDeleteOneAttr(id);
  // eslint-disable-next-line
  // 重新发送请求获取数据
  getAttrListData();
  ElMessage.success("删除数据成功!!");
};
/**
 * @添加属性对象
 * */
const attrInfo = reactive<AttrInfoModel>({
  attrName: "", // 要添加的属性名
  attrValueList: [], // 要添加的具体的属性值 是一个数组
  categoryId: -1, // 三级分类的id
  categoryLevel: 3, // 分类的等级 当前就设置一个3即可
});

//添加属性值列表方法
const addAttrValue = () => {
  attrInfo.attrValueList.push({
    valueName: "",
    attrId: attrInfo.id, // 编辑的时候使用
    isShowInput: true, // 是不是显示输入框  还是说显示一个span标签
  });
  //获取输入框真实dom
  // eslint-disable-next-line no-unreachable
  nextTick(() => {
    inputRef.value?.focus();
  });
};

//失去焦点删除属性
const deleteCurrentRow = async (row: AttrValueInfoModel, index: number) => {
  //发送删除属性值
  if (!row.valueName) {
    // 5.2 如果没有值 则删除当前行
    attrInfo.attrValueList.splice(index, 1);
    return; // 不要向下执行了
  }
  // 5.3 如果有值 则失去焦点后要显示span标签 而非el-input
  row.isShowInput = false;
};

//点击删除按钮
const confirmDeletAttr = (index: number) => {
  //删除当前列表中改下表的数据
  attrInfo.attrValueList.splice(index, 1);
  ElMessage.success("删除属性值成功");
};

//双击事件
const toEditAttrValue = (row: AttrValueInfoModel) => {
  row.isShowInput = true;
  //自动获取焦点
  nextTick(() => {
    inputRef.value?.focus();
  });
};

//当点击添加属性按钮时 清空数据
const toSaveAttrValue = () => {
  //保持页面一直显示
  isShowAttrList.value = false;
  //清空表单页数据
  attrInfo.attrName = "";
  attrInfo.attrValueList = [];
  //清空id 因为如果有id表示是修改请求
  delete attrInfo.id;
};

//点击保存按钮 保存创建的属性值
const saveAttrInfo = async () => {
  //将最新的三级下拉框的id存入attrInfo中
  attrInfo.categoryId = categoryStore.category3Id;
  //  发送请求添加属性
  await reqAddOrUpdateAttrInfo(attrInfo);
  ElMessage.success("添加成功");
  //  跳转到列表页
  isShowAttrList.value = true;
  // 重新发送请求
  getAttrListData();
};
//----------------------
//修改按钮逻辑
const editeAttr = (row: AttrValueInfoModel) => {
  console.log("修改函数被执行");
  //页面开始跳转
  isShowAttrList.value = false;
  //  将对应行数据进行回显
  Object.assign(attrInfo, row);
};
</script>

<style lang="less" scoped>

</style>
