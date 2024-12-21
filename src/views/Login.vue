<template>
  <el-row class="min-h-screen bg-pink-300">
    <el-col :lg="16" :md="12" class="flex items-center justify-center">
      <div>
        <div class="font-bold text-5xl text-light-50 mb-4">欢迎光临</div>
        <div class="text-gray-200 text-sm">
          网上糖果商城登录页面
        </div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="bg-light-50 flex items-center justify-center flex-col">
      <h2 class="font-bold text-3xl text-gray-800">欢迎回来</h2>
      <div class="flex items-center justify-center my-5 text-gray-300 space-x-2">
        <span class="h-[1px] w-16 bg-gray-200"></span>
        <span>账号密码登录</span>
        <span class="h-[1px] w-16 bg-gray-200"></span>
      </div>

      <el-form ref="formRef" :rules="rules" :model="form" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon>
                <user />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password
            @keyup.enter="onSubmit(ruleFormRef)">
            <template #prefix>
              <el-icon>
                <lock />
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button round color="#edacd2" class="w-[250px]" type="primary" @click="onSubmit"
            :loading="loading">登录</el-button>
        </el-form-item>
        <div>
          <!-- <el-link type="primary" href="https://element-plus.org" class="text-indigo-500"
            style="vertical-align: text-bottom;">忘记密码?</el-link> -->
          <el-link type="primary" href="/regist" class="text-indigo-500"
            style="vertical-align: text-bottom;margin-left: 130px;">注册用户</el-link>
        </div>
      </el-form>

    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref } from "vue";
import { login } from "../api/manager";
import { useRouter } from "vue-router";
import { useStore } from "vuex"
import { setToken } from "../composables/auth"
import { msgls } from '../composables/util';


const store = useStore();
const router = useRouter();

// do not use same name with ref
const form = reactive({
  username: "",
  password: "",
  imguid: ""
});

const rules = {
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
};

const formRef = ref(null);
const loading = ref(false)

const onSubmit = () => {
  formRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }
    // 显示加载状态
    loading.value = true

    login(form.username, form.password)
      .then((res) => {
        // 登录成功
        console.log("登录成功:", res);

        // 显示成功提示
        msgls(res.msg)

        // 保存用户信息
        const Atuserinfo = {
          id: res.data.id,
          username: res.data.username,
          password: res.data.password,
          telephone: res.data.telephone,
          gender: res.data.gender,
          address: res.data.address,
          email: res.data.email,
          introduce: res.data.introduce,
          imguid: res.data.imguid,
          registTime: res.data.registTime,
        };

        sessionStorage.setItem("Atuserinfo", JSON.stringify(Atuserinfo));

        // 存储 Token
        if (res.data.token) {
          setToken(res.data.token);
        } else {
          console.error("Token not found in response data");
        }

        
        const roleList = res.data.roleList && Array.isArray(res.data.roleList) ? res.data.roleList : [];
        const firstRole = roleList[0];

        if (firstRole) {
          switch (firstRole.id) {
            case 1:
              router.push("/admin/index");
              break;
            case 2:
              router.push("/user/index");
              break;
            default:
              console.warn("未知角色ID:", firstRole.id);
              msgls(`未知角色ID: ${firstRole.id}`, "warning");
              break;
          }
        } else {
          console.warn("未分配角色");
          msgls("未分配角色，请联系管理员", "warning");
        }
      })

      .catch((err) => {
        // 登录失败
        console.error("登录失败:", err);

        // 显示错误提示
        msgls(err || "请求失败", "error")

      })

      .finally(() => {
        // 关闭加载状态
        loading.value = false;
      });
  });
};
</script>

<style></style>