<template>
  <div class="container">
    <div class="back-button">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
    </div>

    <h1 class="title">知识条目</h1>
    <p class="intro-text">展示您选择的素材类型：{{ category }}</p>

    <div class="button-container">
      <el-button @click="add_dialog_visible = true" size="small" class="add-btn">添加条目</el-button>
    </div>

    <el-table :data="knowledgeEntries" class="knowledge-table">
      <el-table-column label="标题" prop="title" />
      <el-table-column label="内容" prop="content" />
      <el-table-column label="类型" prop="category" />
      <el-table-column label="创建时间" prop="created_at">
        <template #default="scope">
          <span>{{ formatDate(scope.row.created_at) }}</span>
        </template>
      </el-table-column>

      <!-- 收藏按钮列 -->
      <el-table-column label="操作">
        <template #default="scope">
          <el-button
              size="small"
              @click="toggleFavorite(scope.row)"
              :type="scope.row.is_favorite ? 'danger' : 'primary'">
            {{ scope.row.is_favorite ? '取消收藏' : '收藏' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="添加知识条目" v-model="add_dialog_visible" width="60%" :before-close="handleClose">
      <el-form :model="knowledgeForm" ref="addFormRef">
        <el-form-item label="标题">
          <el-input v-model="knowledgeForm.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="knowledgeForm.content" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="knowledgeForm.category" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优先级">
          <el-select v-model="knowledgeForm.priority">
            <el-option label="⭐" :value="1" />
            <el-option label="⭐⭐" :value="2" />
            <el-option label="⭐⭐⭐" :value="3" />
            <el-option label="⭐⭐⭐⭐" :value="4" />
            <el-option label="⭐⭐⭐⭐⭐" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm" class="submit-btn">提交</el-button>
          <el-button @click="resetForm" class="reset-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/components/axios-instance.js"; // 引入自定义 axios 实例

export default {
  data() {
    return {
      knowledgeEntries: [], // 存储所有知识条目
      category: '', // 当前选择的科目
      add_dialog_visible: false, // 控制弹窗显示
      knowledgeForm: {
        title: '',
        content: '',
        category: '',
        priority: 1,
      },
      favoriteIds: [] // 存储用户收藏的条目ID
    };
  },
  mounted() {
    const category = this.$route.query.category;

    if (!category) {
      this.$router.push({ name: 'choose-subject' });
      return;
    }

    this.category = category;
    this.favoriteIds = JSON.parse(localStorage.getItem('favoriteIds') || '[]'); // 从 localStorage 获取收藏的条目ID
    this.fetchKnowledgeEntries(); // 获取条目
  },
  watch: {
    // 如果切换了科目，重新加载条目
    '$route.query.category'(newCategory) {
      this.category = newCategory;
      this.fetchKnowledgeEntries();
    }
  },
  methods: {
    async fetchKnowledgeEntries() {
      try {
        const response = await api.get('marks/', {
          params: { category: this.category },
        });

        this.knowledgeEntries = response.data.map(entry => ({
          ...entry,
          is_favorite: this.favoriteIds.includes(entry.id), // 检查该条目是否在收藏列表中
        }));
      } catch (error) {
        console.error('获取知识条目出错:', error);
        if (error.response && error.response.status === 401) {
          this.refreshTokenAndRetry(); // 如果是 token 过期，尝试刷新
        }
      }
    },

    async refreshTokenAndRetry() {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await api.post('token/refresh/', { refresh: refreshToken });
          const { access } = refreshResponse.data;
          localStorage.setItem('access_token', access);
          this.fetchKnowledgeEntries();
        } catch (error) {
          console.error('刷新 token 失败，重新登录');
          this.$message.error('请重新登录');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.$router.push({name: 'login'});
        }
      } else {
        this.$message.error('无法获取 refresh token');
      }
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    },

    goBack() {
      this.$router.push({name: 'choose-subject'});
    },

    handleClose(done) {
      this.add_dialog_visible = false;
      done();
    },

    resetForm() {
      this.$refs.addFormRef.resetFields();
    },

    async submitForm() {
      if (!this.knowledgeForm.title || !this.knowledgeForm.content || !this.knowledgeForm.category) {
        this.$message.error('请填写所有字段');
        return;
      }

      try {
        const response = await api.post('marks/', this.knowledgeForm);
        if (response.status === 201) {
          this.$message.success('条目添加成功');
          this.add_dialog_visible = false;
          this.fetchKnowledgeEntries(); // 刷新知识条目
        }
      } catch (error) {
        console.error('添加知识条目失败:', error);
      }
    },

    // 收藏或取消收藏
    async toggleFavorite(entry) {
      try {
        // 更新收藏状态
        if (entry.is_favorite) {
          // 取消收藏
          await api.delete(`user-marks/${entry.id}/`);
          this.favoriteIds = this.favoriteIds.filter(id => id !== entry.id);
        } else {
          // 收藏
          await api.post(`user-marks/`, {
            mark: entry.id,
            note: '', // 可以传递用户备注
            preference_level: 0, // 收藏优先级
        });
          this.favoriteIds.push(entry.id);
        }

        // 更新 localStorage
        localStorage.setItem('favoriteIds', JSON.stringify(this.favoriteIds));

        // 更新条目收藏状态
        entry.is_favorite = !entry.is_favorite;

        this.$message.success(entry.is_favorite ? entry.id + ' 收藏成功' : '取消收藏');
      } catch (error) {
        console.error('收藏操作失败:', error);
        this.$message.error('操作失败，请重试');
      }
    }
  }
};
</script>

<style scoped>
.container {
  width: 80%;
  margin: 0 auto;
  padding: 20px;
}

.title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 30px;
}

.intro-text {
  text-align: center;
  margin-bottom: 20px;
}

.button-container {
  text-align: center;
  margin-bottom: 20px;
}

.knowledge-table {
  width: 100%;
}

.el-button {
  margin-right: 10px;
}

.submit-btn {
  background-color: #409eff;
  color: white;
}

.reset-btn {
  background-color: #e0e0e0;
  color: #333;
}

.add-btn {
  background-color: #67c23a;
  color: white;
}

.add-btn:hover {
  background-color: #58a428;
}
</style>
