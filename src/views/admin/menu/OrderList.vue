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
                            <el-tag type="success" closable @close="handleClose(tag)">我的订单</el-tag>
                        </el-breadcrumb-item>
                    </el-breadcrumb>

                </template>
                <template #content>
                    <div class="search">
                        <el-tooltip class="box-item" effect="light" content="刷新" placement="top">
                            <el-button @click="Reload" class="bg-pink-500" circle><el-icon color="white"
                                    style="font-size: 20px;">
                                    <Refresh />
                                </el-icon></el-button></el-tooltip>
                    </div>
                </template>
                <el-descriptions :column="3" size="small" class="mt-4"></el-descriptions>
            </el-page-header>
            <!-- 页头结束 -->

            <!-- 订单列表 -->
            <div>
                <el-table :data="orderList" stripe style="width: 100%; display: flex; justify-content: center;">
                    <el-table-column prop="id" label="订单ID" width="200">
                        <template #default="scope">
                            <el-popover effect="light" trigger="hover" placement="top" width="auto">
                                <template #default>
                                    <p class="font-bold">ID:</p>
                                    <el-text class="font-bold text-xs">{{ scope.row.id }}</el-text>
                                </template>
                                <template #reference>
                                    <el-text class="font-bold" style="width: 200px" truncated>
                                        {{ scope.row.id }}
                                    </el-text>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <el-table-column prop="receiverName" label="收件人" width="100" />

                    <el-table-column prop="receiverPhone" label="联系电话" width="150" />

                    <el-table-column prop="receiverAddress" label="收货地址" width="100">
                        <template #default="scope">
                            <el-popover effect="light" trigger="hover" placement="top" width="auto">
                                <template #default>
                                    <p class="font-bold">地址:</p>
                                    <el-text class="font-bold text-xs">{{ scope.row.receiverAddress }}</el-text>
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

                    <el-table-column label="订单状态" width="150">
                        <template #default="scope">
                            <el-tag :type="scope.row.orderState === 0 ? 'warning' : 'success'">
                                {{ scope.row.orderState === 0 ? '待处理' : '已完成' }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="支付状态" width="150">
                        <template #default="scope">
                            <el-tag :type="scope.row.payState === 0 ? 'danger' : 'success'">
                                {{ scope.row.payState === 0 ? '未支付' : '已支付' }}
                            </el-tag>
                        </template>
                    </el-table-column>

                    <el-table-column label="订单金额" width="150">
                        <template #default="scope">
                            ￥{{ scope.row.money }}
                        </template>
                    </el-table-column>

                    <el-table-column prop="orderTime" label="下单时间" width="200">
                        <template #default="scope">
                            {{ scope.row.orderTime ? new Date(scope.row.orderTime).toLocaleString() : '未知' }}
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="80">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="light" content="发货" placement="top">
                                <el-button class="bg-pink-500" circle @click="RunOrder(scope.row)">
                                    <el-icon color="white" size="large">
                                        <Promotion />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>

                    <el-table-column width="80">
                        <template #default="scope">
                            <el-tooltip class="box-item" effect="light" content="删除" placement="top">
                                <el-button type="warning" circle @click="DelOrder(scope.row)">
                                    <el-icon size="large">
                                        <Delete />
                                    </el-icon>
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- 订单结束 -->

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
import { ref, onMounted, } from 'vue';
import { useRouter } from 'vue-router';
import { deleteOrder, getAllOrders, updateOrder, } from "../../../api/manager";
import { msgla } from "../../../composables/util";

const router = useRouter();
const orderList = ref([]); // 订单列表数据
const showProgress = ref(true);
const totalItems = ref(0);  // 总订单数量
const currentPage = ref(1);  // 当前页
const pageSize = ref(10);  // 每页订单数量
const currentItemToDelete = ref(null); // 当前待删除商品



// 组件挂载后执行的函数
onMounted(() => {
    fetchOrderList(currentPage.value, pageSize.value);

});

// 获取订单列表数据
const fetchOrderList = (pageNum, pageSize) => {
    showProgress.value = true;

    // 获取订单数据
    getAllOrders(pageNum, pageSize)
        .then((res) => {
            orderList.value = res.data.list;
            totalItems.value = res.data.total;
            showProgress.value = false;

            console.log(orderList.value)
        })
        .catch((err) => {
            console.error(err);
            showProgress.value = false;
        });

    // console.log("Current Page: ", pageNum);
    // console.log("Page Size: ", pageSize);
};


// 标签关闭
const handleClose = () => {
    router.push('index');
};

// 分页变化时的处理函数
const handlePageChange = (page) => {
    currentPage.value = page;
    fetchOrderList(currentPage.value, pageSize.value);
};

// 返回按钮点击事件处理
const onBack = () => {
    router.push('index');
};

//发货
const RunOrder = (item) => {
    const orderData = {
        id: item.id,
        orderState: 1,
        money: item.money
    };

    // console.log("数据",orderData)

    updateOrder(orderData)
        .then((res) => {
            if (res.code === 200) {
                console.log("状态码:", res.code, "提示:", res.msg);
                msgla('商品发货成功');
                fetchOrderList();
            } else if (res.code === 400) {
                console.log("状态码:", res.code, "提示:", res.msg);
                console.error('服务器未返回有效数据:', res);
                msgla('发货失败', "error");
            } else {
                console.error("未处理的响应码:", res.code);
                msgla('未知错误', "error");
            }
        })
        .catch((error) => {
            console.error("请求失败:", error);
            msgla('请求失败，请稍后再试', "error");
        });
};

//删除订单
// 删除商品
const DelOrder = (item) => {
    currentItemToDelete.value = item;
    if (!currentItemToDelete.value) {
        msgla("待删除商品信息不存在");
        return;
    }

    deleteOrder(currentItemToDelete.value.id)
        .then((res) => {
            if (res.code === 200) {
                msgla("商品删除成功");

                // 从商品列表移除
                const index = orderList.value.findIndex((order) => order.id === currentItemToDelete.value.id);
                if (index !== -1) {
                    orderList.value.splice(index, 1);
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

const Reload = () => {
    fetchOrderList();
}
</script>
