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
                            <el-tag type="success" closable @close="handleClose(tag)">购物车</el-tag>
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </template>
            </el-page-header>
            <!-- 页头结束 -->

            <!-- 购物车表格开始 -->
            <div id="car-candylist">
                <el-table ref="NowCartchoosRef" :data="cartList" @selection-change="handleCartChange"
                    style="width: 100%">
                    <!-- <el-table-column type="selection" :selectable="selectable" width="100" /> -->

                    <el-table-column prop="candys.id" label="商品ID" width="100">
                        <template #default="scope">
                            <el-popover effect="light" trigger="hover" placement="top" width="auto">
                                <template #default>
                                    <p class="font-bold text-pink-400">商品名称:</p>
                                    <el-text class="font-bold text-xs">{{ scope.row.candys.id }}</el-text>
                                </template>
                                <template #reference>
                                    <el-tag size="large" :type="randomTagType">
                                        <el-text :type="randomTagType" class="font-bold" style="width: 50px" truncated>
                                            {{ scope.row.candys.id }}
                                        </el-text>
                                    </el-tag>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <el-table-column label="商品名称" width="200">
                        <template #default="scope">
                            <el-popover effect="light" trigger="hover" placement="top" width="auto">
                                <template #default>
                                    <p class="font-bold text-pink-400">商品名称:</p>
                                    <el-text class="font-bold text-xs">{{ scope.row.candys.name }}</el-text>
                                    <p class="font-bold text-pink-400">商品介绍:</p>
                                    <el-text class="font-bold text-xs">{{ scope.row.candys.comment }}</el-text>
                                </template>
                                <template #reference>
                                    <el-tag size="large" :type="randomTagType">
                                        <el-text :type="randomTagType" class="font-bold" style="width: 120px" truncated>
                                            {{ scope.row.candys.name }}
                                        </el-text>
                                    </el-tag>
                                </template>
                            </el-popover>
                        </template>
                    </el-table-column>

                    <el-table-column label="商品图片" width="200">
                        <template #default="scope">
                            <el-image :src="scope.row.candys.imguid" style="width: 100px; height: 100px;">
                                <template #error>
                                    <div class="image-slot">
                                        <el-icon>
                                            <Picture />
                                        </el-icon>
                                    </div>
                                </template>
                            </el-image>
                        </template>
                    </el-table-column>

                    <el-table-column label="重量/份" width="160">
                        <template #default="scope">
                            <el-text size="large" class="font-bold">{{ scope.row.candys.kgs }}g</el-text>
                        </template>
                    </el-table-column>

                    <el-table-column label="价格/份" width="160">
                        <template #default="scope">
                            <el-text size="large" style="font-size: 22px;" class="font-bold text-red-400">￥{{
                                scope.row.buyPrice }}</el-text>
                        </template>
                    </el-table-column>

                    <el-table-column label="数量" width="240">
                        <template #default="scope">
                            <el-input-number v-model="scope.row.buyNum" size="large" :min="1" @change="NumChange"
                                style="width: 140px; " />
                        </template>
                    </el-table-column>

                    <el-table-column label="金额" width="160">
                        <template #default="scope">
                            <el-text size="large" style="font-size: 22px;" class="font-bold text-red-400">
                                ￥{{ scope.row.buyPrice * scope.row.buyNum }}
                            </el-text>
                        </template>
                    </el-table-column>

                    <el-table-column label="操作" width="80">
                        <template #default="scope">
                            <el-button circle size="large" type="danger" @click="deleteCart(scope.row)">
                                <el-icon size="large">
                                    <DeleteFilled />
                                </el-icon>
                            </el-button>
                        </template>
                    </el-table-column>

                </el-table>

                <div style="width: 100%; height: 60px; border-bottom: 1px solid #eceef4;">
                    <div style="position: absolute; right: 0;margin-right: 220px;display: flex;margin-top: 18px;">
                        <p style="margin-right: 10px;">合计:</p>
                        <el-text class="text-red-500" style="font-weight: 600; letter-spacing: 3px; font-size: 24px;
                    margin-top: -6px;">
                            ￥{{ totalAmount }}</el-text>
                    </div>

                    <el-button @click="diaOrder = true" size="large" type="danger" style="position: absolute; right: 0; margin-right: 5%;
                     font-weight: 600; letter-spacing: 3px; font-size: 16px; margin-top: 10px;">
                        立即下单
                    </el-button>
                </div>
            </div>
            <!-- 购物车表格结束 -->

            <!-- 订单确认页面开始 -->
            <el-dialog v-model="diaOrder" title="确认订单" width="500">
                <el-form ref="OrderRef" :model="Atuserinfo" label-width="auto">
                    <el-form-item label="总金额：">
                        <p class=" text-red-500 font-bold">￥{{ totalAmount }}</p>
                    </el-form-item>
                    <el-form-item label="收货人：">
                        <el-input v-model="Atuserinfo.username" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="联系电话：">
                        <el-input v-model="Atuserinfo.telephone" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="收货地址：">
                        <el-input v-model="Atuserinfo.address" type="textarea" placeholder="请输入收货地址" />
                    </el-form-item>
                </el-form>
                <template #footer>
                    <div class="dialog-footer">
                        <el-button @click="diaOrder = false">取消</el-button>
                        <el-button type="danger" @click="AddToOrder">
                            确定订单
                        </el-button>
                    </div>
                </template>
            </el-dialog>
            <!-- 订单确认页面结束 -->




            <!-- 回到顶部 -->
            <el-backtop :right="100" :bottom="100" />

        </div>
    </el-row>
</template>

<script setup>
import { ref, onMounted, computed, toRaw } from 'vue';
import { useRouter } from 'vue-router';
import { createOrder, delToCart, getcarts } from "../../../api/manager";
import { msgla } from '../../../composables/util';

const router = useRouter();
const cartList = ref([]);  // 购物车列表
const showProgress = ref(true);  // 控制进度条的显示与隐藏
const totalItems = ref(0);  // 总商品数量
const currentPage = ref(1);  // 当前页
const pageSize = ref(4);  // 每页商品数量
const buyNum = ref(1);  //默认buyNum为1
const selectedItems = ref([]);  // 选中的商品列表
const diaOrder = ref(false);
const OrderRef = ref(null);
const Atuserinfo = ref({});

//颜色配置
const tags = ref([
    { type: 'primary' },
    { type: 'success' },
    { type: 'info' },
    { type: 'warning' },
    { type: 'danger' },
])



// 获取随机标签类型的方法
const getRandomTagType = () => {
    const randomIndex = Math.floor(Math.random() * tags.value.length);
    return tags.value[randomIndex].type;
};

// 如果需要每个标签类型保持一致（例如页面加载后不再改变），可以使用 computed 属性
const randomTagType = computed(() => getRandomTagType());

// 组件挂载后执行的函数，初始化商品列表
onMounted(() => {
    fetchCartList(currentPage.value, pageSize.value);

    const AtuserinfoStr = sessionStorage.getItem("Atuserinfo");
    if (AtuserinfoStr) {
        try {
            const user = JSON.parse(AtuserinfoStr);
            Atuserinfo.value = user; // 更新响应式数据
        } catch (error) {
            console.error('无法从 sessionStorage 解析 Atuserinfo：', error);
        }
    }
});

// 获取购物车列表数据
const fetchCartList = (pageNum, pageSize) => {
    showProgress.value = true;
    getcarts(pageNum, pageSize)
        .then((res) => {
            cartList.value = res.data.list;
            totalItems.value = res.data.total;
            showProgress.value = false;
        })
        .catch((err) => {
            // console.error(err);
            showProgress.value = false;
        });
    // console.log("Current Page: ", pageNum);
    // console.log("Page Size: ", pageSize);

};


// 删除购物车中的指定商品
const deleteCart = (item) => {
    console.log("Item to delete: ", item);  // 打印删除的商品数据
    if (!item) {
        msgla("待删除商品信息不存在");
        return;
    }

    // 创建 idArr 数组（如果后端需要的是数组格式）
    const idArr = [item.candys.id];  // 传递一个包含商品 ID 的数组
    console.log("ID array: ", idArr);  // 打印 ID 数组

    // 调用删除接口
    delToCart(idArr)
        .then((res) => {
            if (res.code === 200) {
                msgla(res.msg);

                // 从商品列表移除
                const index = cartList.value.findIndex((candy) => candy.id === item.id);
                if (index !== -1) {
                    cartList.value.splice(index, 1);
                }
                fetchCartList(currentPage.value, pageSize.value);
            } else {
                msgla(res.msg, "error");
            }
        })
        .catch((err) => {
            msgla("删除失败: " + err.message, "error");
        });
};



// 选择变化的处理函数
const handleCartChange = (selection) => {
    selectedItems.value = selection; // 更新选中的商品列表
};

// 计算合计金额，只计算选中的商品
// const totalAmount = computed(() => {
//     return selectedItems.value.reduce((total, item) => total + item.buyNum * item.buyPrice, 0);
// });
// 计算合计金额
const totalAmount = computed(() => {
  return cartList.value.reduce((total, item) => {
    return total + (item.buyNum * item.buyPrice);
  }, 0).toFixed(2); // 确保金额保留两位小数
});

// const money = computed(() => {
//     return (AddCartCandy.value.price * buyNum.value);
// });

//标签关闭
const handleClose = () => {
    router.push('index');
}


// 返回按钮点击事件处理
const onBack = () => {
    router.push('index');
};


//购买数量计数
const NumChange = (value) => {
    if (buyNum.value <= 0) {
        buyNum.value = 1;
    }
}

// 确认订单并保存数据
const AddToOrder = () => {
    // 验证表单
    OrderRef.value.validate((valid) => {
        if (!valid) {
            return false; // 如果表单验证不通过，则阻止提交
        }
        const orderdata = toRaw(Atuserinfo.value)
        // console.log("数据orderdata:", orderdata);

        const order = {
            receiverName: orderdata.username,
            receiverPhone: orderdata.telephone,
            receiverAddress: orderdata.address
        };

        // console.log("数据orderdata:", order);

        createOrder(order)
            .then(() => {
                if(res.code === 200){
                    msgla(res.msg)
                    diaOrder.value = false;
                }if(res.code === 401){
                    msgla(res.msg,"error")
                }if(res.code === 402){
                    msgla(res.msg,"error")
                }
            })
            .catch((err) => {
            msgla(err.message, "error");
        });

    });
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

.drwaerboxit {
    display: flex;
    align-items: center;
}

.horizontal-form {
    display: flex;
    align-items: flex-start;
}

.table-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px;
    background-color: #f5f7fa;
    border-top: 1px solid #dcdfe6;
}
</style>