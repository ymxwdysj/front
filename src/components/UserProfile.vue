<template>
  <div class="container">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
    </div>

    <h1 class="title">用户信息</h1>
    <div v-if="user">
      <p><strong>用户名:</strong> {{ user.username }}</p>
      <p><strong>登录时间:</strong> {{ user.loginTime }}</p>
      <h2 class="favorite-title">收藏的知识条目</h2>

      <!-- 知识条目表格 -->
      <el-table :data="favoriteKnowledgeEntries" class="knowledge-table" v-if="favoriteKnowledgeEntries.length > 0">
        <el-table-column label="标题" prop="title" />
        <el-table-column label="内容" prop="content" />
        <el-table-column label="类型" prop="type" />
        <el-table-column align="center" label="操作" width="120px">
          <template #default="scope">
            <el-button
                @click="handleUnfavorite(scope.row)"
                size="small"
                class="unfavorite-btn"
            >
              取消收藏
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 如果没有收藏的条目 -->
      <div v-else>
        <p>您没有收藏任何知识条目。</p>
      </div>
    </div>
    <div v-else>
      <p>未登录，无法查看用户信息。</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'UserProfile',
  data() {
    return {
      user: null, // 当前登录的用户
      favoriteKnowledgeEntries: [] // 收藏的知识条目
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user')); // 获取当前登录用户信息
    if (!this.user) {
      this.$router.push({ name: 'login' }); // 未登录，跳转到登录页
    } else {
      this.loadFavoriteEntries(); // 用户登录后加载收藏的条目
    }
  },
  methods: {
    // 获取用户的收藏条目
    loadFavoriteEntries() {
      axios.post("http://localhost:5000/favorite_retrieve", {userId: this.user.id}, {
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
          .then(response => {
            const favoriteIds = response.data.favoriteEntries || [];
            this.fetchKnowledgeEntries(favoriteIds);
          })
          .catch(error => {
            console.error('获取用户收藏条目失败:', error);
          });
    },

    // 根据收藏ID加载知识条目
    fetchKnowledgeEntries(favoriteIds) {
      axios.post("http://localhost:5000/knowledge_retrieve", {type: "all"}, {
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
          .then(response => {
            const allKnowledgeEntries = response.data.entries || [];
            // 根据收藏的ID加载对应的条目
            this.favoriteKnowledgeEntries = allKnowledgeEntries.filter(entry => favoriteIds.includes(entry.id));
          })
          .catch(error => {
            console.error('获取知识条目失败:', error);
          });
    },

    // 取消收藏
    handleUnfavorite(entry) {
      axios.post("http://localhost:5000/favorite_remove", {userId: this.user.id, entryId: entry.id}, {
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
          .then(() => {
            // 移除当前收藏列表中的该条目
            this.favoriteKnowledgeEntries = this.favoriteKnowledgeEntries.filter(e => e.id !== entry.id);
          })
          .catch(error => {
            console.error('取消收藏失败:', error);
          });
    },

    // 返回上一页面
    goBack() {
      this.$router.go(-1);  // 返回上一个页面
    }
  }
};
</script>

<style scoped>
/* 页面容器 */
.container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* 返回按钮 */
.back-button {
  text-align: left;
  margin-bottom: 20px;
}

.back-btn {
  background-color: #409eff;
  color: white;
  border-radius: 4px;
}

/* 标题样式 */
.title {
  text-align: center;
  font-size: 28px;
  color: #333;
}

.favorite-title {
  margin-top: 20px;
  font-size: 24px;
  color: #333;
}

/* 表格样式 */
.knowledge-table {
  width: 100%;
  margin-bottom: 30px;
}

/* 收藏按钮样式 */
.unfavorite-btn {
  background-color: #f56c6c;
  color: white;
}

/* 如果没有收藏的条目 */
p {
  font-size: 18px;
  color: #666;
  margin: 10px 0;
}

strong {
  font-weight: bold;
}
</style>
