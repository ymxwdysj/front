<template>
  <div class="choose-subject">
    <div class="logout">
      <button @click="logout">退出登录</button>
    </div>
    <h1>请选择一个科目</h1>
    <div class="subjects">
      <button @click="goToSubject(1)" class="subject-button">Chinese</button>
      <button @click="goToSubject(2)" class="subject-button">Math</button>
      <button @click="goToSubject(3)" class="subject-button">English</button>
    </div>
    <!-- 查看用户信息按钮 -->
    <div class="user-profile">
      <button @click="goToUserProfile">查看用户信息</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChooseSubject',
  methods: {
    // 跳转到对应的科目页面
    goToSubject(subjectId) {
      this.$router.push({ name: `subject${subjectId}` });
    },
    // 退出登录
    logout() {
      localStorage.removeItem('user');  // 清除登录信息
      this.$router.push({ name: 'login' });  // 跳转到登录页面
    },
    // 跳转到用户信息页面
    goToUserProfile() {
      this.$router.push({ name: 'user-profile' });  // 跳转到用户信息页面
    }
  }
};
</script>

<style scoped>
.choose-subject {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(45deg, #6a11cb, #2575fc);  /* 背景渐变 */
  position: relative;
}

h1 {
  font-size: 28px;
  color: white;
  margin-bottom: 30px;
}

.subjects {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin-bottom: 50px;
}

.subject-button {
  background-color: #fff;
  color: #2575fc;
  border: none;
  padding: 15px 30px;
  font-size: 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.subject-button:hover {
  background-color: #2575fc;
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.subject-button:active {
  transform: scale(0.98);
}

/* 退出登录按钮样式 */
.logout {
  position: absolute;
  top: 20px;
  right: 20px;
}

.logout button {
  background-color: #ff4d4f;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.logout button:hover {
  background-color: #ff3333;
}

.logout button:active {
  transform: scale(0.98);
}

/* 查看用户信息按钮 */
.user-profile {
  margin-top: 20px;
}

.user-profile button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.user-profile button:hover {
  background-color: #45a049;
}
</style>
