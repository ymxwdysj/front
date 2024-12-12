<template>
  <div class="container">
    <div class="back-button">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
    </div>

    <h1 class="title">所有知识条目</h1>
    <p class="intro-text">欢迎来到素材库的页面！</p>

    <div class="button-container">
      <el-button @click="add_dialog_visible = true" size="small" class="add-btn">添加条目</el-button>
    </div>

    <el-table :data="knowledgeEntries" class="knowledge-table">
      <el-table-column label="标题" prop="title" />
      <el-table-column label="内容" prop="content" />
      <el-table-column label="类型" prop="category" />
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
import api from '@/components/axios-instance'; // 引入自定义 axios 实例

export default {
  data() {
    return {
      knowledgeEntries: [], // 存储所有知识条目
      add_dialog_visible: false,
      knowledgeForm: {
        title: '',
        content: '',
        category: '',
        priority: 1,
      },
    };
  },
  mounted() {
    this.fetchKnowledgeEntries(); // 页面加载时获取知识条目
  },
  methods: {
    async fetchKnowledgeEntries() {
      try {
        const response = await api.get('marks/', {
          params: { category: 'poem' }
        });

        // 确保 entries 是数组
        if (Array.isArray(response.data)) {
          this.knowledgeEntries = response.data;
        } else {
          console.error('返回的 entries 不是数组:', response.data.entries);
          this.knowledgeEntries = []; // 如果返回数据格式错误，清空条目
        }
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
          // 使用 refresh token 刷新 access token
          const refreshResponse = await api.post('token/refresh/', { refresh: refreshToken });
          const { access } = refreshResponse.data;

          // 存储新的 access token
          localStorage.setItem('access_token', access);

          // 重新发起请求
          this.fetchKnowledgeEntries();
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
    goBack() {
      this.$router.push({ name: 'previous-page' }); // 根据需求修改返回页面的路由
    },
    handleClose(done) {
      this.add_dialog_visible = false;
      done();
    },
    resetForm() {
      this.$refs.addFormRef.resetFields();
    },
    async submitForm() {
      try {
        const response = await api.post('marks/', this.knowledgeForm);
        if (response.status === 200) {
          this.$message.success('条目添加成功');
          this.add_dialog_visible = false;
          this.fetchKnowledgeEntries(); // 刷新知识条目
        }
      } catch (error) {
        console.error('添加知识条目失败:', error);
      }
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

.intro-text {
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-bottom: 30px;
}

/* 添加条目按钮 */
.button-container {
  text-align: center;
  margin-bottom: 20px;
}

.add-btn {
  background-color: #67C23A;
  color: white;
}

/* 表格样式 */
.knowledge-table {
  width: 100%;
  margin-bottom: 30px;
}

/* 按钮样式 */
.el-button {
  margin-right: 10px;
}

/* 弹出框样式 */
.dialog .el-dialog__header {
  background-color: #f2f4f6;
}

.dialog .el-button {
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

/* 查看用户信息按钮 */
.user-profile {
  margin-top: 20px;
  text-align: center;
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
