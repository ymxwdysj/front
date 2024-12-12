<template>
  <div class="container">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
    </div>

    <h1 class="title">Chinese - 知识条目管理</h1>
    <p class="intro-text">欢迎来到科目 Chinese 的页面！</p>

    <!-- 添加知识条目按钮 -->
    <div class="button-container">
      <el-button @click="add_dialog_visible = true" size="small" class="add-btn">添加条目</el-button>
    </div>

    <!-- 知识条目表格 -->
    <el-table :data="Object.values(knowledgeEntries)" class="knowledge-table">
      <el-table-column label="标题" prop="title" />
      <el-table-column label="内容" prop="content" />
      <el-table-column label="类型" prop="type" />
      <el-table-column label="优先级" prop="priority" />
      <el-table-column align="right" label="操作" width="200px">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)" class="edit-btn">编辑</el-button>
          <el-button size="small" @click="handleDelete(scope.row)" class="delete-btn">删除</el-button>
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

    <!-- 编辑知识条目对话框 -->
    <el-dialog title="编辑知识条目" v-model="edit_dialog_visible" width="80%" :before-close="handleClose" class="dialog">
      <el-form :model="knowledgeForm" ref="editFormRef" status-icon label-width="120px" class="demo-ruleForm">
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
          <el-button @click="submitEditForm(knowledgeForm)" class="submit-btn">提交</el-button>
          <el-button @click="resetForm(editFormRef)" class="reset-btn">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'Subject1',
  data() {
    return {
      knowledgeEntries: {}, // 存储知识条目
      knowledgeForm: { // 用于绑定表单数据
        title: '',
        content: '',
        type: '',
        priority: 1
      },
      add_dialog_visible: false, // 控制添加条目对话框的显示
      edit_dialog_visible: false, // 控制编辑条目对话框的显示
      editItemId: null, // 存储编辑条目的 ID
    };
  },
  mounted() {
    this.getKnowledgeEntries(); // 页面加载时获取知识条目
  },
  methods: {
    // 返回到上一个页面
    goBack() {
      this.$router.go(-1);  // 返回上一个页面
    },

    // 获取知识条目列表
    getKnowledgeEntries() {
      axios.post("http://localhost:5000/knowledge_retrieve", { type: "all" }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
          .then(response => {
            this.knowledgeEntries = response.data.entries; // 假设响应数据格式为 { entries: { ... } }
          })
          .catch(error => {
            console.error('获取知识条目出错:', error);
          });
    },

    // 添加知识条目
    submitForm(formData) {
      axios.post("http://localhost:5000/knowledge_add", formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
          .then(() => {
            this.getKnowledgeEntries(); // 更新列表
            this.add_dialog_visible = false;
            this.resetForm('addFormRef');
          })
          .catch(error => {
            console.error('添加知识条目出错:', error);
          });
    },

    // 编辑知识条目
    handleEdit(row) {
      this.knowledgeForm = { ...row };
      this.editItemId = row.id;
      this.edit_dialog_visible = true;
    },

    // 提交编辑后的知识条目
    submitEditForm(formData) {
      axios.post("http://localhost:5000/knowledge_mod", { ...formData, id: this.editItemId }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
          .then(() => {
            this.getKnowledgeEntries(); // 更新列表
            this.edit_dialog_visible = false;
            this.resetForm('editFormRef');
          })
          .catch(error => {
            console.error('编辑知识条目出错:', error);
          });
    },

    // 删除知识条目
    handleDelete(row) {
      axios.post("http://localhost:5000/knowledge_del", { id: row.id }, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
          .then(() => {
            this.getKnowledgeEntries(); // 更新列表
          })
          .catch(error => {
            console.error('删除知识条目出错:', error);
          });
    },

    // 重置表单
    resetForm(refName) {
      this.$refs[refName].resetFields();
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
.edit-btn,
.delete-btn {
  margin-right: 10px;
}

.edit-btn {
  background-color: #e6a23c;
  color: white;
}

.delete-btn {
  background-color: #f56c6c;
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
</style>
