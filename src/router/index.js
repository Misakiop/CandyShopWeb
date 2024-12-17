import { createRouter, createWebHistory } from "vue-router";
import Error from '../views/utils/404.vue';  
import Forbidden from '../views/utils/403.vue';

// index
import Login from '../views/Login.vue'
import Regist from "../views/Regist.vue";
import Index from '../views/admin/menu/index.vue'

// 管理员
import Adminhome from '../views/admin/AdminHome.vue';
import CandyList from "../views/admin/menu/CandyList.vue";
import UserList from "../views/admin/menu/UserList.vue";

// 用户
import UserHome from "../views/user/UserHome.vue";
import CandyListU from "../views/user/menu/CandyListU.vue";
import CartList from "../views/user/menu/CartList.vue";
import OrderListU from "../views/user/menu/OrderListU.vue"

const routes = [
    {
        path: '/admin',
        name: 'adminhome',
        component: Adminhome,
        redirect:'candylist',
        children: [
            // 子路由的path应该以'/'开始，但是不需要包含父级路径
            {
                path: 'candylist', 
                meta: { title: "商品列表" },
                component: CandyList
            },
            {
                path: 'index',
                component: Index
            },
            {
                path:'userlist',
                meta:{title:"用户列表"},
                component: UserList
            },
        ]
    },
    {
        path: '/user',
        name: 'userhome',
        component: UserHome,
        redirect:'candylist',
        children: [
            // 子路由的path应该以'/'开始，但是不需要包含父级路径
            {
                path: 'candylistu', 
                meta: { title: "商品列表" },
                component: CandyListU
            },
            {
                path: 'index',
                component: Index
            },
            {
                path: 'cartlist', 
                meta: { title: "购物车列表" },
                component: CartList
            },
            {
                path: 'orderlistu', 
                meta: { title: "订单列表" },
                component: OrderListU
            },
        ]
    },
    {
        path: '/login',
        meta: { title: "登录页面" },
        component: Login
    },
    {
        path: '/',
        meta: { title: "登录页面" },
        component: Login
    },
    {
        path: '/regist',
        meta: { title: "注册页面" },
        component: Regist
    },
    {
        path: '/404',
        meta: { title: "页面走丢了" },
        component: Error
    },
    {
        path: '/403',
        meta: { title: "没有权限" },
        component: Forbidden
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;