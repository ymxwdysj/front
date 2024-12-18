<template>
  <div class="register-container">
    <div class="background">
      <div class="shape"></div>
      <div class="shape"></div>
    </div>
    <div class="register-box">
      <h1>注册</h1>
      <el-form :model="form" status-icon label-width="120px" class="register-form">
        <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
          <el-input v-model="form.username" autocomplete="off" class="login-input" />
        </el-form-item>
        <el-form-item label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
          <el-input
              v-model="form.password"
              :type="passwordVisible ? 'text' : 'password'"
              autocomplete="off"
              class="login-input">
            <template #append>
              <el-icon :class="passwordVisible ? 'el-icon-eye' : 'el-icon-eye-off'" @click="togglePasswordVisibility"></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item label="确认密码" :rules="[{ required: true, message: '请确认密码', trigger: 'blur' }]">
          <el-input
              v-model="form.password2"
              :type="passwordVisible ? 'text' : 'password'"
              autocomplete="off"
              class="login-input">
            <template #append>
              <el-icon :class="passwordVisible ? 'el-icon-eye' : 'el-icon-eye-off'" @click="togglePasswordVisibility"></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="button-container">
            <el-button type="primary" @click="register" :loading="loading" class="register-button">注册</el-button>
            <el-button type="primary" @click="goToLogin" class="go-login-button">已有账号？登录</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        password: '',
        password2: '',
        email: '1'
      },
      loading: false,
      passwordVisible: false, // 控制密码是否可见
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible; // 切换密码的可见性
    },
    async register() {
      if (this.form.password !== this.form.password2) {
        this.$message.error('两次输入的密码不一致');
        return;
      }

      this.loading = true;

      try {
        const response = await axios.post('http://127.0.0.1:5173/api/register/', {
          username: this.form.username,
          password: this.form.password,
          password2: this.form.password2
        });

        this.loading = false;

        if (response.status === 201) {
          this.$message.success('注册成功，跳转到登录页');
          this.$router.push({ name: 'login' });
        }
      } catch (error) {
        this.loading = false;
        if (error.response && error.response.data) {
          this.$message.error(error.response.data.detail || '注册失败');
        } else {
          this.$message.error('网络错误');
        }
      }
    },
    goToLogin() {
      this.$router.push({ name: 'login' });
    }
  }
};
</script>

<style scoped>
/* 页面背景样式 */
body {
  background: linear-gradient(45deg, #6a11cb, #2575fc);
  font-family: 'Poppins', sans-serif;
  height: 100vh;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* 背景效果 */
.background {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 430px;
  height: 520px;
  z-index: -1;
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

/* 注册框样式 */
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  position: relative;
}

.register-box {
  background: rgba(255, 255, 255, 0.13);
  padding: 40px 35px;
  border-radius: 10px;
  box-shadow: 0 0 40px rgba(8, 7, 16, 0.6);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 450px;
  text-align: center;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

h1 {
  font-size: 32px;
  color: #000;
  font-weight: 500;
  margin-bottom: 30px;
}

/* 输入框样式 */
:deep .el-input__inner {
  background-color: rgba(255, 255, 255, 0.07);
  color: #000; /* 修改为黑色字体 */
  border-radius: 3px;
  font-size: 14px;
  height: 50px;
  padding: 0 10px;
  box-sizing: border-box;
  line-height: 50px;
  width: 100%;
  border: 1px solid #fff;
}

/* 按钮容器使用 Flexbox */
.button-container {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
}

.register-button,
.go-login-button {
  background-color: #ffffff;
  color: #080710;
  font-weight: bold;
  transition: background-color 0.3s ease;
  width: 48%;
  height: 50px;
  border-radius: 5px;
  font-size: 16px;
}

.register-button:hover,
.go-login-button:hover {
  background-color: #6a11cb;
  color: #ffffff;
}

.register-button:active,
.go-login-button:active {
  background-color: #5a10b6;
}

/* 图标 */
.el-icon-eye,
.el-icon-eye-off {
  cursor: pointer;
  color: #000;
}
</style>
