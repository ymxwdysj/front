<template>
  <div class="container">
    <!-- 按钮区域，返回按钮和跳转到搜索按钮放在同一行 -->
    <div class="button-row">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
      <el-button @click="goToSearch" size="small" class="search-btn">🔍</el-button>
    </div>

    <!-- 页面标题和展示内容 -->
    <div class="flex-row-container">
      <h1 class="intro-text">素材类型：{{ category }}</h1>

      <!-- 添加条目按钮 -->
      <add-knowledge-dialog @entryAdded="fetchKnowledgeEntries" />
    </div>

    <!-- 知识条目表格 -->
    <el-table :data="knowledgeEntries" class="knowledge-table" v-loading="loading">
      <el-table-column label="标题" prop="title" />
      <el-table-column label="标签">
        <template #default="scope">
          <div>
            <!-- 判断tags是否为空，若为空显示“无标签”，否则逐个显示标签并加逗号 -->
            <span v-if="scope.row.tags && scope.row.tags.length > 0">
        <span v-for="(tag, index) in scope.row.tags" :key="index">
          {{ tag.name }}<span v-if="index < scope.row.tags.length - 1">, </span>
        </span>
      </span>
            <span v-else>无标签</span>
          </div>
        </template>
      </el-table-column>
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

      <el-table-column label="类型" prop="category" />
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
    <el-dialog
        title="添加知识条目"
        v-model="add_dialog_visible"
        width="60%"
        :before-close="handleClose"
        class="add-dialog"
    >
      <el-form :model="knowledgeForm" ref="addFormRef" class="form-container">
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

        <el-form-item class="form-buttons">
          <el-button @click="submitForm" class="submit-btn" type="primary">提交</el-button>
          <el-button @click="resetForm" class="reset-btn" type="warning">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 查看完整内容的对话框 -->
    <el-dialog
        v-model="dialogVisible"
        width="50%"
        @close="dialogVisible = false"
        class="content-dialog"
    >
      <!-- 标题显示 -->
      <div class="dialog-section">
        <strong>标题：</strong> {{ currentEntry.title }}
      </div>

      <!-- 类型显示 -->
      <div class="dialog-section">
        <strong>类型：</strong> {{ currentEntry.category }}
      </div>

      <!-- 内容显示 -->
      <div class="dialog-section">
        <strong>内容：</strong>
        <p>{{ currentEntry.content }}</p>
      </div>

      <!-- 创建时间显示 -->
      <div class="dialog-section">
        <strong>创建时间：</strong> {{ formatDate(currentEntry.created_at) }}
      </div>

      <!-- 按钮区 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/components/axios-instance.js"; // 引入自定义 axios 实例
import FavoriteButton from '@/components/FavoriteButton.vue'; // 引入 FavoriteButton 组件
import usePagination from '@/services/usePagination.js'; // 引入分页逻辑封装
import useForm from '@/services/useForm.js'; // 引入表单处理封装
import AddKnowledgeDialog from '@/components/AddKnowledgeDialog.vue'; // 引入添加条目子组件
import { formatDate, truncateContent } from '@/services/utils.js'; // 引入工具函数

export default {
  components: {
    FavoriteButton, // 注册 FavoriteButton 组件
    AddKnowledgeDialog, // 注册 AddKnowledgeDialog 组件
  },
  data() {
    return {
      knowledgeEntries: [], // 知识条目列表
      category: '', // 当前选择的科目
      dialogVisible: false, // 控制完整内容显示
      currentEntry: {}, // 当前选中的知识条目
    };
  },
  mounted() {
    const category = this.$route.query.category;
    if (!category) {
      this.$router.push({name: 'choose-subject'});
      return;
    }

    this.category = category;
    this.fetchKnowledgeEntries(); // 获取条目
  },
  methods: {
    // 获取条目列表
    async fetchKnowledgeEntries() {
      this.loading = true;
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.$message.error('请先登录');
        this.$router.push({name: 'login'});
        return;
      }

      try {
        const response = await api.get('collection/', {
          params: {category: this.category, page: this.currentPage, page_size: this.pageSize},
        });

        this.knowledgeEntries = response.data.results;
        this.setPaginationData(response.data);
      } catch (error) {
        console.error('获取知识条目出错:', error);
        this.$message.error('获取知识条目失败，请稍后再试。');
      } finally {
        this.loading = false;
      }
    },

    // 更新收藏状态
    updateEntryFavoriteStatus() {
      this.fetchKnowledgeEntries(); // 更新收藏后刷新条目
    },

    // 分页变更处理
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchKnowledgeEntries(); // 每次切换分页时获取数据
    },

    // 查看完整内容
    showFullContent(entry) {
      this.currentEntry = entry;
      this.dialogVisible = true;
    },

    // 表单提交
    async submitForm() {
      try {
        await this.submitForm(this.$refs.addFormRef);
        this.fetchKnowledgeEntries(); // 刷新知识条目
        this.$message.success('条目添加成功');
      } catch (error) {
        this.$message.error(error);
      }
    },

    // 重置表单
    resetForm() {
      this.resetForm(this.$refs.addFormRef);
    },

    // 返回按钮
    goBack() {
      this.$router.push({name: 'choose-subject'});
    },

    // 跳转到搜索页面
    goToSearch() {
      this.$router.push({name: 'search'});
    },

    // 关闭弹窗
    handleClose(done) {
      this.add_dialog_visible = false;
      done();
    },

    // 设置分页数据
    setPaginationData(data) {
      this.totalCount = data.count;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    },
  },
  setup() {
    // 使用 `usePagination` 时需要传递一个数据获取函数
    const pagination = usePagination(async () => {
      await fetchKnowledgeEntries(); // 在 `usePagination` 中使用 `fetchKnowledgeEntries` 方法
    });

    return {
      ...pagination, // 返回分页数据
      truncateContent,
      formatDate,
    };
  },

  ...useForm(),  // 引入表单逻辑
};
</script>

<style scoped>
/* 使弹窗的标题更加突出 */
.add-dialog .el-dialog__header {
  background-color: #f4f6f9;
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  padding: 20px;
  border-bottom: 2px solid #dcdfe6;
}

/* 调整表单容器样式 */
.form-container {
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
}

/* 调整每个表单项的样式 */
.el-form-item {
  margin-bottom: 15px;
}

/* 按钮区的样式 */
.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

/* 调整提交和重置按钮的样式 */
.submit-btn {
  width: 48%;
}

.reset-btn {
  width: 48%;
}

/* 重置按钮的颜色 */
.reset-btn {
  background-color: #f1c40f;
  color: white;
  border-color: #f1c40f;
}

/* 调整查看完整内容对话框样式 */
.content-dialog .el-dialog__header {
  background-color: #f4f6f9;
  color: #2c3e50;
  font-size: 18px;
  text-align: center;
  padding: 20px;
  border-bottom: 2px solid #dcdfe6;
}

/* 对话框各部分的样式 */
.dialog-section {
  font-size: 16px;
  margin-bottom: 15px;
  color: #34495e;
}

.dialog-section strong {
  color: #2c3e50;
}

.dialog-section p {
  margin: 5px 0 0 0;
  white-space: pre-wrap; /* 保持换行格式 */
}

/* 弹窗的内容 */
.el-dialog__body {
  padding: 20px;
}

/* 自定义按钮的样式 */
.dialog-footer {
  text-align: center;
}

/* 增加弹窗边距和阴影效果 */
.el-dialog {
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 使素材类型和添加条目按钮在同一行 */
.flex-row-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.flex-row-container h1 {
  margin: 0;
  font-size: 24px;  /* 设置标题大小 */
  color: #63afe3;  /* 深色文字 */
  font-weight: bold;  /* 加粗文字 */
}

/* 按钮区域样式 */
.button-row {
  display: flex;
  justify-content: flex-start;  /* 将按钮对齐到左边 */
  gap: 16px;  /* 设置按钮之间的间距 */
  padding: 10px 0;  /* 上下内边距 */
}

.back-btn, .search-btn {
  border-radius: 8px; /* 圆角 */
  font-size: 14px; /* 字体大小 */
  padding: 10px 20px; /* 增加按钮的内边距 */
  transition: all 0.3s ease; /* 添加过渡效果 */
}

.back-btn {
  background-color: #3498db; /* 按钮背景色 */
  border: 1px solid #2980b9; /* 按钮边框 */
  color: white; /* 按钮文字颜色 */
}

.search-btn {
  background-color: #f39c12; /* 按钮背景色 */
  border: 1px solid #e67e22; /* 按钮边框 */
  color: white; /* 按钮文字颜色 */
}

.back-btn:hover {
  background-color: #2980b9; /* 悬停时改变背景色 */
  border-color: #1d5b86; /* 悬停时改变边框色 */
  transform: translateY(-2px); /* 增加悬停效果 */
}

.search-btn:hover {
  background-color: #e67e22; /* 悬停时改变背景色 */
  border-color: #d35400; /* 悬停时改变边框色 */
  transform: translateY(-2px); /* 增加悬停效果 */
}

.back-btn:focus, .search-btn:focus {
  outline: none; /* 去掉按钮点击时的默认边框 */
  box-shadow: 0 0 5px rgba(52, 152, 219, 0.5); /* 聚焦时的阴影效果 */
}
</style>

