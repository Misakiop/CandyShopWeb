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
            <a href="./userlist">商品列表</a>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </template>
      <template #content>
        <div class="search">
          <el-input v-model="inputsearch" style="width: 240px" placeholder="请输入用户名" :prefix-icon="'Search'" />
          <el-button type="primary" @click="handleSearch">搜索</el-button>
        </div>
      </template>
      <el-descriptions :column="3" size="small" class="mt-4"></el-descriptions>
      <!-- 页头结束 -->

      <!-- 用户列表 -->
      <div id="userlist">
        <el-table :data="userList" stripe style="width: 100%; display: flex; justify-content: center;">
          <el-table-column prop="id" label="ID" width="50" />
          <el-table-column prop="username" label="用户名" width="100" />
          <el-table-column prop="password" label="密码" width="120" />
          <el-table-column prop="gender" label="性别" width="100" />
          <el-table-column prop="email" label="邮箱" width="180" />
          <el-table-column prop="telephone" label="电话号码" width="120" />
          <el-table-column prop="introduce" label="个性签名" width="200" />
          <el-table-column prop="registTime" label="注册时间" width="200" />
          <el-table-column prop="lastPasswordResetDate" label="最后修改密码时间" width="200" />
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button type="primary" circle @click="userEdit(scope.row)"><el-icon>
                  <Edit />
                </el-icon></el-button>
              <el-button type="danger" circle @click="handleDelete(scope.row)"><el-icon>
                  <Delete />
                </el-icon></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 用户结束 -->

      <!-- 用户修改 -->
      <el-dialog v-model="dialogVisible" title="编辑用户信息" width="500">
        <el-form :model="editUser" :rules="USERrules" ref="formRef">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="editUser.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="editUser.password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <!-- <el-input v-model="editUser.gender" autocomplete="off" /> -->
            <el-radio-group v-model="editUser.gender">
              <el-radio value="男" size="large">男</el-radio>
              <el-radio value="女" size="large">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="editUser.email" autocomplete="off" />
          </el-form-item>
          <el-form-item label="电话号码" :label-width="formLabelWidth">
            <el-input v-model="editUser.telephone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="个性签名" :label-width="formLabelWidth">
            <el-input v-model="editUser.introduce" autocomplete="off" />
          </el-form-item>
          <el-form-item label="注册时间" :label-width="formLabelWidth">
            <el-input v-model="editUser.registTime" autocomplete="off" disabled />
          </el-form-item>
          <el-form-item label="修改密码时间" :label-width="formLabelWidth">
            <el-input v-model="editUser.lastPasswordResetDate" autocomplete="off" disabled />
          </el-form-item>
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
      <!-- 用户修改结束 -->
    </el-page-header>

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
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getinfo, updateUserInfo, getUserByName } from "../../../api/manager";
import { msgls, msgla } from "../../../composables/util";

const router = useRouter();
const userList = ref([]);
const showProgress = ref(true);
const dialogVisible = ref(false);
const editUser = ref({});
const formLabelWidth = '120px';
const inputsearch = ref('');
const formRef = ref(null); // 添加对表单的引用
const totalItems = ref(0);  // 总商品数量
const currentPage = ref(1);  // 当前页
const pageSize = ref(10);  // 每页商品数量

// 组件挂载后执行的函数
onMounted(() => {
  fetchUserList(currentPage.value, pageSize.value);
});

// 获取商品列表数据
const fetchUserList = (pageNum, pageSize) => {
  showProgress.value = true;
  getinfo(pageNum, pageSize)
    .then((res) => {
      userList.value = res.data.list;
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
  currentPage.value = 1;
  const username = inputsearch.value.trim();

  if (username === "") {
    // 如果搜索框为空，显示所有商品
    currentPage.value = 1;  // 重置为第一页
    fetchUserList(currentPage.value, pageSize.value, true); // 显示所有商品
  }
  else {
    getUserByName(username)
      .then((res) => {
        if (res.data && res.data.id !== undefined) {
          userList.value = [res.data];
        } else {
          userList.value = [];  // 如果没有找到结果，清空用户列表
          ElMessage.info('未找到匹配的用户');
        }
        showProgress.value = false;
      })
      .catch((err) => {
        console.error("搜索失败: ", err);
        ElMessage.error('搜索失败，请稍后再试');
        showProgress.value = false;
      })
  }
}


// 分页变化时的处理函数
const handlePageChange = (page) => {
  currentPage.value = page;
  fetchUserList(currentPage.value, pageSize.value);
};

// 返回按钮点击事件处理
const onBack = () => {
  router.push('index');
};

// 编辑用户信息
const userEdit = (row) => {
  editUser.value = { ...row };
  dialogVisible.value = true;
};

// 删除用户信息
const handleDelete = (row) => {
  console.log('Delete row:', row);
};

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
};

// 保存编辑的信息
const saveEdit = () => {
  formRef.value.validate((valid) => { // 调用表单的 validate 方法
    if (valid) {
      // 表单验证通过，执行保存操作
      updateUserInfo(editUser.value).then(() => {
        // ElMessage.success('用户信息更新成功');
        closeDialog();
      }).catch(err => {
        ElMessage.error('用户信息更新失败: ' + err.message);
      });
    } else {
      console.log('error submit!!');
      return false;
    }
  });

  const index = userList.value.findIndex(user => user.id === editUser.value.id);
  if (index !== -1) {
    userList.value.splice(index, 1, { ...editUser.value });
  }

  updateUserInfo(editUser.value)
    .then((res) => {
      if (res.code === 200) {
        console.log("状态码:" + res.code, "提示:" + res.msg);
        msgla(res.msg);

        closeDialog();
      } else {
        console.log("状态码:" + res.code, "提示:" + res.msg);
        msgls(res.msg);
      }
    });
};
</script>

<style></style>