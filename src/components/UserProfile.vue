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
        <el-table-column label="类型" prop="category" />
        <el-table-column align="center" label="操作" width="120px">
          <template #default="scope">
            <!-- 使用 FavoriteButton 来处理收藏和取消收藏 -->
            <favorite-button
                :entry="scope.row"
                @update:entry="updateEntry"
            />
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
import api from '@/components/axios-instance'; // 导入自定义的axios实例
import FavoriteButton from '@/components/FavoriteButton.vue'; // 导入 FavoriteButton 组件

export default {
  name: 'UserProfile',
  components: {
    FavoriteButton,
  },
  data() {
    return {
      user: null, // 当前登录的用户
      favoriteKnowledgeEntries: [] // 收藏的知识条目
    };
  },
  mounted() {
    this.user = JSON.parse(localStorage.getItem('user')); // 获取当前登录用户信息
    if (!this.user) {
      this.$router.push({name: 'login'}); // 未登录，跳转到登录页
    } else {
      this.loadFavoriteEntries(); // 用户登录后加载收藏的条目
    }
  },
  methods: {
    // 获取用户的收藏条目
    loadFavoriteEntries() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.$message.error('请先登录');
        this.$router.push({ name: 'login' });
        return;
      }

      api.get('user-marks/', {
        headers: { Authorization: `Bearer ${token}` },
      })
          .then(response => {
            // 假设响应数据是一个包含收藏条目的列表
            console.log(response.data);  // 打印后端返回的数据
            // 提取返回的数据中的 mark 信息
            this.favoriteKnowledgeEntries = response.data.map(entry => {
              return {
                ...entry.mark,  // 复制 mark 对象的所有字段
                is_collected: true,  // 给每个条目添加 is_collected 属性，默认值为 true
                collected_mark_id: entry.id,
                is_inUser: true,
              };
            });
          })
          .catch(error => {
            console.error('获取用户收藏条目失败:', error);
          });
    },

    // 更新收藏状态
    updateEntry() {
      this.loadFavoriteEntries();
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
