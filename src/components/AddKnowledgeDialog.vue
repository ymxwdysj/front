<template>
  <div>
    <!-- 添加条目按钮 -->
    <el-button @click="openDialog" size="small" class="add-btn">添加条目</el-button>

    <!-- 添加条目的弹窗 -->
    <el-dialog title="添加知识条目" v-model="dialogVisible" width="60%" :before-close="handleClose">
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
            <el-option label="Math" value="math" />
            <el-option label="Science" value="science" />
            <el-option label="English" value="english" />
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
      dialogVisible: false, // 控制弹窗显示
      knowledgeForm: {
        title: '',
        content: '',
        category: '',
      },
    };
  },
  methods: {
    // 打开弹窗
    openDialog() {
      const token = localStorage.getItem('access_token'); // 检查本地是否存在登录 token
      if (!token) {
        // 未登录，弹出提示框
        this.$confirm('您需要登录才能添加条目。', '提示', {
          confirmButtonText: '登录',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // 跳转到登录页面
          this.$router.push({ name: 'login' });
        }).catch(() => {
          // 用户点击取消，什么也不做
        });
        return;
      }

      // 已登录，打开弹窗
      this.dialogVisible = true;
    },

    // 关闭弹窗
    handleClose() {
      this.dialogVisible = false;
      this.resetForm();
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
          this.handleClose(); // 关闭弹窗
          this.$emit('entryAdded'); // 触发事件通知父组件刷新条目
        }
      } catch (error) {
        console.error('添加知识条目失败:', error);
        this.$message.error('添加条目失败');
      }
    },
  },
};
</script>

<style scoped>
.add-btn {
  background-color: #67c23a;
  color: white;
}

.add-btn:hover {
  background-color: #58a428;
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
