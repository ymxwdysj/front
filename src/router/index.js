import { createRouter, createWebHistory } from 'vue-router'; // Vue 3 的方式导入
import Login from '@/components/Login.vue';
import Register from '../components/Register.vue';
import UserProfile from '../components/UserProfile.vue'; // 引入 UserProfile.vue
import ChooseSubject from '@/components/ChooseSubject.vue';
import KnowledgeList from '@/components/KnowledgeList.vue'; // 素材列表页面
const routes = [
    {
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',   // 注册路由
        component: Register
    },
    {
        path: '/user-profile',
        name: 'user-profile',
        component: UserProfile // 用户信息页面
    },
    {
        path: '/choose-subject',
        name: 'choose-subject',
        component: ChooseSubject,
    },
    {
        path: '/knowledge-list', // 使用动态路由参数 category
        name: 'knowledge-list',
        component: KnowledgeList,
        props: (route) => ({ category: route.query.category })
    },

];

// 使用 Vue 3 的 createRouter 方法创建路由实例
const router = createRouter({
    history: createWebHistory(), // Vue Router 3.x+ 的 history 模式
    routes
});
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('user'); // 检查是否已登录

    // 如果目标页面需要登录且用户未登录，跳转到登录页面
    if (to.meta.requiresAuth && !isAuthenticated) {
        next({ name: 'login' });  // 强制跳转到登录页面
    } else {
        next();  // 允许访问目标页面
    }
});

export default router;
