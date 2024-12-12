<template>
  <div class="user-profile">
    <h1>用户信息</h1>
    <div v-if="user">
      <p><strong>用户名:</strong> {{ user.username }}</p>
      <p><strong>登录时间:</strong> {{ user.loginTime }}</p>
    </div>
    <div v-else>
      <p>未登录，无法查看用户信息。</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserProfile',
  data() {
    return {
      user: JSON.parse(localStorage.getItem('user')) || null,  // 获取当前登录用户信息
    };
  },
  created() {
    if (!this.user) {
      this.$router.push({ name: 'login' });  // 如果没有登录信息，跳转到登录页面
    }
  }
};
</script>

<style scoped>
.user-profile {
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 28px;
  color: #333;
}

p {
  font-size: 18px;
  margin: 10px 0;
}

strong {
  font-weight: bold;
}
</style>
