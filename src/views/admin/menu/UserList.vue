<template>
  <el-row justify="center">
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
              <el-tag type="success" closable @close="handleClose(tag)">用户列表</el-tag>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </template>
        <template #content>
          <div class="search">
            <el-input v-model="inputsearch" style="width: 240px" placeholder="请输入用户名" :prefix-icon="'Search'"
              clearable />
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-tooltip class="box-item" effect="light" content="新增用户" placement="top">
              <el-button type="success" @click="AddUSerDia = true" circle><el-icon style="font-size: 40px;">
                  <CirclePlus />
                </el-icon></el-button></el-tooltip>
            <el-tooltip class="box-item" effect="light" content="刷新缓存" placement="top">
              <el-button @click="Reload" type="success" circle><el-icon style="font-size: 20px;">
                  <Refresh />
                </el-icon></el-button></el-tooltip>
          </div>
        </template>
        <el-descriptions :column="3" size="small" class="mt-4"></el-descriptions>
        <!-- 页头结束 -->

        <!-- 用户列表 -->
        <div id="userlist">
          <el-table :data="userList" stripe style="width: 100%; display: flex; justify-content: center;">

            <el-table-column prop="id" label="ID" width="50">
              <template #default="scope">
                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                  <template #default>
                    <p class="font-bold">ID:</p>
                    <el-text class="font-bold text-xs">{{ scope.row.id }}</el-text>
                  </template>
                  <template #reference>
                    <el-text class="font-bold" style="width: 100px" truncated>
                      {{ scope.row.id }}
                    </el-text>
                  </template>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column prop="username" label="用户名" width="100">
              <template #default="scope">
                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                  <template #default>
                    <p class="font-bold">用户名:</p>
                    <el-text class="font-bold text-xs">{{ scope.row.username }}</el-text>
                  </template>
                  <template #reference>
                    <el-text class="font-bold" style="width: 100px" truncated>
                      {{ scope.row.username }}
                    </el-text>
                  </template>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column prop="password" label="密码" width="120">
              <template #default="scope">
                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                  <template #default>
                    <p class="font-bold">密码:</p>
                    <el-text class="font-bold text-xs">{{ scope.row.password }}</el-text>
                  </template>
                  <template #reference>
                    <el-text class="font-bold" style="width: 100px" truncated>
                      {{ scope.row.password }}
                    </el-text>
                  </template>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column prop="gender" label="性别" width="100">
              <template #default="scope">
                <el-text class="font-bold" style="width: 100px" truncated>
                  {{ scope.row.gender }}
                </el-text>
              </template>
            </el-table-column>

            <el-table-column prop="email" label="邮箱" width="180">
              <template #default="scope">
                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                  <template #default>
                    <p class="font-bold">邮箱:</p>
                    <el-text class="font-bold text-xs">{{ scope.row.email }}</el-text>
                  </template>
                  <template #reference>
                    <el-text class="font-bold" style="width: 160px" truncated>
                      {{ scope.row.email }}
                    </el-text>
                  </template>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column prop="telephone" label="电话号码" width="120">
              <template #default="scope">
                <el-text class="font-bold" style="width: 100px" truncated>
                  {{ scope.row.telephone }}
                </el-text>
              </template>
            </el-table-column>

            <el-table-column prop="introduce" label="个性签名" width="140">
              <template #default="scope">
                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                  <template #default>
                    <p class="font-bold">个性签名:</p>
                    <el-text class="font-bold text-xs">{{ scope.row.introduce }}</el-text>
                  </template>
                  <template #reference>
                    <el-text class="font-bold" style="width: 120px" truncated>
                      {{ scope.row.introduce }}
                    </el-text>
                  </template>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column label="地址" width="60">
              <template #default="scope">
                <el-popover effect="light" trigger="hover" placement="top" width="auto">
                  <template #default>
                    <p class="font-bold">地址:</p>
                    <el-text class="font-bold text-xs">{{ scope.row.address }}</el-text>
                  </template>
                  <template #reference>
                    <el-button type="primary" circle>
                      <el-icon size="large">
                        <LocationFilled />
                      </el-icon>
                    </el-button>
                  </template>
                </el-popover>
              </template>
            </el-table-column>

            <el-table-column prop="registTime" label="注册时间" width="180" />

            <el-table-column prop="lastPasswordResetDate" label="最后修改密码时间" width="180" />

            <el-table-column label="操作" width="180">
              <template #default="scope">
                <el-button class="bg-green-400" circle @click="userEdit(scope.row)"><el-icon size="large" color="white">
                    <Edit />
                  </el-icon></el-button>
                <el-button type="danger" circle @click="handleDelete(scope.row)"><el-icon size="large">
                    <Delete />
                  </el-icon></el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 用户结束 -->

        <!-- 用户修改 -->
        <el-dialog v-model="dialogVisible" title="编辑用户信息" width="500">
          <el-form :model="editUser" ref="UserformRef" :rules="editUserRules" style="margin-left: -35px;">
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
            <el-form-item label="地址" :label-width="formLabelWidth">
              <el-input v-model="editUser.address" type="textarea" autocomplete="off" />
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
      <!-- 添加用户开始 -->
      <el-dialog v-model="AddUSerDia" title="新增用户" width="500">
        <el-form :model="AddUser" :rules="USERrules" ref="formRef" style="margin-left: -35px;">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="AddUser.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="AddUser.password" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div>
            <el-button @click="AddUSerDia = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">
              完成
            </el-button>
          </div>
        </template>
      </el-dialog>
      <!-- 添加用户结束 -->

      <!-- 页码开始 -->
      <el-footer>
        <div style="display: flex; justify-content: center;">
          <el-pagination background layout="prev, pager, next" :total="totalItems" :current-page="currentPage"
            :page-size="pageSize" @update:current-page="handlePageChange" />
        </div>
      </el-footer>
      <!-- 页码结束 -->

    </div>
  </el-row>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { getinfo, updateUserInfo, getUserByName, regist, deleteUser, reloadUser } from "../../../api/manager";
import { msgls, msgla } from "../../../composables/util";

const router = useRouter();
const userList = ref([]);
const showProgress = ref(true);
const dialogVisible = ref(false);
const AddUSerDia = ref(false)
const editUser = ref({});
const formLabelWidth = '120px';
const inputsearch = ref('');
const formRef = ref(null); // 添加对表单的引用
const totalItems = ref(0);  // 总商品数量
const currentPage = ref(1);  // 当前页
const pageSize = ref(10);  // 每页商品数量
const UserformRef = ref(null);  // 表单引用


const AddUser = reactive({
  username: '',
  password: ''
});

// 表单验证规则
const editUserRules = {
  username: [
    {
      required: true,
      message: "用户名不能为空",
      trigger: "blur",
    },
    {
      min: 3,
      max: 5,
      message: "用户名长度必须是3-5个字符",
      trigger: "blur",
    },
  ],
  password: [
  {
      required: true,
      min: 6,
      message: "密码长度至少为 6 个字符",
      trigger: "blur",
    },
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  telephone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    { pattern: /^[0-9]{11}$/, message: '请输入有效的电话号码', trigger: 'blur' }
  ],
  introduce: [
    { required: false, message: '请输入个性签名', trigger: 'blur' }
  ],
  address: [
    { required: false, message: '请输入地址', trigger: 'blur' }
  ]
};


// 组件挂载后执行的函数
onMounted(() => {
  fetchUserList(currentPage.value, pageSize.value);
});

// 获取用户列表数据
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
  // console.log("Current Page: ", pageNum);
  // console.log("Page Size: ", pageSize);

};

//标签关闭
const handleClose = () => {
  router.push('index');
}

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
  // console.log('Delete row:', row);
  const id = row.id
  // console.log('Delete row:', id);

  deleteUser(id)
    .then((res) => {
      if (res.code === 200) {
        msgla(res.msg)
      } if (res.code === 400) {
        msgla(res.msg, "error")
      }
    })
};

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
};

// 保存编辑的信息
const saveEdit = () => {
  // 调用表单的 validate 方法，进行表单验证
  UserformRef.value.validate((valid) => {
    if (valid) {
      // 表单验证通过，执行保存操作
      updateUserInfo(editUser.value)
        .then((res) => {
          if (res.code === 200) {
            console.log("状态码:" + res.code, "提示:" + res.msg);
            msgla(res.msg);
            closeDialog(); // 关闭对话框
            fetchUserList();
          } else {
            console.log("状态码:" + res.code, "提示:" + res.msg);
            ElMessage.error(res.msg);
          }
        })
        .catch((err) => {
          // 处理更新失败的情况
          ElMessage.error('用户信息更新失败: ' + err.message);
        });
    } else {
      console.log('表单验证失败');
    }
  });
};


//添加用户
const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }
    // 注册用户
    regist(AddUser.username, AddUser.password)
      .then((res) => {
        console.log("注册成功:", res);
        msgla(res.msg);

        const newUser = {
          id: res.data.id,
          username: AddUser.username,
          password: AddUser.password,
          gender: '',
          email: '',
          telephone: '',
          introduce: '',
          address: '',
          registTime: '',
          lastPasswordResetDate: ''
        };

        // 将新注册的用户添加到userList中
        userList.value.push(newUser);

        // 关闭弹窗并清空表单
        AddUSerDia.value = false;
        AddUser.username = '';
        AddUser.password = '';
      })
      .catch((err) => {
        console.error("注册失败:", err);
        msgla(err || "请求失败", "error");
      });
  });
};

const Reload = () => {
  reloadUser()
    .then((res) => {
      if (res.code === 200) {
        msgla("刷新缓存成功")

        fetchUserList();
      }
      if (res.code === 500) {
        msgla(res.msg, "error")
      }
    })
}


</script>

<style></style>