<template>
    <el-row class="min-h-screen bg-pink-300">
      <el-col :lg="16" :md="12" class="flex items-center justify-center">
        <div>
          <div class="font-bold text-5xl text-light-50 mb-4">欢迎光临</div>
          <div class="text-gray-200 text-sm">
            注册页面
          </div>
        </div>
      </el-col>
      <el-col
        :lg="8"
        :md="12"
        class="bg-light-50 flex items-center justify-center flex-col"
      >
        <h2 class="font-bold text-3xl text-gray-800">欢迎注册</h2>
        <div
          class="flex items-center justify-center my-5 text-gray-300 space-x-2"
        >
          <span class="h-[1px] w-16 bg-gray-200"></span>
          <span>请输入账号密码</span>
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
            <el-input
              type="password"
              v-model="form.password"
              placeholder="请输入密码"
              show-password
              @keyup.enter="onSubmit(ruleFormRef)"
            >
              <template #prefix>
                <el-icon>
                  <lock />
                </el-icon>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              round
              color="#edacd2"
              class="w-[250px]"
              type="primary"
              @click="onSubmit"
              :loading="loading"
              >注册</el-button
            >
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </template>
  
  <script setup>
  import { reactive, ref } from "vue";
  import { regist } from "../api/manager";
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
        message: "密码不能为空",
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
  
      regist(form.username, form.password)
        .then((res) => {
          // 登录成功
          console.log("注册成功:", res);
  
          // 显示成功提示
          msgls(res.msg)
  
          // 路由跳转
          router.push("/login");
  
          // 存储 Cookie
        //   if (res.data.token) {
        //     setToken(res.data.token);
        //   } else {
        //     console.error("Token not found in response data");
        //   }
        
        })
        
        .catch((err) => {
          // 登录失败
          console.error("注册失败:", err);
  
          // 显示错误提示
          msgls(err || "请求失败","error")
  
        })
  
        .finally(() => {
          // 关闭加载状态
          loading.value = false;
        });
    });
  };
  </script>
  
  <style>
  </style>