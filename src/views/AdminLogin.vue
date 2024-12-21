<template>
  <div class="login-container">
    <!-- 背景效果（添加圆形图案） -->
    <div class="background">
      <div class="shape"></div>
      <div class="shape"></div>
    </div>
    <!-- 登录框 -->
    <div class="login-box">
      <h1>管理员登录</h1>
      <el-form ref="form" :model="form" @submit.prevent="handleLogin" class="login-form">
        <el-form-item label="账号" class="form-item">
          <el-input
              v-model="form.username"
              autocomplete="off"
              placeholder="请输入账号"
              prefix-icon="el-icon-user"
              class="login-input">
          </el-input>
        </el-form-item>
        <el-form-item label="密码" class="form-item">
          <el-input
              v-model="form.password"
              type="password"
              autocomplete="off"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              class="login-input">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
              type="primary"
              class="login-button"
              @click="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <!-- 按钮区域 -->
      <div class="button-group">
        <el-button
            type="text"
            class="back-button"
            @click="goBack">
          返回
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: '',
        loginTime: ''
      }
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('http://127.0.0.1:5173/api/login/', {
          username: this.form.username,
          password: this.form.password
        });
        const { access, refresh } = response.data;
        this.form.loginTime = new Date().getTime();
        localStorage.setItem('user', JSON.stringify(this.form));
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        this.$router.push({ name: 'temp-page' });
      } catch (error) {
        this.$message.error('用户名或密码错误');
      }
    },
    goBack() {
      this.$router.push({name: 'welcome'});
    }
  }
};
</script>

<style scoped>
/* 通用样式重置 */
*,
*:before,
*:after {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

/* 页面背景样式 */
body {
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  font-family: 'Poppins', sans-serif;
  height: 100vh; /* 视口高度 */
  margin: 0; /* 清除默认 margin */
  display: flex; /* 使用 flexbox 布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  position: relative;
}

/* 背景效果（添加圆形图案） */
.background {
  position: absolute; /* 使用绝对定位放在背景层 */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 确保它在中心 */
  width: 430px;
  height: 520px;
  z-index: -1; /* 背景层 */
}

.background .shape {
  height: 200px;
  width: 200px;
  position: absolute;
  border-radius: 50%;
}

.shape:first-child {
  background: linear-gradient(#1845ad, #23a2f6);
  left: -80px;
  top: -80px;
}

.shape:last-child {
  background: linear-gradient(to right, #ff512f, #f09819);
  right: -30px;
  bottom: -80px;
}

/* 登录框样式 */
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh; /* 确保占满整个视口 */
  position: relative;
}

.login-box {
  background: rgba(255, 255, 255, 0.13); /* 半透明背景 */
  padding: 40px 35px;
  border-radius: 10px;
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6); /* 阴影效果 */
  backdrop-filter: blur(10px); /* 背景模糊 */
  width: 100%;
  max-width: 450px;
  text-align: center;
  z-index: 2;
  /* 为了确保 login-box 在 flex 中能够居中 */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 32px; /* 增大字体 */
  color: #000; /* 修改标题颜色为黑色 */
  font-weight: 500; /* 适当提高字体粗细 */
  margin-bottom: 30px;
}

/* 输入框样式 */
:deep .el-input__inner {
  background-color: rgba(255, 255, 255, 0.07); /* 半透明背景 */
  color: #080710;
  border-radius: 3px;
  font-size: 14px;
  height: 50px; /* 确保高度与登录按钮一致 */
  padding: 0 10px; /* 内边距与按钮一致 */
  box-sizing: border-box; /* 确保 padding 不影响高度 */
  line-height: 50px; /* 确保文字垂直居中 */
  width: 100%; /* 宽度100% */
  border: 1px solid #fff; /* 设置边框颜色 */
}

/* 登录按钮样式 */
.login-button {
  background-color: #ffffff;
  color: #080710;
  font-weight: bold;
  transition: background-color 0.3s ease;
  width: 100%;
  height: 50px; /* 与输入框一致的高度 */
  border-radius: 5px;
  margin-top: 30px;
}

.login-button:hover {
  background-color: #6a11cb;
  color: #ffffff;
}

.login-button:active {
  background-color: #5a10b6;
}

/* 按钮区域 */
.button-group {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 15px;
}

/* 返回按钮样式 */
.back-button {
  background-color: #ffffff;
  color: #080710;
  font-weight: bold;
  width: 100%;
  height: 50px; /* 与输入框一致的高度 */
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

:deep(.back-button:hover) {
  background-color: #6a11cb;
  color: #ffffff;
}

.back-button:active {
  background-color: #5a10b6;
}
</style>
