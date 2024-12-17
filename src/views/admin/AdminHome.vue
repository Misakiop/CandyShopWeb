<template>
  <div class="common-layout">
    <el-container>
      <!-- 顶栏 -->
      <el-header>
        <el-menu router :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
          @select="handleSelect">
          <el-menu-item index="0">
            <img style="width: 60px; height: 60; margin-left: 20px" src="/src/static/icon/candy.png"
              alt="Element logo" />
          </el-menu-item>
          <el-text class="text-xl" style="margin-left: 5%">欢迎您:&nbsp;&nbsp;{{ Atuserinfo.username }}</el-text>

          <div style="
              position: absolute;
              right: 0;
              margin-top: 3px;
              margin-right: 20px;
            ">
            <el-popover :width="300"
              popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
              <template #reference>
                <el-avatar :src="Atuserinfo.imguid" />
              </template>
              <template #default>
                <div style="display: flex; gap: 16px; flex-direction: column">
                  <el-avatar :size="60" :src="Atuserinfo.imguid"
                    style="margin: auto; margin-bottom: 8px; cursor: pointer" @click="goToUserList" />
                  <div>
                    <p style="margin: 0; font-weight: 500">
                      用户名:{{ Atuserinfo.username }}
                    </p>
                    <p style="
                        letter-spacing: 3px;
                        margin: 0;
                        font-size: 14px;
                        color: var(--el-color-info);
                      ">
                      性别:{{ Atuserinfo.gender }}
                    </p>
                    <p style="
                        margin: 0;
                        font-size: 14px;
                        color: var(--el-color-info);
                      ">
                      邮箱:{{ Atuserinfo.email }}
                    </p>
                    <p style="
                        margin: 0;
                        font-size: 14px;
                        color: var(--el-color-info);
                      ">
                      手机号码:{{ Atuserinfo.telephone }}
                    </p>
                  </div>
                  <p style="margin: 0">我的简介:{{ Atuserinfo.introduce }}</p>
                  <el-button @click="Logout" style="margin-left: 15px">登出</el-button>
                  <el-button plain @click="centerDialogVisible = true" style="margin-left: 15px"
                    class="bg-gray-300 text-light-300">注销</el-button>
                </div>
              </template>
            </el-popover>
          </div>
        </el-menu>
      </el-header>
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="200px">
          <el-row>
            <el-col :span="24">
              <div class="flex items-center justify-center">
                <h2 class="text-2xl text-gray-600">商城管理员后台</h2>
              </div>
              <el-menu router class="el-menu-vertical-demo">
                <el-menu-item index="index">
                  <el-icon>
                    <HomeFilled />
                  </el-icon>
                  <span>首页</span>
                </el-menu-item>
                <el-menu-item index="candylist">
                  <el-icon>
                    <Shop />
                  </el-icon>
                  <span>商品管理</span>
                </el-menu-item>
                <el-menu-item index="userlist">
                  <el-icon>
                    <UserFilled />
                  </el-icon>
                  <span>用户管理</span>
                </el-menu-item>
                <el-sub-menu index="3">
                  <template #title>
                    <el-icon>
                      <Shop />
                    </el-icon>
                    <span>订单管理</span>
                  </template>
                  <el-menu-item index="1-1">商品列表</el-menu-item>
                  <el-menu-item index="1-2">管理商品</el-menu-item>
                </el-sub-menu>
              </el-menu>
            </el-col>
          </el-row>
        </el-aside>

        <el-container>
          <el-main style="height: 100%">
            <router-view></router-view>
            <!-- 这里将渲染子路由组件 -->
          </el-main>
        </el-container>
      </el-container>

      <!-- 注销弹出框开始 -->
      <el-dialog v-model="centerDialogVisible" title="Warning" width="500" center>
        <span> 注销账号操作不可逆，是否继续？ </span>
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="deuser"> 继续 </el-button>
          </div>
        </template>
      </el-dialog>
      <!-- 注销弹出框结束 -->

      <!-- 用户详细开始 -->
      <el-dialog v-model="dialogVisible2" width="800px">
        <el-descriptions title="个人详细信息" direction="vertical" border>
          <el-descriptions-item :rowspan="2" :width="140" label="Photo" align="center">
            <el-image style="width: 100px; height: 100px" :src=Atuserinfo.imguid />
          </el-descriptions-item>
          <el-descriptions-item label="用户名">
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <user />
                </el-icon>
                <P style="margin-left: 3px;">用户名</P>
              </div>
            </template>
            {{ Atuserinfo.username }}
          </el-descriptions-item>
          <el-descriptions-item label="密码">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Lock />
                </el-icon>
                <P style="margin-left: 3px;">密码</P>
              </div>
            </template>
            {{ Atuserinfo.password }}
          </el-descriptions-item>
          <el-descriptions-item label="性别">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Sugar />
                </el-icon>
                <P style="margin-left: 3px;">性别</P>
              </div>
            </template>
            {{ Atuserinfo.gender }}
          </el-descriptions-item>
          <el-descriptions-item label="个性签名">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <EditPen />
                </el-icon>
                <P style="margin-left: 3px;">个性签名</P>
              </div>
            </template>
            {{ Atuserinfo.introduce }}
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions direction="vertical" border>
          <el-descriptions-item label="手机号码">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <iphone />
                </el-icon>
                <P style="margin-left: 3px;">手机号码</P>
              </div>
            </template>
            {{ Atuserinfo.telephone }}
          </el-descriptions-item>
          <el-descriptions-item label="邮箱">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Message />
                </el-icon>
                <P style="margin-left: 3px;">邮箱</P>
              </div>
            </template>
            {{ Atuserinfo.email }}
          </el-descriptions-item>
          <el-descriptions-item label="注册时间">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <DocumentAdd />
                </el-icon>
                <P style="margin-left: 3px;">注册时间</P>
              </div>
            </template>
            {{ Atuserinfo.registTime }}
          </el-descriptions-item>
          <el-descriptions-item label="地址">
            <template #label>
              <div class="cell-item">
                <el-icon>
                  <Van />
                </el-icon>
                <P style="margin-left: 3px;">地址</P>
              </div>
            </template>
            {{ Atuserinfo.address }}
            <el-button size="large" type="primary" circle @click="userEdit()"
              style="position: absolute; right: 0;margin-right: 20px;margin-top: -8px;">
              <el-icon size="large">
                <Edit />
              </el-icon></el-button>
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
      <!-- 用户详细结束 -->

      <!-- 用户修改 -->
      <el-dialog v-model="dialogVisible" title="编辑用户信息" width="500">
        <el-form :model="Atuserinfo" ref="formRef">
          <el-form-item label="用户名" :label-width="formLabelWidth">
            <el-input v-model="Atuserinfo.username" autocomplete="off" />
          </el-form-item>
          <el-form-item label="密码" :label-width="formLabelWidth">
            <el-input v-model="Atuserinfo.password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="性别" :label-width="formLabelWidth">
            <el-radio-group v-model="Atuserinfo.gender">
              <el-radio value="男" size="large">男</el-radio>
              <el-radio value="女" size="large">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="邮箱" :label-width="formLabelWidth">
            <el-input v-model="Atuserinfo.email" autocomplete="off" />
          </el-form-item>
          <el-form-item label="电话号码" :label-width="formLabelWidth">
            <el-input v-model="Atuserinfo.telephone" autocomplete="off" />
          </el-form-item>
          <el-form-item label="个性签名" :label-width="formLabelWidth">
            <el-input v-model="Atuserinfo.introduce" autocomplete="off" />
          </el-form-item>
          <el-form-item label="地址" :label-width="formLabelWidth">
            <el-input v-model="Atuserinfo.address" type="textarea" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="closeDialog">取消</el-button>
            <el-button type="primary" @click="saveEdit"> 确认 </el-button>
          </span>
        </template>
      </el-dialog>
      <!-- 用户修改结束 -->
    </el-container>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { removeToken } from "../../composables/auth";
import { useRouter } from "vue-router";
import { deleteUser, updateUserInfo } from "../../api/manager";
import { msgla, msgls } from "../../composables/util";

const centerDialogVisible = ref(false);
const dialogVisible = ref(false);
const dialogVisible2 = ref(false);
const formRef = ref(null);
const formLabelWidth = "100px"; // 添加标签宽度，确保一致

const activeIndex = ref("index");
const handleSelect = (index) => {
  activeIndex.value = index;
};

// 使用 ref 确保 Atuserinfo 是响应式
const Atuserinfo = ref({});

// 在 mounted 生命周期中处理 sessionStorage 数据
onMounted(() => {
  const AtuserinfoStr = sessionStorage.getItem("Atuserinfo");
  if (AtuserinfoStr) {
    try {
      const user = JSON.parse(AtuserinfoStr);
      Atuserinfo.value = user; // 更新响应式数据
    } catch (error) {
      console.error("无法从 sessionStorage 解析 Atuserinfo：", error);
    }
  }
});

// 获取 router 实例
const router = useRouter();

// 跳转到用户列表页面
const goToUserList = () => {
  dialogVisible2.value = true;
};

// 登出方法
const Logout = () => {
  removeToken(); // 确保调用 removeToken()

  sessionStorage.removeItem("Atuserinfo");
  msgls("登出成功");

  router.push("/login");
};

// 注销方法
const deuser = async () => {
  const id = Atuserinfo.value.id;
  if (!id) {
    console.error("用户 ID 不存在");
    msgla("用户 ID 无效", "error");
    return;
  }

  try {
    const res = await deleteUser(id);
    if (res.code === 200) {
      msgla(res.msg); // 成功提示
      centerDialogVisible.value = false;
    } else {
      msgls(res.msg, "error");
    }
  } catch (error) {
    msgls("注销失败，请稍后再试", "error");
  }

  removeToken();
  sessionStorage.removeItem("Atuserinfo");

  router.push("/login");
};

// 编辑用户信息
const userEdit = () => {
  dialogVisible.value = true;
};

// 关闭对话框
const closeDialog = () => {
  dialogVisible.value = false;
};

// 保存编辑的信息
const saveEdit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      updateUserInfo(Atuserinfo.value)
        .then(() => {
          msgla("用户信息更新成功");
          closeDialog();
        })
        .catch((err) => {
          msgls("用户信息更新失败: " + err.message, "error");
        });
    }
  });
};
</script>

<style scoped></style>