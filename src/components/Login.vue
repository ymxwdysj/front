<template>
  <div class="login-container">
    <div class="login-box">
      <h1>登录页面</h1>
      <el-form ref="form" :model="form" @submit.prevent="handleLogin" class="login-form">
        <el-form-item label="账号">
          <el-input
              v-model="form.username"
              autocomplete="off"
              placeholder="请输入账号"
              prefix-icon="el-icon-user">
          </el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input
              v-model="form.password"
              type="password"
              autocomplete="off"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock">
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
      <!-- 注册按钮 -->
      <div class="register-link">
        <span>没有账号？</span>
        <el-button
            type="text"
            class="register-button"
            @click="goToRegister">
          注册
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      form: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    handleLogin() {
      // 登录验证逻辑
      if (this.form.username === 'admin' && this.form.password === '1234') {
        // 登录成功，设置登录状态
        localStorage.setItem('user', JSON.stringify({username: this.form.username}));
        this.$router.push({name: 'choose-subject'}); // 登录成功后跳转到选择科目页面
      } else {
        // 登录失败，显示错误信息
        this.$message.error('用户名或密码错误');
      }
    },
    goToRegister() {
      // 跳转到注册页面
      this.$router.push({name: 'register'});
    }
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(45deg, #6a11cb, #2575fc);
}

.login-box {
  background: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.el-form-item {
  margin-bottom: 20px;
}

.el-input {
  border-radius: 4px;
  background-color: #f9f9f9;
}

.el-button {
  width: 100%;
  height: 40px;
  border-radius: 4px;
}

.login-button {
  background-color: #2575fc;
  color: #fff;
}

.login-button:hover {
  background-color: #6a11cb;
}

.login-button:active {
  background-color: #5a10b6;
}

/* 注册按钮样式 */
.register-link {
  text-align: center;
  margin-top: 10px;
}

.register-button {
  color: #2575fc;
  padding: 0;
}

.register-button:hover {
  text-decoration: underline;
}
</style>
