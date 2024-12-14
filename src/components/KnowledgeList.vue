<template>
  <div class="container">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
    </div>

    <!-- 页面标题和展示内容 -->
    <h1 class="title">知识条目</h1>
    <p class="intro-text">展示您选择的素材类型：{{ category }}</p>

    <!-- 按钮区域 -->
    <div class="button-container">
      <el-button @click="goToSearch" size="small" class="search-btn">跳转到搜索</el-button>
      <el-button @click="add_dialog_visible = true" size="small" class="add-btn">添加条目</el-button>
    </div>

    <!-- 知识条目表格 -->
    <el-table :data="knowledgeEntries" class="knowledge-table">
      <el-table-column label="标题" prop="title" />

      <!-- 显示前10个字，并添加“展开”按钮 -->
      <el-table-column label="内容">
        <template #default="scope">
          <div>
            <span>{{ truncateContent(scope.row.content) }}</span>
            <!-- 展开按钮，仅当内容长度大于10时显示 -->
            <el-button v-if="scope.row.content.length > 10" type="text" size="mini" @click="showFullContent(scope.row)">
              展开
            </el-button>
          </div>
        </template>
      </el-table-column>

      <!-- 类型列 -->
      <el-table-column label="类型" prop="category" />

      <!-- 格式化创建时间 -->
      <el-table-column label="创建时间" prop="created_at">
        <template #default="scope">
          <span>{{ formatDate(scope.row.created_at) }}</span>
        </template>
      </el-table-column>

      <!-- 操作列，收藏按钮 -->
      <el-table-column label="操作">
        <template #default="scope">
          <favorite-button :entry="scope.row" @update:entry="updateEntryFavoriteStatus" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页控件 -->
    <el-pagination v-if="totalPages > 1" :current-page="currentPage" :page-size="pageSize" :total="totalCount" @current-change="handlePageChange" layout="prev, pager, next, jumper" class="pagination" />

    <!-- 添加条目的弹窗 -->
    <el-dialog title="添加知识条目" v-model="add_dialog_visible" width="60%" :before-close="handleClose">
      <el-form :model="knowledgeForm" ref="addFormRef">
        <el-form-item label="标题">
          <el-input v-model="knowledgeForm.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="knowledgeForm.content" autocomplete="off" />
        </el-form-item>

        <!-- 类型选择 -->
        <el-form-item label="类型">
          <el-select v-model="knowledgeForm.category" placeholder="请选择类型">
            <el-option label="Poem" value="poem" />
            <el-option label="Math" value="Math" />
            <el-option label="Science" value="Science" />
            <el-option label="English" value="English" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button @click="submitForm" class="submit-btn">提交</el-button>
          <el-button @click="resetForm" class="reset-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 查看完整内容的对话框 -->
    <el-dialog v-model="dialogVisible" :title="currentEntry.title" width="50%" @close="dialogVisible = false">
      <p>{{ currentEntry.content }}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/components/axios-instance.js"; // 引入自定义 axios 实例
import FavoriteButton from '@/components/FavoriteButton.vue'; // 引入 FavoriteButton 组件

export default {
  components: {
    FavoriteButton, // 注册 FavoriteButton 组件
  },
  data() {
    return {
      knowledgeEntries: [], // 知识条目列表
      category: '', // 当前选择的科目
      add_dialog_visible: false, // 控制添加条目弹窗显示
      knowledgeForm: {
        title: '',
        content: '',
        category: '',
      },
      dialogVisible: false, // 控制完整内容显示
      currentEntry: {}, // 当前选中的知识条目
      currentPage: 1, // 当前页
      totalCount: 0, // 总条目数
      totalPages: 0, // 总页数
      pageSize: 5, // 每页显示的条数
    };
  },
  mounted() {
    const category = this.$route.query.category;

    if (!category) {
      this.$router.push({ name: 'choose-subject' });
      return;
    }

    this.category = category;
    this.fetchKnowledgeEntries(); // 获取条目
  },
  watch: {
    '$route.query.category'(newCategory) {
      this.category = newCategory;
      this.fetchKnowledgeEntries(); // 切换科目时重新加载条目
    }
  },
  methods: {
    // 跳转到搜索页面
    goToSearch() {
      this.$router.push({ name: 'search' });
    },
    // 获取条目列表
    async fetchKnowledgeEntries() {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) {
          this.$message.error('请先登录');
          this.$router.push({ name: 'login' });
          return;
        }

        const response = await api.get('collection/', {
          headers: { Authorization: `Bearer ${token}` },
          params: { category: this.category, page: this.currentPage, page_size: this.pageSize },
        });

        this.knowledgeEntries = response.data.results;
        this.totalCount = response.data.count;
        this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      } catch (error) {
        console.error('获取知识条目出错:', error);
        if (error.response && error.response.status === 401) {
          this.refreshTokenAndRetry(); // 如果 token 过期，尝试刷新
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
          this.fetchKnowledgeEntries(); // 刷新知识条目
        } catch (error) {
          console.error('刷新 token 失败，重新登录');
          this.$message.error('请重新登录');
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          this.$router.push({ name: 'login' });
        }
      } else {
        this.$message.error('无法获取 refresh token');
      }
    },

    // 格式化日期
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    },

    // 返回到选择科目页面
    goBack() {
      this.$router.push({ name: 'choose-subject' });
    },

    // 关闭弹窗
    handleClose(done) {
      this.add_dialog_visible = false;
      done();
    },

    // 重置表单
    resetForm() {
      this.$refs.addFormRef.resetFields();
    },

    // 提交表单，添加知识条目
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

    // 更新收藏状态
    updateEntryFavoriteStatus() {
      this.fetchKnowledgeEntries(); // 更新收藏后刷新条目
    },

    // 截取内容并显示前10个字
    truncateContent(content) {
      return content.length > 10 ? content.substring(0, 10) + "..." : content;
    },

    // 显示完整内容
    showFullContent(entry) {
      this.currentEntry = entry;
      this.dialogVisible = true;
    },

    // 分页变更时的处理
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchKnowledgeEntries(); // 切换页码时重新加载数据
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
  margin-bottom: 20px;
  color: #409eff;
}

.intro-text {
  text-align: center;
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
}

.button-container {
  text-align: center;
  margin-bottom: 30px;
}

.knowledge-table {
  width: 100%;
  margin-bottom: 30px;
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

.pagination {
  margin-top: 20px;
  text-align: center;
}

.search-btn {
  background-color: #409eff;
  color: white;
  margin-left: 10px;
}

.search-btn:hover {
  background-color: #357ab7;
}
</style>
