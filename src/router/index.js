import { createRouter, createWebHistory } from 'vue-router'; // Vue 3 的方式导入
import Login from '@/views/Login.vue';
import AdminLogin from '@/views/AdminLogin.vue';
import Register from '../views/Register.vue';
import UserProfile from '../views/UserProfile.vue'; // 引入 UserProfile.vue
import ChooseSubject from '@/views/ChooseSubject.vue';
import KnowledgeList from '@/views/KnowledgeList.vue'; // 素材列表页面
import WelcomePage from '@/views/WelcomePage.vue';
import VisitorPage from "@/views/VisitorPage.vue";
import Search    from "@/views/Search.vue";
import TempPage from "@/views/TempPage.vue";
const routes = [
    {
        path: '/',
        name: 'welcome',
        component: WelcomePage
    },
    {
        path: '/admin-login',
        name: 'admin-login',
        component: AdminLogin
    },
    {
        path: '/temp-page',
        name: 'temp-page',
        component: TempPage
    },
    {
        path: '/visitor',
        name: 'visitor',
        component: VisitorPage
    },
    {
        path: '/user-login',
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
      path: '/search',
      name: 'search',
      component: Search,
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
