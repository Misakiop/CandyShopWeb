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
                    <el-input v-model="inputsearch" style="width: 240px" placeholder="请输入商品" :prefix-icon="'Search'"
                        clearable />
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
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
                    <el-card style="max-width: 400px; margin-bottom: 15px;" shadow="hover" @click="AddCart(item)">
                        <!-- 使用动态绑定的图片 -->
                        <el-image :src="item.imguid || 'http://121.40.60.41:8008/1.jpg'"
                            style="width: 100%; height: 200px;">
                            <template #error>
                                <div class="image-slot">
                                    <el-icon>
                                        <Picture />
                                    </el-icon>
                                </div>
                            </template>
                        </el-image>

                        <el-text line-clamp="2" class="mx-1 font-bold" style=" margin-top: 5px;">{{ item.name
                            }}</el-text>
                        <div class="drwaerboxit" style="margin-top: 5px;">
                            <el-text class="mx-1 font-bold text-xl text-red-500 text-l" style="margin-right: 15px;">
                                ￥{{ item.price }}
                            </el-text>


                            <el-badge :value="getCartItemQuantity(item.id)" class="item" :show-zero="false"
                                :offset="[1, 2]">
                                <el-tooltip effect="dark" content="加入购物车" placement="bottom">
                                    <el-button circle color="#f1a03a" size="large" style="margin-left: 130px;"
                                        @click.stop="FastSaveCart(item)">
                                        <el-icon :size="25" style="margin-left: -1px; margin-top: 3px; color: white;" class="font-extrabold">
                                            <ShoppingCart />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                            </el-badge>

                            <!-- <el-button style="margin-top: 8px; width: 66.5px; font-weight: 600; color: white;"
                                color="#ec602a" @click="toBuy">立即购买</el-button> -->
                        </div>
                        <el-text>剩余：</el-text>
                        <el-text :style="{ color: item.num < 50 ? 'red' : '#6c6e71' }">{{ item.num }}</el-text>
                        <div style="display: flex;align-items: flex-start;">
                            <el-tag class="bg-pink-500 text-light-600 font-bold" round style="margin-top: 5px;">
                                {{ item.category.name }}
                            </el-tag>
                            <el-tag v-if="item.state !== 0" class="font-bold tracking-widest" effect="dark"
                                style="margin-left: 130px; margin-top: 5px;"
                                :type="item.state === 2 ? 'warning' : 'success'">
                                {{ item.state === 2 ? '缺货' : '安心购' }}
                            </el-tag>
                        </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
        <!-- 商品结束 -->

        <!-- 加入购物车抽屉开始 -->
        <el-form :model="AddCartCandy" ref="addCartRef">
            <el-drawer v-model="visible" :show-close="false" direction="btt" size="410px">
                <template #header="{ close, titleId, titleClass }">
                    <div style="max-width: 95%">
                        <el-text :id="titleId" :class="titleClass" class="font-bold text-2xl"
                            style="margin-left: 45px; max-width: 50%;" line-clamp="2">商品:{{ AddCartCandy.name
                            }}</el-text>
                    </div>
                    <el-button type="danger" @click="close">
                        <el-icon class="el-icon--left">
                            <CircleCloseFilled />
                        </el-icon>
                        关闭
                    </el-button>
                </template>
                <div class="drwaerboxit">
                    <div class="horizontal-form">
                        <el-form-item label="" prop="imguid" style="margin-right: 15px; flex: 1;">
                            <el-image :src="AddCartCandy.imguid" style="width: 200px; height: 200px;">
                                <template #error>
                                    <div class="image-slot">
                                        <el-icon>
                                            <Picture />
                                        </el-icon>
                                    </div>
                                </template>
                            </el-image>
                        </el-form-item>
                        <div style="width: 180px;margin-left: 10px;">
                            <el-form-item prop="price" :label-width="formLabelWidth">
                                <div>
                                    <el-text class="text-red-500 font-extrabold text-x">￥</el-text>
                                    <el-text class="text-red-500 font-extrabold text-3xl">
                                        {{ AddCartCandy.price }}</el-text>
                                </div>
                            </el-form-item>
                            <el-form-item prop="id" :label-width="formLabelWidth" style="margin-top: -20px;">
                                <el-text class="text-xs">编号:{{ AddCartCandy.id }}</el-text>
                            </el-form-item>
                            <el-form-item prop="category" :label-width="formLabelWidth" style="margin-top: 30px;">
                                <el-text style="letter-spacing: 3px;" class="font-bold">品类:{{ AddCartCandy.category.name
                                    }}</el-text>
                            </el-form-item>
                            <el-form-item prop="num" :label-width="formLabelWidth" style="margin-top: 50px;">
                                <el-text>库存:</el-text>
                                <el-text :style="{ color: AddCartCandy.num < 50 ? 'red' : '#6c6e71' }">
                                    {{ AddCartCandy.num }}</el-text>
                            </el-form-item>
                        </div>

                        <el-divider direction="vertical" border-style="solid" style="height: 220px;" />

                        <div style="width: 440px;margin-top: -20px">
                            <el-form-item prop="comment" :label-width="formLabelWidth">
                                <div>
                                    <el-text style="letter-spacing: 3px;" class="font-bold text-xl">商品介绍:</el-text><br>
                                    <el-text line-clamp="12" style="letter-spacing: 3px;"
                                        class="font-bold text-xs">&nbsp;&nbsp;&nbsp;&nbsp;
                                        {{ AddCartCandy.comment }}</el-text>
                                </div>
                            </el-form-item>
                        </div>
                        <div style="width:360px;margin-top: -20px;margin-left: 20px;">
                            <el-text style="letter-spacing: 3px;" class="font-bold text-xl">商品参数:</el-text>
                            <div style="margin-top: 10%;">
                                <el-form-item prop="kgs" :label-width="formLabelWidth" style="margin-top: -10px;">
                                    <el-text style="letter-spacing: 3px;">净&ensp;含&ensp;量:{{ AddCartCandy.kgs
                                        }}g/份</el-text>
                                </el-form-item>
                                <el-form-item prop="size" :label-width="formLabelWidth" style="margin-top: -10px;">
                                    <el-text style="letter-spacing: 3px;">产品尺寸:{{ AddCartCandy.size
                                        }}</el-text>
                                </el-form-item>
                                <el-form-item prop="creationdate" :label-width="formLabelWidth"
                                    style="margin-top: -10px;">
                                    <el-text style="letter-spacing: 3px;">生成日期:{{ AddCartCandy.creationdate
                                        }}</el-text>
                                </el-form-item>
                                <el-form-item prop="creationdate" :label-width="formLabelWidth"
                                    style="margin-top: -10px;">
                                    <el-text style="letter-spacing: 3px;" line-clamp="2">储存方法:{{
                                        AddCartCandy.storagemethod
                                    }}</el-text>
                                </el-form-item>
                            </div>
                        </div>

                        <el-divider direction="vertical" border-style="solid" style="height: 220px;" />
                        <div style="width: 400px; margin-top: -20px; margin-left: 25px;">
                            <el-text class="font-bold" style="font-size: 15px; letter-spacing: 3px;">克重:</el-text>
                            <el-text class="font-bold" style="margin-left: 40%;">合计:</el-text>
                            <br /><br>
                            <el-radio size="large" border>均克</el-radio>
                            <el-text class="font-bold text-red-400" style="margin-left: 23%; font-size: 30px;">
                                ￥{{ money }}</el-text>
                            <br />
                            <div style="margin-top: 30px;">
                                <el-input-number v-model="buyNum" size="large" :min="1" @change="NumChange"
                                    style="width: 140px; " />
                            </div>
                            <el-button color="#f1a03a" class="font-bold" round size="large"
                                style="margin-top: 30px; color: white; font-size: 17px; width: 120px;"
                                @click="saveCart(AddCartCandy)">加入购物车</el-button>
                            <el-button @click="FastsaveCart(AddCartCandy)" color="#ec602a" class="font-bold" round
                                size="large"
                                style="margin-top: 30px;margin-left: 80px; color: white; font-size: 17px; width: 120px; ">立即购买</el-button>
                        </div>
                    </div>
                </div>
            </el-drawer>
        </el-form>
        <!-- 加入购物车抽屉结束 -->

        <!-- 订单确认页面开始 -->
        <!-- <el-dialog v-model="diaOrder" title="确认订单" width="500">
            <el-form ref="OrderRef" :model="addOrderList" label-width="auto">
                <el-form-item label="商品编号：">{{ addOrderList.id }}</el-form-item>
                <el-form-item label="商品名称：">{{ addOrderList.name }}</el-form-item>
                <el-form-item label="商品价格：">{{ addOrderList.price }}</el-form-item>
                <el-form-item label="购买数量：">{{ buyNum }}</el-form-item>
                <el-form-item label="总金额：">
                    <p class=" text-red-500 font-bold">{{ money }}</p>
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
        </el-dialog> -->
        <!-- 订单确认页面结束 -->

        <!-- 回到顶部 -->
        <el-backtop :right="100" :bottom="100" />

        <!-- 页码开始 -->
        <el-footer>
            <div style="display: flex; justify-content:center;">
                <el-pagination background layout="prev, pager, next" :total="totalItems" :current-page="currentPage"
                    :page-size="pageSize" @update:current-page="handlePageChange" />
            </div>
        </el-footer>
        <!-- 页码结束 -->

    </div>
</template>

<script setup>
import { ref, onMounted, computed, watch, toRaw, } from 'vue';
import { useRouter } from 'vue-router';
import { addToCart, createOrder, getcandy, getcandyByname, getcandyUser, getcarts, reloadCandy } from "../../../api/manager";
import { msgla } from '../../../composables/util';

const router = useRouter();
const formLabelWidth = null;
const candyList = ref([]);  // 商品列表
const showProgress = ref(true);  // 控制进度条的显示与隐藏
const totalItems = ref(0);  // 总商品数量
const currentPage = ref(1);  // 当前页
const pageSize = ref(12);  // 每页商品数量
const inputsearch = ref('');  // 搜索框绑定数据
const AddCartCandy = ref({}); //加入购物车表单的数据
const visible = ref(false);  //加入购物车抽屉默认关闭
const addCartRef = ref(null); // 添加购物车绑定数据
const buyNum = ref(1);  //默认buyNum为1
const cartit = ref([]); //购物车数据
// const diaOrder = ref(false);
// const addOrderList = ref({})
// const OrderRef = ref(null);
// const Atuserinfo = ref({});

// 组件挂载后执行的函数，初始化商品列表
onMounted(() => {
    fetchCandyList(currentPage.value, pageSize.value);
    fetchCartList();

    // const AtuserinfoStr = sessionStorage.getItem("Atuserinfo");
    // if (AtuserinfoStr) {
    //     try {
    //         const user = JSON.parse(AtuserinfoStr);
    //         Atuserinfo.value = user; // 更新响应式数据
    //     } catch (error) {
    //         console.error('无法从 sessionStorage 解析 Atuserinfo：', error);
    //     }
    // }
});

const money = computed(() => {
    return (AddCartCandy.value.price * buyNum.value);
});

// 获取商品列表数据
const fetchCandyList = (pageNum, pageSize) => {
    showProgress.value = true;
    getcandyUser(pageNum, pageSize)
        .then((res) => {
            candyList.value = res.data.pageInfo.list;
            totalItems.value = res.data.pageInfo.total;  // 设置总记录数
            showProgress.value = false;
        })
        .catch((err) => {
            console.error(err);
            showProgress.value = false;
        });
    // console.log("Current Page: ", pageNum);
    // console.log("Page Size: ", pageSize);

};

// 获取购物车数据
const fetchCartList = () => {
    getcarts()
        .then((res) => {
            cartit.value = res.data.list;  // 更新购物车数据
        })
        .catch((err) => {
            // console.error(err);
        });
};


// 获取购物车中商品的数量
const getCartItemQuantity = computed(() => (itemId) => {
    const cartItem = cartit.value.find(item => item.candys.id === itemId);
    return cartItem ? cartItem.buyNum : 0;
});



//标签关闭
const handleClose = () => {
    router.push('index');
}


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

// 返回按钮点击事件处理
const onBack = () => {
    router.push('index');
};

//打开添加购物车抽屉
const AddCart = (item) => {
    AddCartCandy.value = { ...item };
    visible.value = true
}

//购买数量计数
const NumChange = (value) => {
    if (buyNum.value <= 0) {
        buyNum.value = 1;
    }
}

//添加到购物车
const saveCart = (item) => {
    if (item.num < buyNum.value) {
        msgla("商品库存不足", "warning")
        return 0;
    }
    const cartItem = {
        pid: item.id,       // 商品 ID
        buyNum: buyNum.value,  // 当前购买数量
        buyPrice: item.price,  // 商品价格
    };

    addToCart(cartItem)
        .then((res) => {
            console.log('完整响应数据:', res); // 打印完整的响应对象
            if (res.code === 200) {
                msgla('加入购物车成功')
                fetchCartList();
            } else {
                console.error('服务器未返回有效数据:', res); // 打印未解析的响应
                msgla('添加失败', "error");
            }
        })
        .catch((error) => {
            console.error('添加购物车请求失败:', error.message || error);
            msgla('请求失败，请稍后重试', "error");
        });

}

//快速添加到购物车
const FastSaveCart = (item) => {
    if (item.num <= 0) {
        msgla("商品库存不足", "warning")
        return 0;
    }
    const cartItem = {
        pid: item.id,           // 商品 ID
        buyNum: 1,              //购买数量
        buyPrice: item.price,   // 商品价格
    };

    addToCart(cartItem)
        .then((res) => {
            console.log('完整响应数据:', res); // 打印完整的响应对象
            if (res.code === 200) {
                msgla('加入购物车成功')
                fetchCartList();
            } else {
                console.error('服务器未返回有效数据:', res); // 打印未解析的响应
                msgla('添加失败', "error");
            }
        })
        .catch((error) => {
            console.error('添加购物车请求失败:', error.message || error);
            msgla('请求失败，请稍后重试', "error");
        });
}

const FastsaveCart = (item) => {
    if (item.num < buyNum.value) {
        msgla("商品库存不足", "warning")
        return 0;
    }
    const cartItem = {
        pid: item.id,       // 商品 ID
        buyNum: buyNum.value,  // 当前购买数量
        buyPrice: item.price,  // 商品价格
    };

    addToCart(cartItem)
        .then((res) => {
            console.log('完整响应数据:', res); // 打印完整的响应对象
            if (res.code === 200) {
                msgla('加入购物车成功')
                router.push('/user/cartlist');
            } else {
                console.error('服务器未返回有效数据:', res); // 打印未解析的响应
                msgla('添加失败', "error");
            }
        })
        .catch((error) => {
            console.error('添加购物车请求失败:', error.message || error);
            msgla('请求失败，请稍后重试', "error");
        });
}

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
}

// // 确认订单窗口
// const addOrder = (row) => {
//     // console.log("选择的商品:", row); // 调试用，确保 row 数据正确
//     addOrderList.value = { ...row }; // 将商品数据赋值给 addOrderList
//     diaOrder.value = true;  // 打开订单确认窗口
// };

// //创建订单
// const AddToOrder = () => {
//     OrderRef.value.validate((valid) => {
//         if (!valid) {
//             return false;  // 如果表单验证不通过，则阻止提交
//         };
//         console.log("addOrderList:",addOrderList)
//         console.log("addOrderListvalue:",addOrderList.value)
//         const orderdata = JSON.parse(JSON.stringify(addOrderList.value));
//         console.log("Json序列化:",orderdata)
//         const ordertoRaw = toRaw(addOrderList.value)
//         console.log("toRaw方法:",ordertoRaw)
//         const order = {
//             receiverName: ordertoRaw.username,
//             receiverPhone: ordertoRaw.telephone,
//             receiverAddress: ordertoRaw.address
//         }

//         console.log("order数据:",order)

//         // createOrder(addOrderList.value)
//     })
// }

</script>

<style scoped>
.search {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 10px;
}

.item {
    margin-top: 10px;
    margin-right: 30px;
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
</style>