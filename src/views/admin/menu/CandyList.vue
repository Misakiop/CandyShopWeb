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
            主页
          </el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="./candylist">商品列表</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <template #content>
        <div class="search">
          <el-input v-model="inputsearch" style="width: 240px" placeholder="请输入商品" :prefix-icon="'Search'" />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-tooltip class="box-item" effect="dark" content="添加商品" placement="right">
            <el-button type="primary" @click="openAddDialog" circle><el-icon style="font-size: 40px;">
                <CirclePlus />
              </el-icon></el-button></el-tooltip>
        </div>
      </template>
    </el-page-header>
    <!-- 页头结束 -->

    <!-- 商品内容 -->
    <div id="car-candylist">
      <el-row :gutter="30">
        <el-col :span="4" v-for="item in candyList" :key="item.id" :xl="4" :lg="5" :md="8" :sm="8" :xs="16">
          <el-card style="max-width: 400px; margin-bottom: 15px;" shadow="hover" @click="routerHand">
            <el-image :src="item.imguid || 'http://121.40.60.41:8008/1.jpg'" style="width: 100%; height: 200px;">
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

            <!-- <el-switch v-model="item.state" size="large" inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949; margin-left: 100px;"
              active-text="上架" inactive-text="下架" active-value="1" inactive-value="0"  @change="updateCandyState"/> -->

          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 商品结束 -->

    <!-- 商品修改开始 -->
    <el-dialog v-model="dialogVisible" title="编辑商品信息" width="800">
      <el-form :model="editCandy" ref="formRef" style="display: flex;
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
          <el-form-item label="类型" :label-width="formLabelWidth">
            <el-input v-model="editCandy.category" autocomplete="off" placeholder="请输入商品类型" />
          </el-form-item>
          <el-form-item label="价格" :label-width="formLabelWidth">
            <el-input v-model="editCandy.price" autocomplete="off" placeholder="请输入商品价格(格式00.00)" />
          </el-form-item>
          <el-form-item label="库存" prop="num" :label-width="formLabelWidth">
            <el-input v-model="editCandy.num" type="number" placeholder="请输入商品库存(整数)" />
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
          <el-form-item label="添加时间" prop="addtime" :label-width="formLabelWidth">
            <el-date-picker v-model="editCandy.addtime" type="datetime" placeholder="请输入商品添加时间" autocomplete="off" />
          </el-form-item>
        </div>
        <!-- <el-form-item label="状态" :label-width="formLabelWidth">
          <el-input v-model="editCandy.state" autocomplete="off" />
        </el-form-item> -->
        <!-- 上传图片开始 -->
        <div style="margin-left: 8%;">
          <el-form-item label="生成日期" :label-width="formLabelWidth">
            <el-date-picker v-model="editCandy.creationdate" type="date" placeholder="请输入商品生产日期" autocomplete="off" />
          </el-form-item>
          <el-form-item label="储存方法" prop="storagemethod" :label-width="formLabelWidth">
            <el-input v-model="editCandy.storagemethod" type="textarea" placeholder="请输入商品储存方法" />
          </el-form-item>
          <el-upload action="http://localhost:8080/api/file/uploadPicture" list-type="picture-card" :limit="1"
            :on-success="handleUploadSuccess" :on-error="handleUploadError" :on-exceed="handleExceed"
            :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
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
      <el-form :model="newCandy" ref="addFormRef" style="display: flex;
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
            <el-input v-model="newCandy.category" placeholder="请输入商品类型" />
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
          <el-form-item label="生成日期" :label-width="formLabelWidth">
            <el-date-picker v-model="newCandy.creationdate" type="date" placeholder="请输入商品生产日期" autocomplete="off" />
          </el-form-item>
          <el-form-item label="储存方法" prop="storagemethod" :label-width="formLabelWidth">
            <el-input v-model="newCandy.storagemethod" type="textarea" placeholder="请输入商品储存方法" />
          </el-form-item>
          <!-- 上传图片 -->
          <el-form-item label="商品图片" prop="imguid" :label-width="formLabelWidth">
            <el-upload action="http://localhost:8080/api/file/uploadPicture" 
              :headers="uploadHeaders"
              list-type="picture-card" :limit="1"
              :on-success="handleAddUploadSuccess" :on-error="handleAddUploadError" :on-exceed="handleAddExceed">
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
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getcandy, getcandyByname, updateCandy, addCandy, deleteCandy, } from "../../../api/manager";
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
const deCandyDialogVisible = ref(false)
const currentItemToDelete = ref(null); // 当前待删除商品
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

const uploadHeaders = () =>{
  return {
    Authorization: `Bearer ${getToken()}`
  };
}

// 组件挂载后执行的函数，初始化商品列表
onMounted(() => {
  fetchCandyList(currentPage.value, pageSize.value);
});

// 获取商品列表数据
const fetchCandyList = (pageNum, pageSize) => {
  showProgress.value = true;
  getcandy(pageNum, pageSize)
    .then((res) => {
      candyList.value = res.data.list;
      totalItems.value = res.data.total;  // 设置总记录数
      showProgress.value = false;
    })
    .catch((err) => {
      console.error(err);
      showProgress.value = false;
    });
  console.log("Current Page: ", pageNum);
  console.log("Page Size: ", pageSize);

};

// 搜索按钮点击事件处理
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

// const openDeleteDialog = (item) => {
//   currentItemToDelete.value = item; // 设置当前待删除商品
//   deCandyDialogVisible.value = true;
// };

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
        creationdate: dayjs(editCandy.value.creationdate).format("YYYY-MM-DD"),  // 格式化 creationdate
        addtime: dayjs(editCandy.value.addtime).format("YYYY-MM-DDTHH:mm:ss"), // 格式化 addtime
      };

      // 调用更新 API
      updateCandy(formattedCandy)  // 使用 formattedCandy
        .then((res) => {
          if (res.code === 200) {
            // 更新成功，提示用户
            console.log("状态码:", res.code, "提示:", res.msg);
            msgla(res.msg);

            // 更新本地 candyList 数据
            const index = candyList.value.findIndex(candy => candy.id === editCandy.value.id);
            if (index !== -1) {
              candyList.value.splice(index, 1, { ...formattedCandy });
            }

            // 关闭编辑对话框
            closeDialog();
          } else {
            // API 返回非 200 状态码
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
        creationdate: dayjs(newCandy.creationdate).format("YYYY-MM-DD"), // 格式化 creationdate
      };

      addCandy(formattedNewCandy)  // 使用 formattedNewCandy
        .then((res) => {
          if (res.code === 200) {
            console.log(formattedNewCandy)
            msgla('商品添加成功！');
            closeAddDialog();
          } else {
            msgls('添加失败：' + res.msg);
          }
        })
        .catch((err) => {
          msgls('添加失败：' + err.message);
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
    msgls(res.msg+ "error");
  }
};

// 上传失败处理
const handleAddUploadError = (err) => {
  msgls('图片上传失败');
  console.error('上传错误:', err);
};

// 上传超出限制处理
const handleAddExceed = () => {
  msgls('只能上传一张图片！',"waring");
};



//更新商品表图片处理开始-------------------------------
// 上传成功
const handleUploadSuccess = (res) => {
  if (res.code === 200) {
    msgla('图片上传成功');
    // msgls('上传成功，文件地址：' + res.data);

    // 更新当前数据列的 imgurl 字段
    editCandy.value.imguid = res.data;

    // 自动发起 updateCandy 请求
    updateCandy(editCandy.value)
      .then((response) => {
        if (response.code === 200) {
          msgla('商品图片已更新成功');
        } else {
          msgls('图片上传成功，但商品信息更新失败：' + response.msg);
        }
      })
      .catch((error) => {
        msgls('商品信息更新失败：' + error.message);
        console.error('商品信息更新失败：', error);
      });
  } else if (res.code === 400) {
    msgls(res.msg);
    console.error('上传失败：', res.msg);
  }
};

// 上传失败
const handleUploadError = (error) => {
  msgls('上传失败：', error)
  console.error('上传失败：', error);
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



// 更新商品上架/下架状态
// const updateCandyState = (item) => {
//   const newState = item.state; // 获取切换后的状态
//   updateCandySta({ id: item.id, state: newState }) // 调用更新商品接口
//     .then((res) => {
//       if (res.code === 200) {
//         const message = newState === 1 ? '商品已上架' : '商品已下架';
//         msgla(message); // 显示成功消息
//       } else {
//         msgla('状态更新失败：' + res.msg);
//         // 回滚状态
//         item.state = newState === 1 ? 0 : 1;
//       }
//     })
//     .catch((err) => {
//       msgls('状态更新失败：' + err.message);
//       // 回滚状态
//       item.state = newState === 1 ? 0 : 1;
//     });
// };




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
</style>
