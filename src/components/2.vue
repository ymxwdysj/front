<template>
  <div>
    <h1 style="text-align: center">Chinese - 知识条目管理</h1>
    <p>欢迎来到科目 Math 的页面！</p>

    <!-- 添加知识条目按钮 -->
    <el-button @click="add_dialog_visible = true" size="small">添加条目</el-button>
    <el-button @click="logout" size="small">登出</el-button>

    <!-- 知识条目表格 -->
    <el-table :data="Object.values(knowledgeEntries)" style="margin: 20px auto;">
      <el-table-column label="标题" prop="title" />
      <el-table-column label="内容" prop="content" />
      <el-table-column label="类型" prop="type" />
      <el-table-column label="优先级" prop="priority" />
      <el-table-column align="right" label="操作" width="200px">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加知识条目对话框 -->
    <el-dialog title="添加知识条目" v-model="add_dialog_visible" width="60%" :before-close="handleClose">
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
          <el-button @click="submitForm(knowledgeForm)">提交</el-button>
          <el-button @click="resetForm(addFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑知识条目对话框 -->
    <el-dialog title="编辑知识条目" v-model="edit_dialog_visible" width="80%" :before-close="handleClose">
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
          <el-button @click="submitEditForm(knowledgeForm)">提交</el-button>
          <el-button @click="resetForm(editFormRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
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
    };
  },
  methods: {
    // 添加知识条目
    submitForm(formData) {
      const id = Date.now().toString();  // 使用当前时间戳作为唯一ID
      this.$set(this.knowledgeEntries, id, { ...formData, id });
      this.add_dialog_visible = false;
      this.resetForm('addFormRef');
    },
    // 编辑知识条目
    handleEdit(row) {
      this.knowledgeForm = { ...row };
      this.edit_dialog_visible = true;
    },
    // 提交编辑后的表单
    submitEditForm(formData) {
      this.$set(this.knowledgeEntries, formData.id, formData);
      this.edit_dialog_visible = false;
      this.resetForm('editFormRef');
    },
    // 删除知识条目
    handleDelete(row) {
      this.$delete(this.knowledgeEntries, row.id);
    },
    // 重置表单
    resetForm(refName) {
      this.$refs[refName].resetFields();
    },
    // 关闭对话框
    handleClose(done) {
      done();
    },
    // 登出方法
    logout() {
      console.log('登出');
      // 可以加入登出逻辑，如清除登录状态
    }
  }
};
</script>

<style scoped>
/* 样式部分，如果需要 */
</style>
