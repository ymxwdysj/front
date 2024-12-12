import { createApp } from 'vue';  // Vue 3 使用 createApp
import App from './App.vue';
import router from './router';    // 引入路由
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
createApp(App)
    .use(router)  // 使用 Vue Router
    .use(ElementPlus)
    .mount('#app');
