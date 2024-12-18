<template>
  <div class="welcome">
    <h1>欢迎来到素材库</h1>
    <div class="buttons">
      <button @click="redirectToUserLogin">用户登录</button>
      <button @click="redirectToAdminLogin">管理员登录</button>
      <!-- 新增游客跳转按钮 -->
      <button @click="redirectToVisitorPage">随便逛逛</button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    redirectToUserLogin() {
      this.$router.push({ name: 'login' });
    },
    redirectToAdminLogin() {
      this.$router.push({ name: 'admin-login' });
    },
    // 跳转到游客页面
    redirectToVisitorPage() {
      this.$router.push({ name: 'visitor' });
    }
  }
}
</script>

<style scoped>
.welcome {
  text-align: center;
  padding: 50px;
}
.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
