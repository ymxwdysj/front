<template>
  <div class="container">
    <!-- 搜索按钮，定位到左上角 -->
    <el-button @click="goToSearch" class="search-btn" icon="el-icon-search">🔍</el-button>

    <h1 class="title">请选择素材类型</h1>
    <div class="category-buttons">
      <el-button v-for="category in categories"
                 :key="category"
                 @click="chooseCategory(category)"
                 class="category-btn">
        {{ category }}
      </el-button>
    </div>

    <!-- 使用一个包含按钮的容器来对其进行定位 -->
    <div class="action-buttons">
      <el-button @click="goToLogin" class="action-btn">返回登录</el-button>
      <el-button @click="goToUserProfile" class="action-btn">查看用户主页</el-button>
    </div>
  </div>
</template>

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
    goToSearch() {
      // 跳转到搜索页面
      this.$router.push({ name: 'search' });
    },
  },
};
</script>

<style scoped>
/* 页面背景和整体布局 */
.container {
  width: 100%; /* 宽度设置为100%，占满整个屏幕 */
  height: 50vh; /* 高度设置为100%视口高度 */
  margin: 0; /* 去除默认的页面边距 */
  display: flex;
  flex-direction: column;
  justify-content: center; /* 垂直居中 */
  align-items: center; /* 水平居中 */
  box-shadow: none; /* 移除阴影 */
}

/* 搜索按钮样式，定位到左上角 */
.search-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: #ffffff;
  color: #409eff;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  font-size: 20px; /* 设置字体大小 */
  width: 40px; /* 设置宽度 */
  height: 40px; /* 设置高度 */
}

/* 搜索按钮 Hover 效果 */
.search-btn:hover {
  background-color: #66b1ff;
  transform: scale(1.1);
}

/* 标题样式 */
.title {
  font-size: 36px; /* 稍微增加字体大小 */
  font-weight: 700;
  margin-bottom: 40px;
  color: #4a90e2; /* 蓝色文字 */
  text-align: center;
  text-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1); /* 文字阴影 */
  transition: all 0.3s ease-in-out; /* 鼠标悬停的过渡效果 */
}

.title:hover {
  transform: translateY(-5px); /* 鼠标悬停时轻微上移 */
  text-shadow: 2px 2px 20px rgba(0, 0, 0, 0.3); /* 增强阴影效果 */
}

/* 科目按钮容器样式 */
.category-buttons {
  display: flex;
  justify-content: center; /* 居中对齐按钮 */
  flex-wrap: wrap; /* 允许换行 */
  gap: 15px;
  margin-bottom: 30px; /* 底部间距 */
}

/* 科目按钮样式，设置为正方形 */
.category-btn {
  font-size: 18px;
  background-color: #409eff;
  color: white;
  width: 100px; /* 设置宽度为固定值 */
  height: 100px; /* 设置高度与宽度相等，保持正方形 */
  padding: 0; /* 移除默认内边距 */
  border-radius: 8px; /* 圆角按钮 */
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
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
  align-items: center; /* 中心对齐 */
  gap: 15px;
  margin-top: 20px;
}

/* 动作按钮样式 */
.action-btn {
  font-size: 16px;
  background-color: #67c23a;
  color: white;
  width: 45%; /* 按钮宽度占页面的一半 */
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
    width: 100%;
    padding-top: 20px;
  }

  .category-btn {
    font-size: 16px;
    width: 80px; /* 在小屏幕下，调整按钮的大小 */
    height: 80px;
  }

  .action-btn {
    font-size: 14px;
  }

  .action-buttons {
    flex-direction: column; /* 垂直排列按钮 */
    gap: 10px;
    position: static; /* 让按钮恢复正常流式布局 */
    margin-top: 20px; /* 上方间距 */
  }
}
</style>
