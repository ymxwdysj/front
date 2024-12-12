import axios from 'axios';

<!-- 该文件用于实现JWT 请参考接口文档选择是否调用 -->

// 创建 axios 实例
const api = axios.create({
    baseURL: 'http://127.0.0.1:5173/api/',
    timeout: 5000,
});

// 请求拦截器：每次请求时自动加上 JWT token
api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器：处理 401 错误（token过期），并使用 refresh token 获取新的 access token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response && error.response.status === 401) {
            // 获取 refresh token
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    // 使用 refresh token 刷新 access token
                    const refreshResponse = await axios.post('http://127.0.0.1:5173/api/token/refresh/', { refresh: refreshToken });

                    const { access } = refreshResponse.data;  // 获取新的 access token

                    // 存储新的 access token
                    localStorage.setItem('access_token', access);

                    // 重试失败的请求
                    error.config.headers['Authorization'] = `Bearer ${access}`;
                    return axios(error.config);
                } catch (refreshError) {
                    // refresh token 失效，跳转到登录页面
                    console.error('Refresh token 失效，需重新登录');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login'; // 或者使用 Vue Router 跳转
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
