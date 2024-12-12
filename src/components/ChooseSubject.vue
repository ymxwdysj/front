<template>
  <div class="container">
    <h1 class="title">请选择素材类型</h1>
    <el-button v-for="category in categories"
               :key="category"
               @click="chooseCategory(category)"
               class="category-btn">
      {{ category }}
    </el-button>

    <!-- 使用一个包含按钮的容器来对其进行定位 -->
    <div class="action-buttons">
      <el-button @click="goToLogin" class="action-btn">返回登录</el-button>
      <el-button @click="goToUserProfile" class="action-btn">查看用户主页</el-button>
    </div>
  </div>
</template>

<!--实现链接到
    1.各个科目素材库
    2.用户主页
    3.待实现搜索按钮
-->

<script>
export default {
  data() {
    return {
      categories: ['poem', 'Math', 'Science', 'English'], // 更新后的科目类型
    };
  },
  methods: {
    chooseCategory(category) {
      // 跳转到知识条目页面并传递所选的科目
      this.$router.push({ name: 'knowledge-list', query: { category } });
    },
    goToLogin() {
      // 跳转到登录页面
      this.$router.push({ name: 'login' });
    },
    goToUserProfile() {
      // 跳转到用户主页
      this.$router.push({ name: 'user-profile' });
    },
  },
};
</script>

<style scoped>
/* 页面背景和整体布局 */
.container {
  width: 90%; /* 宽度设置为视口的90% */
  max-width: 800px; /* 设置最大宽度，避免过宽 */
  margin: 0 auto;
  text-align: center;
  padding-top: 50px;
  padding-bottom: 40px;
  background-color: #f9fafb; /* 柔和的背景色 */
  border-radius: 12px; /* 圆角 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); /* 阴影 */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden; /* 防止内容溢出 */
}

/* 标题样式 */
.title {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 40px;
  color: #333; /* 深色标题 */
}

/* 科目按钮样式 */
.category-btn {
  margin: 15px 0;
  font-size: 20px;
  background-color: #409eff;
  color: white;
  width: 100%;
  padding: 15px;
  border-radius: 8px; /* 圆角按钮 */
  transition: all 0.3s ease;
}

/* Hover 动画效果 */
.category-btn:hover {
  background-color: #66b1ff;
  transform: translateY(-3px); /* 悬停时按钮上升效果 */
}

/* 按钮容器样式 */
.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  margin-top: 20px;
}

/* 动作按钮样式 */
.action-btn {
  font-size: 16px;
  background-color: #67c23a;
  color: white;
  width: 48%; /* 按钮宽度占页面的一半 */
  padding: 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

/* Hover 动画效果 */
.action-btn:hover {
  background-color: #85d16f;
  transform: translateY(-3px); /* 悬停时按钮上升效果 */
}

/* 小屏幕适配 */
@media (max-width: 600px) {
  .container {
    width: 90%;
    padding-top: 20px;
  }

  .category-btn {
    font-size: 18px;
  }

  .action-btn {
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column; /* 垂直排列按钮 */
    gap: 10px;
  }
}
</style>
