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
                    <el-input v-model="inputsearch" style="width: 240px" placeholder="请输入商品" :prefix-icon="'Search'" />
                    <el-button type="primary" @click="handleSearch">搜索</el-button>
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
                                    <el-button circle color="#f1a03a" style="margin-left: 50px"
                                        @click.stop="FastSaveCart(item)">
                                        <el-icon :size="20" style="margin-left: -1px; color: white;">
                                            <ShoppingCart />
                                        </el-icon>
                                    </el-button>
                                </el-tooltip>
                            </el-badge>


                            <el-button style="margin-top: 8px; width: 66.5px; font-weight: 600; color: white;"
                                color="#ec602a" @click="toBuy">立即购买</el-button>
                        </div>
                        <el-text>剩余：</el-text>
                        <el-text :style="{ color: item.num < 50 ? 'red' : '#6c6e71' }">{{ item.num }}</el-text>

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
                                <el-text style="letter-spacing: 3px;" class="font-bold">品类:{{ AddCartCandy.category
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
                            <el-text class="font-bold"
                                style="font-size: 15px; letter-spacing: 3px;">克重:</el-text><br /><br>
                            <el-radio size="large" border>均克</el-radio><br />
                            <div style="margin-top: 30px;">
                                <el-input-number v-model="buyNum" size="large" :min="1" @change="NumChange"
                                    style="width: 140px; " />
                            </div>
                            <el-button color="#f1a03a" class="font-bold" round size="large"
                                style="margin-top: 30px; color: white; font-size: 17px; width: 120px;"
                                @click="saveCart(AddCartCandy)">加入购物车</el-button>
                            <el-button color="#ec602a" class="font-bold" round size="large"
                                style="margin-top: 30px; color: white; font-size: 17px; width: 120px;">立即购买</el-button>
                        </div>
                    </div>
                </div>
            </el-drawer>
        </el-form>
        <!-- 加入购物车抽屉结束 -->

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
import { ref, onMounted, computed, watch, } from 'vue';
import { useRouter } from 'vue-router';
import { addToCart, getcandy, getcandyByname, getcarts } from "../../../api/manager";
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


// 组件挂载后执行的函数，初始化商品列表
onMounted(() => {
    fetchCandyList(currentPage.value, pageSize.value);
    fetchCartList();
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

// 获取购物车数据
const fetchCartList = () => {
    getcarts()
        .then((res) => {
            cartit.value = res.data.list;  // 更新购物车数据
        })
        .catch((err) => {
            console.error(err);
        });
};

// 监听购物车数据的变化
watch(cartit, (newCart) => {
    // 当购物车更新时，重新计算或更新相关的视图
    console.log('购物车更新:', newCart);
});

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