<template>
  <div class="container">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
    </div>

    <h1 class="title">所有知识条目</h1>
    <p class="intro-text">欢迎来到素材库的页面！</p>

    <!-- 添加知识条目按钮 -->
    <div class="button-container">
      <el-button @click="add_dialog_visible = true" size="small" class="add-btn">添加条目</el-button>
    </div>

    <!-- 知识条目表格 -->
    <el-table :data="knowledgeEntries" class="knowledge-table">
      <el-table-column label="标题" prop="title" />
      <el-table-column label="内容" prop="content" />
      <el-table-column label="类型" prop="type" />
      <el-table-column align="center" label="收藏" width="120px">
        <template #default="scope">
          <el-button
              :type="isFavorite(scope.row.id) ? 'success' : 'primary'"
              @click="toggleFavorite(scope.row)"
          >
            {{ isFavorite(scope.row.id) ? '已收藏' : '收藏' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加知识条目对话框 -->
    <el-dialog title="添加知识条目" v-model="add_dialog_visible" width="60%" :before-close="handleClose" class="dialog">
      <el-form :model="knowledgeForm" ref="addFormRef" status-icon label-width="120px" class="demo-ruleForm">
        <el-form-item label="标题" prop="title">
          <el-input v-model="knowledgeForm.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="knowledgeForm.content" autocomplete="off" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-input v-model="knowledgeForm.type" autocomplete="off" />
        </el-form-item>
        <el-form-item label="优先级" prop="priority">
          <el-select v-model="knowledgeForm.priority" placeholder="请选择优先级">
            <el-option label="⭐" :value="1" />
            <el-option label="⭐⭐" :value="2" />
            <el-option label="⭐⭐⭐" :value="3" />
            <el-option label="⭐⭐⭐⭐" :value="4" />
            <el-option label="⭐⭐⭐⭐⭐" :value="5" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm(knowledgeForm)" class="submit-btn">提交</el-button>
          <el-button @click="resetForm(addFormRef)" class="reset-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 查看用户信息按钮 -->
    <div class="user-profile">
      <button @click="goToUserProfile">查看用户信息</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'ChooseSubject',
  data() {
    return {
      knowledgeEntries: [], // 存储所有知识条目
      favoriteEntries: [], // 存储用户收藏的条目
      add_dialog_visible: false, // 控制添加条目对话框的显示
      knowledgeForm: { // 用于绑定表单数据
        title: '',
        content: '',
        type: '',
        priority: 1
      }
    };
  },
  mounted() {
    this.fetchKnowledgeEntries(); // 页面加载时获取知识条目
    this.fetchFavoriteEntries();  // 页面加载时获取用户的收藏条目
  },
  methods: {
    // 返回到上一个页面
    goBack() {
      this.$router.go(-1);  // 返回上一个页面
    },

    // 获取所有知识条目列表
    fetchKnowledgeEntries() {
      axios.post("http://localhost:5000/knowledge_retrieve", { type: "all" }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
          .then(response => {
            this.knowledgeEntries = response.data.entries; // 假设响应数据格式为 { entries: [...] }
          })
          .catch(error => {
            console.error('获取知识条目出错:', error);
          });
    },

    // 获取用户的收藏条目
    fetchFavoriteEntries() {
      axios.post("http://localhost:5000/favorite_retrieve", {}, {
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
          .then(response => {
            this.favoriteEntries = response.data.favoriteEntries || []; // 获取收藏条目ID列表
          })
          .catch(error => {
            console.error('获取用户收藏条目出错:', error);
          });
    },

    // 检查条目是否已被收藏
    isFavorite(id) {
      return this.favoriteEntries.includes(id);
    },

    // 切换收藏状态
    toggleFavorite(entry) {
      const isCurrentlyFavorite = this.isFavorite(entry.id);

      if (isCurrentlyFavorite) {
        // 如果当前已收藏，取消收藏
        this.removeFromFavorites(entry.id);
      } else {
        // 如果未收藏，添加到收藏
        this.addToFavorites(entry.id);
      }
    },

    // 将条目添加到收藏
    addToFavorites(entryId) {
      axios.post("http://localhost:5000/favorite_add", {entryId}, {
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
          .then(() => {
            this.favoriteEntries.push(entryId); // 本地更新收藏列表
          })
          .catch(error => {
            console.error('添加收藏失败:', error);
          });
    },

    // 将条目从收藏中移除
    removeFromFavorites(entryId) {
      axios.post("http://localhost:5000/favorite_remove", {entryId}, {
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
          .then(() => {
            const index = this.favoriteEntries.indexOf(entryId);
            if (index !== -1) {
              this.favoriteEntries.splice(index, 1); // 本地更新收藏列表
            }
          })
          .catch(error => {
            console.error('移除收藏失败:', error);
          });
    },

    // 提交添加的知识条目
    submitForm(formData) {
      axios.post("http://localhost:5000/knowledge_add", formData, {
        withCredentials: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
          .then(() => {
            this.fetchKnowledgeEntries(); // 更新列表
            this.add_dialog_visible = false; // 关闭对话框
            this.resetForm(); // 重置表单
          })
          .catch(error => {
            console.error('添加知识条目失败:', error);
          });
    },

    // 重置表单
    resetForm() {
      this.knowledgeForm = {title: '', content: '', type: '', priority: 1}; // 清空表单数据
    },

    // 跳转到用户信息页面
    goToUserProfile() {
      this.$router.push({name: 'user-profile'});  // 跳转到用户信息页面
    },

    // 关闭对话框
    handleClose(done) {
      done();
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

/* 收藏按钮样式 */
.el-button.primary {
  background-color: #409eff;
  color: white;
}

.el-button.success {
  background-color: #67c23a;
  color: white;
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
