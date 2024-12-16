import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import './styles/global.css'
import store from './store';

const app = createApp(App);

//使用Vuex状态管理
app.use(store)

// 使用路由
app.use(router)

// 使用 Element Plus
app.use(ElementPlus)

import 'virtual:windi.css'

import "./permission"

// 全局注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.mount('#app');