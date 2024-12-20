<template>
  <div class="welcome-container">
    <div class="welcome">
      <h1>欢迎来到素材库</h1>
      <div class="buttons">
        <button @click="redirectToUserLogin">用户登录</button>
        <button @click="redirectToAdminLogin">管理员登录</button>
        <!-- 新增游客跳转按钮 -->
        <button @click="redirectToVisitorPage">随便逛逛</button>
      </div>
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
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');

.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #6998f6; /* 设置空白部分的浅色背景 */
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 500px; /* 限制宽度 */
  width: 100%;
  height: auto; /* 高度根据内容调整 */
  background-color: #DBE0F9; /* 内容区域背景色 */
  text-align: center;
  font-family: 'Roboto', sans-serif;
  padding: 40px;
  border-radius: 15px; /* 添加圆角 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  position: absolute;
  top: 50%; /* 垂直居中 */
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 通过 transform 完全居中 */
}

h1 {
  font-size: 2.8rem;
  color: #6065D9;
  margin-bottom: 40px;
  font-weight: 500;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

button {
  width: 220px;
  padding: 15px;
  background: linear-gradient(to right, #6065D9, #17D7FA);
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

button:hover {
  background-color: #4C54C1;
  transform: translateY(-4px);
}

button:active {
  transform: translateY(2px);
}

button:focus {
  outline: none;
}

@media (max-width: 768px) {
  h1 {
    font-size: 2.2rem;
  }

  .buttons {
    gap: 20px;
  }

  button {
    width: 100%;
    font-size: 1rem;
  }
}
</style>
