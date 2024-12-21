<template>
  <div>
    <!-- 进度条 -->
    <el-progress v-if="showProgress" style="margin-top: -15px; width: 100%;" :percentage="100" status="success"
      :indeterminate="true" :duration="1" />

    <!-- 页头开始 -->
    <el-page-header @back="onBack" style="margin-top: 10px;">
      <template #breadcrumb>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: 'index' }">
            <el-tag type="primary">首页</el-tag>
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <el-tag type="success" closable @close="handleClose(tag)">商品列表</el-tag>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <template #content>
        <div class="search">
          <el-input v-model="inputsearch" style="width: 240px" placeholder="请输入商品" :prefix-icon="'Search'" clearable />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-select clearable v-model="candyList" value-key="id" filter-method="handleSearch"
            @change="onCategoryChange" placeholder="糖果类型" style="width: 140px;margin-left: 20px;">
            <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item" />
          </el-select>
          <el-tooltip class="box-item" effect="light" content="添加商品" placement="top">
            <el-button style="margin-left: 20PX;" color="pink" @click="openAddDialog" circle><el-icon color="white"
                style="font-size: 40px;">
                <CirclePlus />
              </el-icon></el-button></el-tooltip>
          <el-tooltip class="box-item" effect="light" content="刷新缓存" placement="top">
            <el-button @click="Reload" color="pink" circle><el-icon color="white" style="font-size: 20px;">
                <Refresh />
              </el-icon></el-button></el-tooltip>
        </div>
      </template>
    </el-page-header>
    <!-- 页头结束 -->

    <!-- 商品内容 -->
    <div id="car-candylist">
      <el-row :gutter="20" justify="center">
        <el-col :span="4" v-for="item in candyList" :key="item.id" :xl="4" :lg="5" :md="8" :sm="8" :xs="16">
          <el-card style="max-width: 400px; max-height: 400px; margin-bottom: 15px;" shadow="hover" @click="routerHand">
            <el-image :src="item.imguid" style="width: 100%; height: 200px;">
              <template #error>
                <div class="image-slot">
                  <el-icon>
                    <Picture />
                  </el-icon>
                </div>
              </template>
            </el-image>
            <el-text line-clamp="2" class=" mx-1 font-bold" style="margin-top: 5px;">{{ item.name
              }}</el-text>
            <div style="display: flex; align-items: center; margin-top: 5px;">
              <el-text class="mx-1 font-bold text-xl text-red-500 text-l" style="margin-right: 15px;">
                ￥{{ item.price }}
              </el-text>

              <el-tooltip class="box-item" effect="dark" content="编辑" placement="bottom">
                <el-button circle type="primary" style="margin-left: 90px;" @click="shopEdit(item)">
                  <el-icon :size="20">
                    <Edit />
                  </el-icon>
                </el-button>
              </el-tooltip>

              <!-- <el-button color="red" circle type="primary" @click="openDeleteDialog(item)">
                <el-icon :size="20">
                  <Delete />
                </el-icon>
              </el-button> -->

              <el-popconfirm width="220" :icon="InfoFilled" icon-color="#ff4d4d" title="确定删除商品?" @cancel="onCancel">
                <template #reference>
                  <el-button color="red" circle type="primary">
                    <el-icon :size="20">
                      <Delete />
                    </el-icon>
                  </el-button>
                </template>
                <template #actions="{ cancel }">
                  <el-button size="small" @click="cancel">No!</el-button>
                  <el-button type="danger" size="small" @click="deCandy(item)">
                    Yes?
                  </el-button>
                </template>
              </el-popconfirm>
            </div>
            <el-text>库存：</el-text>
            <el-text :style="{ color: item.num < 50 ? 'red' : '#6c6e71' }">{{ item.num }}</el-text>
            <div style="display: flex;align-items: flex-start;">
              <el-tag class="bg-pink-500 text-light-600 font-bold" round style="margin-top: 5px;">
                {{ item.category.name }}
              </el-tag>
              <el-tag class="font-bold tracking-widest" effect="dark" style="margin-top: 5px;margin-left: 130px;"
                :type="item.state === 0 ? 'danger' : (item.state === 1 ? 'success' : 'warning')">
                {{ item.state === 0 ? '下架' : (item.state === 1 ? '上架' : '缺货') }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 商品结束 -->

    <!-- 商品修改开始 -->
    <el-dialog v-model="dialogVisible" title="编辑商品信息" width="800">
      <el-form :model="editCandy" ref="formRef" :rules="EditformRules" style="display: flex;
    align-items: flex-start;">
        <!-- <el-form-item label="商品ID" :label-width="formLabelWidth">
          <el-input v-model="editCandy.id" autocomplete="off"/>
        </el-form-item> -->
        <div style="margin-left: 4%;">
          <el-form-item label="商品" :label-width="formLabelWidth">
            <el-input v-model="editCandy.name" autocomplete="off" placeholder="请输入商品名" />
          </el-form-item>
          <el-form-item label="介绍" :label-width="formLabelWidth">
            <el-input v-model="editCandy.comment" type="textarea" autocomplete="off" placeholder="请输入商品描述" />
          </el-form-item>
          <el-form-item label="类型" prop="category" :label-width="formLabelWidth">
            <el-select v-model="editCandy.category" value-key="id" placeholder="Select" style="width: 240px">
              <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="editCandy.price" autocomplete="off" placeholder="请输入商品价格(格式00.00)" />
          </el-form-item>
          <el-form-item label="库存" prop="num" :label-width="formLabelWidth">
            <el-input v-model="editCandy.num" type="number" placeholder="请输入商品库存(整数)" />
          </el-form-item>
          <el-form-item label="状态" prop="state" :label-width="formLabelWidth" style="max-width: 400px;">
            <el-radio-group v-model="editCandy.state">
              <el-radio value="1" size="large">上架</el-radio>
              <el-radio value="0" size="large">下架</el-radio>
              <!-- <el-radio value="2" size="large">缺货</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item label="克重/份" prop="kgs" :label-width="formLabelWidth" style="max-width: 400px;">
            <el-input v-model="editCandy.kgs" type="number" placeholder="请输入商品克重(整数)" />
          </el-form-item>
          <el-form-item label="尺寸/份" prop="size" :label-width="formLabelWidth" style="max-width: 400px;">
            <el-input v-model="editCandy.size" placeholder="40x40cm(外包装)" />
          </el-form-item>
          <el-form-item label="保质期/天" prop="expirationdate" :label-width="formLabelWidth" style="max-width: 400px;">
            <el-input v-model="editCandy.expirationdate" type="number" placeholder="请输入商品保质期(整数)" />
          </el-form-item>
        </div>
        <div style="margin-left: 8%;">
          <el-form-item label="添加时间" prop="addtime" :label-width="formLabelWidth">
            <el-date-picker v-model="editCandy.addtime" type="datetime" placeholder="请输入商品添加时间" autocomplete="off" />
          </el-form-item>
          <el-form-item label="生成日期" :label-width="formLabelWidth">
            <el-date-picker v-model="editCandy.creationdate" type="date" placeholder="请输入商品生产日期" autocomplete="off" />
          </el-form-item>
          <el-form-item label="储存方法" prop="storagemethod" :label-width="formLabelWidth">
            <el-input v-model="editCandy.storagemethod" type="textarea" placeholder="请输入商品储存方法" />
          </el-form-item>
          <!-- 上传图片开始 -->
          <el-upload action="http://121.40.60.41:8080/api/file/uploadPicture" list-type="picture-card" :limit="1"
            :on-success="handleUploadSuccess" :on-error="handleUploadError" :on-exceed="handleExceed"
            :headers="uploadHeaders" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisibleimg">
            <img w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </div>
        <!-- 上传图片结束 -->
      </el-form>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="saveEdit">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 商品修改结束 -->

    <!-- 商品添加开始 -->
    <el-dialog v-model="addDialogVisible" title="添加商品" width="800">
      <el-form :model="newCandy" ref="addFormRef" :rules="AddformRules" style="display: flex;
    align-items: flex-start;">
        <!-- <el-form-item label="商品ID" :label-width="formLabelWidth">
          <el-input v-model="newCandy.id" autocomplete="off" placeholder="请输入商品ID" />
        </el-form-item> -->
        <div style="margin-left: 4%;">
          <el-form-item label="商品" prop="name" :label-width="formLabelWidth">
            <el-input v-model="newCandy.name" autocomplete="off" placeholder="请输入商品名" />
          </el-form-item>
          <el-form-item label="介绍" prop="comment" :label-width="formLabelWidth">
            <el-input v-model="newCandy.comment" type="textarea" placeholder="请输入商品描述" />
          </el-form-item>
          <el-form-item label="类型" prop="category" :label-width="formLabelWidth">
            <el-select v-model="newCandy.category" value-key="id" placeholder="糖果类型" style="width: 240px">
              <el-option v-for="item in cateList" :key="item.id" :label="item.name" :value="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="价格" prop="price" :label-width="formLabelWidth">
            <el-input v-model="newCandy.price" type="number" placeholder="请输入商品价格(格式00.00)" />
          </el-form-item>
          <el-form-item label="库存" prop="num" :label-width="formLabelWidth">
            <el-input v-model="newCandy.num" type="number" placeholder="请输入商品库存(整数)" />
          </el-form-item>
          <el-form-item label="克重/份" prop="kgs" :label-width="formLabelWidth" style="max-width: 400px;">
            <el-input v-model="newCandy.kgs" type="number" placeholder="请输入商品克重(整数)" />
          </el-form-item>
          <el-form-item label="尺寸/份" prop="size" :label-width="formLabelWidth" style="max-width: 400px;">
            <el-input v-model="newCandy.size" placeholder="40x40cm(外包装)" />
          </el-form-item>
          <el-form-item label="保质期/天" prop="expirationdate" :label-width="formLabelWidth" style="max-width: 400px;">
            <el-input v-model="newCandy.expirationdate" type="number" placeholder="请输入商品保质期(整数)" />
          </el-form-item>
        </div>
        <div style="margin-left: 8%">
          <el-form-item label="生产日期" :label-width="formLabelWidth">
            <el-date-picker v-model="newCandy.creationdate" type="date" placeholder="请输入商品生产日期" autocomplete="off" />
          </el-form-item>
          <el-form-item label="储存方法" prop="storagemethod" :label-width="formLabelWidth">
            <el-input v-model="newCandy.storagemethod" type="textarea" placeholder="请输入商品储存方法" />
          </el-form-item>
          <!-- 上传图片 -->
          <el-form-item label="商品图片" prop="imguid" :label-width="formLabelWidth">
            <el-upload action="http://121.40.60.41:8080/api/file/uploadPicture" :headers="uploadHeaders"
              list-type="picture-card" :limit="1" :on-success="handleAddUploadSuccess" :on-error="handleAddUploadError"
              :on-exceed="handleAddExceed">
              <el-icon>
                <Plus />
              </el-icon>
            </el-upload>
          </el-form-item>
        </div>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeAddDialog">取消</el-button>
          <el-button type="primary" @click="submitNewCandy">添加</el-button>
        </span>
      </template>

    </el-dialog>
    <!-- 商品添加结束 -->

    <!-- 商品删除弹出框开始 -->
    <el-dialog v-model="deCandyDialogVisible" title="删除商品" width="500" center>
      <span>是否确定删除商品？: </span><span style="color: red"> {{ currentItemToDelete?.name || '' }}</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deCandyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="deCandy">确定</el-button>
        </div>
      </template>
    </el-dialog>
    <!-- 商品删除弹出框结束 -->

    <!-- 回到顶部 -->
    <el-backtop :right="100" :bottom="100" />

    <!-- 页码开始 -->
    <el-footer>
      <div style="display: flex; justify-content: center;">
        <el-pagination background layout="prev, pager, next" :total="totalItems" :current-page="currentPage"
          :page-size="pageSize" @update:current-page="handlePageChange" />
      </div>
    </el-footer>
    <!-- 页码结束 -->

  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getcandy, updateCandy, addCandy, deleteCandy, reloadCandy, getcandyByWhere, } from "../../../api/manager";
import { Edit } from '@element-plus/icons-vue';
import { msgls, msgla } from "../../../composables/util";
import dayjs from 'dayjs';
import { getToken } from '../../../composables/auth';

const router = useRouter();
const candyList = ref([]);  // 商品列表
const showProgress = ref(true);  // 控制进度条的显示与隐藏
const totalItems = ref(0);  // 总商品数量
const currentPage = ref(1);  // 当前页
const pageSize = ref(12);  // 每页商品数量
const inputsearch = ref('');  // 搜索框绑定数据
const dialogVisible = ref(false); //弹窗默认关闭
const dialogVisibleimg = ref(false); //弹窗默认关闭
const formRef = ref(null); // 添加对表单的引用
const editCandy = ref({}); //编辑商品表单的数据
const formLabelWidth = null;
const dialogImageUrl = ref('')
const addFormRef = ref(null);
const addDialogVisible = ref(false);
const deCandyDialogVisible = ref(false);
const currentItemToDelete = ref(null); // 当前待删除商品
const cateList = ref([]);
const clicked = ref(false);
const selectedCategory = ref(null);  // 用于绑定选择器的值
const filteredCandyList = ref([]);   // 存储过滤后的商品列表
const selectedCategoryId = ref([])
// const state = ref(0);

const newCandy = reactive({
  name: '',
  comment: '',
  category: '',
  price: '',
  num: '',
  kgs: '',
  size: '',
  creationdate: '',
  expirationdate: '',
  storagemethod: '',
  state: '',
  imguid: ''
});

const AddformRules = {
  name: [
    { required: true, message: '商品名至少3个字符', min: 3, trigger: 'blur' }
  ],
  comment: [
    { required: true, message: '商品描述至少10个字符', min: 10, trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品类型', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  num: [
    { required: true, message: '请输入商品库存', trigger: 'blur' }
  ],
  kgs: [
    { required: true, message: '请输入商品克重', trigger: 'blur' }
  ],
  size: [
    { required: true, message: '请输入商品尺寸', trigger: 'blur' }
  ],
  expirationdate: [
    { required: true, message: '请输入商品保质期', trigger: 'blur' }
  ],
  creationdate: [
    { required: true, message: '请输入商品生产日期', trigger: 'blur' }
  ],
  storagemethod: [
    { required: true, message: '储存方法至少10个字符', min: 10, trigger: 'blur' }
  ]
};

const EditformRules = {
  name: [
    { required: true, message: '商品名至少3个字符', min: 3, trigger: 'blur' }
  ],
  comment: [
    { required: true, message: '商品描述至少10个字符', min: 10, trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择商品类型', trigger: 'change' }
  ],
  price: [
    { required: true, message: '请输入商品价格', trigger: 'blur' }
  ],
  num: [
    { required: true, message: '请输入商品库存', trigger: 'blur' }
  ],
  state: [
    { required: true, message: '请选择商品状态', trigger: 'change' }
  ],
  kgs: [
    { required: true, message: '请输入商品克重', trigger: 'blur' }
  ],
  size: [
    { required: true, message: '请输入商品尺寸', trigger: 'blur' }
  ],
  expirationdate: [
    { required: true, message: '请输入商品保质期', trigger: 'blur' }
  ],
  addtime: [
    { required: true, message: '请输入商品添加时间', trigger: 'change' }
  ],
  creationdate: [
    { required: true, message: '请输入商品生产日期', trigger: 'change' }
  ],
  storagemethod: [
    { required: true, message: '储存方法至少10个字符', min: 10, trigger: 'blur' }
  ]
};


// 使用 ref 存储上传的 header 信息
const uploadHeaders = computed(() => {
  return {
    Authorization: `Bearer ${getToken()}`
  };
});

// 组件挂载后执行的函数，初始化商品列表
onMounted(() => {
  fetchCandyList(currentPage.value, pageSize.value);
  console.log("token:", getToken)
});

// 获取商品列表数据
const fetchCandyList = (pageNum, pageSize) => {
  showProgress.value = true;
  getcandy(pageNum, pageSize)
    .then((res) => {
      candyList.value = res.data.pageInfo.list;
      totalItems.value = res.data.pageInfo.total;  // 设置总记录数
      cateList.value = res.data.categoryList; // 存储类别数据
      showProgress.value = false;
      // console.log("数据",res.data.pageInfo.categoryList)
    })
    .catch((err) => {
      console.error(err);
      showProgress.value = false;
    });
  // console.log("Current Page: ", pageNum);
  // console.log("Page Size: ", pageSize);

};

//标签关闭
const handleClose = () => {
  router.push('index');
}

// 搜索按钮点击事件处理
// const handleSearch = () => {
//   showProgress.value = true;
//   currentPage.value = 1; // 搜索从第一页开始
//   const name = inputsearch.value.trim(); // 获取搜索内容
  // const categoryId = selectedCategoryId.value; // 获取选择的分类ID

//   // 调用 API 获取数据
//   fetchCandyList2(currentPage.value, pageSize.value, name, categoryId);
// };

// 获取糖果列表（包括分页和搜索）
// const fetchCandyList2 = (pageNum, pageSize, name, categoryId) => {
//   getcandyByWhere(pageNum, pageSize, name, categoryId)
//     .then((res) => {
//       if (res.data && res.data.pageInfo) {
//         candyList.value = res.data.pageInfo.list || []; // 更新商品列表
//         totalItems.value = res.data.pageInfo.total || 0; // 更新总记录数
//       }
//       showProgress.value = false;
//     })
//     .catch((err) => {
//       console.error("查询失败: ", err);
//       showProgress.value = false;
//     });
// };



// // 搜索按钮点击事件处理
const handleSearch = () => {
  showProgress.value = true;
  currentPage.value = 1; // 搜索从第一页开始
  const name = inputsearch.value.trim(); // 获取搜索内容

  if (name === "") {
    // 如果搜索框为空，显示所有商品
    currentPage.value = 1;  // 重置为第一页
    fetchCandyList(currentPage.value, pageSize.value, true); // 显示所有商品
  }
  else {
    getcandyByname(currentPage.value, pageSize.value, name)
      .then((res) => {
        candyList.value = res.data.list || []; // 更新商品列表
        totalItems.value = res.data.total || 0; // 更新总记录数
        showProgress.value = false;
      })
      .catch((err) => {
        console.error("搜索失败: ", err);
        showProgress.value = false;
      });
  }
};

// 分页变化时的处理函数
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchCandyList(currentPage.value, pageSize.value);
};

function onCancel() {
  clicked.value = true
}

// 删除商品
const deCandy = (item) => {
  currentItemToDelete.value = item;
  if (!currentItemToDelete.value) {
    msgla("待删除商品信息不存在");
    return;
  }

  deleteCandy(currentItemToDelete.value.id)
    .then((res) => {
      if (res.code === 200) {
        msgla("商品删除成功");
        deCandyDialogVisible.value = false;

        // 从商品列表移除
        const index = candyList.value.findIndex((candy) => candy.id === currentItemToDelete.value.id);
        if (index !== -1) {
          candyList.value.splice(index, 1);
        }
        currentItemToDelete.value = null; // 清空待删除商品
      } else {
        msgls("删除失败: " + res.msg);
      }
    })
    .catch((err) => {
      msgls("删除失败: " + err.message);
    });
};

// 编辑商品信息
const shopEdit = (row) => {
  editCandy.value = { ...row };
  dialogVisible.value = true;
};

// 关闭修改对话框
const closeDialog = () => {
  dialogVisible.value = false;
};

// 保存编辑的信息
const saveEdit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      // 格式化日期字段
      const formattedCandy = {
        ...editCandy.value, // 保留所有字段
        creationdate: editCandy.value.creationdate
          ? dayjs(editCandy.value.creationdate).format("YYYY-MM-DD")
          : "",  // 如果为空，设置为默认值（空字符串）
        addtime: editCandy.value.addtime
          ? dayjs(editCandy.value.addtime).format("YYYY-MM-DDTHH:mm:ss")
          : "",  // 如果为空，设置为默认值（空字符串）
      };

      // 调用更新 API
      updateCandy(formattedCandy)
        .then((res) => {
          if (res.code === 200) {
            console.log("状态码:", res.code, "提示:", res.msg);
            msgla(res.msg);

            // 更新本地 candyList 数据
            // const index = candyList.value.findIndex(candy => candy.id === editCandy.value.id);
            // if (index !== -1) {
            //   candyList.value.splice(index, 1, { ...formattedCandy });
            // }
            fetchCandyList(currentPage.value, pageSize.value);

            closeDialog();
          } else {
            console.log("状态码:", res.code, "提示:", res.msg);
            msgls(res.msg);
          }
        })
        .catch((err) => {
          // 请求失败
          console.error('更新失败:', err.message || err);
          ElMessage.error('商品信息更新失败: ' + (err.message || '未知错误'));
        });
    } else {
      // 表单验证失败
      console.log('表单验证失败!');
      return false;
    }
  });
};

// 打开添加商品弹窗
const openAddDialog = () => {
  addDialogVisible.value = true;
};

// 关闭添加商品弹窗
const closeAddDialog = () => {
  addDialogVisible.value = false;
};

// 提交新商品数据
const submitNewCandy = () => {
  addFormRef.value.validate((valid) => {
    if (valid) {
      // 格式化日期字段
      const formattedNewCandy = {
        ...newCandy, // 保留所有字段
        creationdate: newCandy.creationdate
          ? dayjs(newCandy.creationdate).format("YYYY-MM-DD")
          : "",
      };


      addCandy(formattedNewCandy)
        .then((res) => {
          if (res.code === 200) {
            console.log(formattedNewCandy)
            msgla('商品添加成功！');
            closeAddDialog();
          } else {
            msgls('添加失败：', res.msg);
          }
        })
        .catch((err) => {
          msgls(err.message, "error");
          console.error('添加商品失败:', err);
        });
    } else {
      console.log('表单验证失败');
    }
  });
};

//添加商品表图片处理开始-------------------------------
// 上传成功处理
const handleAddUploadSuccess = (res) => {
  if (res.code === 200) {
    newCandy.imguid = res.data;
    msgla('图片上传成功');
  } else {
    msgls(res.msg, "error");
  }
};

// 上传失败处理
const handleAddUploadError = (err) => {
  msgls('图片上传失败');
  console.error('上传错误:', err);
};

// 上传超出限制处理
const handleAddExceed = () => {
  msgls('只能上传一张图片！', "waring");
};

//更新商品表图片处理开始-------------------------------
// 上传成功
const handleUploadSuccess = (res) => {
  if (res.code === 200) {
    msgla('图片上传成功');
    newCandy.imguid = res.data;
    // msgls('上传成功，文件地址：' + res.data);

    // 更新当前数据列的 imgurl 字段
    editCandy.value.imguid = res.data;

    // 自动发起 updateCandy 请求
    updateCandy(editCandy.value)
      .then((response) => {
        if (response.code === 200) {
          msgla('商品图片已更新成功');
        } else if (res.code === 400) {
          msgls('图片上传成功，但商品信息更新失败：', response.msg);
        }
      })
      .catch((error) => {
        msgls('商品信息更新失败：', error.message);
        console.error('商品信息更新失败：', error);
      });
  } else {
    msgls(res.msg, "error");
  }
};

// 上传失败
const handleUploadError = (err) => {
  msgls('图片上传失败');
  console.error('上传错误:', err);
};

// 上传超出限制处理
const handleExceed = (files, fileList) => {
  msgls('只能上传一张图片，请先删除已上传的图片！');
};

// 图片删除
const handleRemove = (file) => {
  editCandy.value.imguid = ''; // 清空图片 URL

  const index = fileList.value.findIndex(item => item.uid === file.uid);
  if (index !== -1) {
    fileList.value.splice(index, 1); // 从 fileList 中移除对应的文件项
  }
  msgla('图片已删除');
};

// 图片预览
const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url; // 使用传入的 file 对象的 url 属性
  dialogVisibleimg.value = true;
};
//图片处理结束-------------------------------


const Reload = () => {
  reloadCandy()
    .then((res) => {
      if (res.code === 200) {
        msgla("刷新缓存成功")

        fetchCandyList();
      }
      if (res.code === 500) {
        msgla(res.msg, "error")
      }
    })
};

// 返回按钮点击事件处理
const onBack = () => {
  router.push('index');
};


</script>

<style scoped>
.search {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 60px;
}

.el-tag {
  border: none;
  aspect-ratio: 1;
}
</style>
