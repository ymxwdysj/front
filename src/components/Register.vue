<template>
  <div class="register-container">
    <h1>注册</h1>
    <el-form :model="form" status-icon label-width="120px" class="register-form">
      <el-form-item label="用户名" :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]">
        <el-input v-model="form.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="密码" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
        <el-input v-model="form.password" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item label="确认密码" :rules="[{ required: true, message: '请确认密码', trigger: 'blur' }]">
        <el-input v-model="form.password2" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register" :loading="loading">注册</el-button>
        <el-button @click="goToLogin">已有账号？登录</el-button>
      </el-form-item>
    </el-form>
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
        email:'1'
      },
      loading: false
    };
  },
  methods: {
    async register() {
      if (this.form.password !== this.form.password2) {
        this.$message.error('两次输入的密码不一致');
        return;
      }

      this.loading = true;

      try {
        // 向后端发送注册请求
        const response = await axios.post('http://127.0.0.1:5175/api/register/', {
          username: this.form.username,
          password: this.form.password,
          password2: this.form.password2
        });

        this.loading = false;

        // 假设后端返回一个成功消息
        if (response.status === 201) {
          this.$message.success('注册成功，跳转到登录页');
          this.$router.push({name: 'login'}); // 注册成功后跳转到登录页面
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
      this.$router.push({name: 'login'}); // 如果已有账号，跳转到登录页面
    }
  }
};
</script>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.register-form .el-form-item {
  margin-bottom: 20px;
}

.register-form .el-button {
  width: 100%;
}
</style>
