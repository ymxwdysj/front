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
        <el-input v-model="form.confirmPassword" type="password" autocomplete="off" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="register" :loading="loading">注册</el-button>
        <el-button @click="goToLogin">已有账号？登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Register',
  data() {
    return {
      form: {
        username: '',
        password: '',
        confirmPassword: ''
      },
      loading: false
    };
  },
  methods: {
    async register() {
      if (this.form.password !== this.form.confirmPassword) {
        this.$message.error('两次输入的密码不一致');
        return;
      }

      this.loading = true;

      // 模拟注册操作：向后端发送请求（这里是模拟，你可以使用 Axios 或 Fetch）
      setTimeout(() => {
        this.loading = false;
        localStorage.setItem('user', JSON.stringify({ username: this.form.username }));
        this.$router.push({ name: 'choose-subject' }); // 注册成功后跳转到选择科目页面
      }, 2000);
    },
    goToLogin() {
      this.$router.push({ name: 'login' }); // 如果已有账号，跳转到登录页面
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
