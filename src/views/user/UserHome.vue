<template>
    <div class="common-layout">
        <el-container>
            <!-- 顶栏 -->
            <el-header>
                <el-menu router :default-active="activeIndex" class="el-menu-demo" mode="horizontal" :ellipsis="false"
                    @select="handleSelect">
                    <el-menu-item index="0">
                        <img style="width: 60px; height: 60;margin-left: 20px;" src="/src/static/icon/candy.png"
                            alt="Element logo" />
                    </el-menu-item>
                    <el-text class="text-xl" style="margin-left: 5%;">欢迎您:&nbsp;&nbsp;{{ Atuserinfo.username
                        }}</el-text>

                    <div style="position: absolute; right: 0; margin-top: 3px; margin-right: 20px;">
                        <el-popover :width="300"
                            popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;">
                            <template #reference>
                                <el-avatar :src="Atuserinfo.imguid" />
                            </template>
                            <template #default>
                                <div style="display: flex; gap: 16px; flex-direction: column">
                                    <el-avatar :size="60" :src="Atuserinfo.imguid"
                                        style="margin: auto; margin-bottom: 8px; cursor: pointer; "
                                        @click="goToUserList" />
                                    <div>
                                        <p style="margin: 0; font-weight: 500">
                                            用户名:{{ Atuserinfo.username }}
                                        </p>
                                        <p style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                                            邮箱:{{ Atuserinfo.email }}
                                        </p>
                                        <p style="margin: 0; font-size: 14px; color: var(--el-color-info)">
                                            手机号码:{{ Atuserinfo.telephone }}
                                        </p>
                                    </div>
                                    <p style="margin: 0">
                                        我的简介:{{ Atuserinfo.introduce }}
                                    </p>
                                    <el-button @click="Logout" style="margin-left: 15px;">登出</el-button>
                                    <el-button plain @click="centerDialogVisible = true" style="margin-left: 15px;"
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
                                <h2 class="text-2xl text-gray-600">网上糖果商城</h2>
                            </div>
                            <el-menu router :default-active="index" class="el-menu-vertical-demo">
                                <el-menu-item index='index'>
                                    <el-icon>
                                        <House /></el-icon>
                                        <span>首页</span>
                                </el-menu-item>
                                <el-menu-item index="candylistu">
                                    <el-icon>
                                        <ShoppingBag />
                                    </el-icon>
                                    <span>商品列表</span>
                                </el-menu-item>
                                <el-menu-item index="cartlist">
                                    <el-icon>
                                        <ShoppingCart />
                                    </el-icon>
                                    <span>购物车</span>
                                </el-menu-item>
                                <el-menu-item index="???">
                                    <el-icon>
                                        <Tickets />
                                    </el-icon>
                                    <span>我的订单</span>
                                </el-menu-item>
                            </el-menu>
                        </el-col>
                    </el-row>
                </el-aside>

                <el-container>
                    <el-main style="height: 100%;">
                        <router-view></router-view>
                    </el-main>
                </el-container>
            </el-container>

            <!-- 注销弹出框开始 -->
            <el-dialog v-model="centerDialogVisible" title="Warning" width="500" center>
                <span>
                    注销账号操作不可逆，是否继续？
                </span>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="centerDialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="deuser">
                            继续
                        </el-button>
                    </div>
                </template>
            </el-dialog>
            <!-- 注销弹出框结束 -->

        </el-container>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { removeToken } from '../../composables/auth';
import { useRouter } from "vue-router";
import { deleteUser } from '../../api/manager';
import { msgla, msgls } from '../../composables/util';

const centerDialogVisible = ref(false)
const activeIndex = ref("index");
const handleSelect = (index) => {
    activeIndex.value = index
}
// 从 sessionStorage 中读取 JSON 字符串并解析为对象
const AtuserinfoStr = sessionStorage.getItem("Atuserinfo");

let Atuserinfo = null;

if (AtuserinfoStr) {
    try {
        Atuserinfo = JSON.parse(AtuserinfoStr);
        console.log('User Info:', Atuserinfo);
    } catch (error) {
        console.error('无法从sessionStorage解析Atuserinfo：', error);
    }
} else {
    console.log('在sessionStorage中找不到Atuserinfo。');
}

// 获取 router 实例
const router = useRouter()

// 跳转到用户列表页面
const goToUserList = () => {
    router.push('/admin/userlist')
}

// 登出方法
const Logout = () => {
    // 清除 cookie 中的 user-token
    removeToken() // 确保调用 removeToken()

    // 清除 sessionStorage 中存储的信息
    sessionStorage.removeItem('Atuserinfo')

    msgls("登出成功");

    // 跳转到登录页面
    router.push('/login')
}

//注销方法
const deuser = async () => {
    // 获取用户信息
    const id = Atuserinfo.id;
    if (!id) {
        console.error("用户 ID 不存在");
        msgla("用户 ID 无效", "error");
        return;
    }

    try {
        // 调用注销接口
        const res = await deleteUser(id);
        if (res.code === 200) {
            console.log("状态码:", res.code, "提示:", res.msg);
            msgla(res.msg); // 成功提示
            centerDialogVisible.value = false;
        } else {
            console.warn("状态码:", res.code, "提示:", res.msg);
            msgls(res.msg, "error");
            return;
        }
    } catch (error) {
        console.error("注销用户时发生错误:", error);
        msgls("注销失败，请稍后再试", "error");
        return;
    }

    // 清除用户信息
    removeToken();
    sessionStorage.removeItem("Atuserinfo");


    // 跳转到登录页面
    router.push("/login");
};

</script>

<style scoped></style>