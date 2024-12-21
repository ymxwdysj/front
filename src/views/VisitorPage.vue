<template>
  <div class="container">
    <!-- 按钮区域 -->
    <div class="button-group">
      <!-- 左侧按钮：返回按钮和搜索按钮 -->
      <div class="left-buttons">
        <el-button @click="goBack" type="primary" size="small" class="back-button">
          返回
        </el-button>
        <el-button @click="showLoginPrompt('search')" type="primary" size="small" class="search-button">
          🔍
        </el-button>
      </div>

      <!-- 右侧按钮：添加条目按钮 -->


    </div>

    <!-- 页面标题 -->
    <div class="flex-row-container">
      <h1 class="title">知识条目列表</h1>

      <!-- 添加条目按钮 -->
      <el-button @click="showLoginPrompt('add')" type="primary" size="small" class="add-button">
        添加条目
      </el-button>
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

      <!-- 操作列（例如收藏操作） -->
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="showLoginPrompt('collect')" type="text" size="mini">收藏</el-button>
        </template>
      </el-table-column>
    </el-table>

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
import { formatDate, truncateContent } from '@/services/utils.js';
import axios from 'axios';
import usePagination from "@/services/usePagination.js";

export default {
  data() {
    return {
      knowledgeEntries: [], // 知识条目列表
      dialogVisible: false, // 控制完整内容显示
      currentEntry: {}, // 当前选中的知识条目
      loading: false, // 加载状态
    };
  },
  mounted() {
    this.fetchKnowledgeEntries(); // 获取条目
  },
  methods: {
    // 获取条目列表
    async fetchKnowledgeEntries() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:5173/api/marks/');
        this.knowledgeEntries = response.data; // 直接赋值为返回的数据
        console.log(this.knowledgeEntries);
      } catch (error) {
        console.error('获取知识条目出错:', error);
        this.$message.error('获取知识条目失败，请稍后再试。');
      } finally {
        this.loading = false;
      }
    },

    // 查看完整内容
    showFullContent(entry) {
      this.currentEntry = entry;
      this.dialogVisible = true;
    },

    // 返回到欢迎页面
    goBack() {
      this.$router.push({ name: 'welcome' });
    },

    // 收藏、搜索或添加条目，提示登录
    showLoginPrompt(action) {
      this.$confirm('您需要登录才能进行此操作。', '提示', {
        confirmButtonText: '登录',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$router.push({name: 'login'});
      }).catch(() => {
        // 用户点击取消，什么也不做
      });
    },
  },
  setup() {
    return {
      truncateContent,
      formatDate,
    };
  },
};
</script>

<style scoped>

/* 样式可以根据需要调整 */
.container {
  padding: 20px;
}

.title {
  font-size: 24px;
  margin-bottom: 20px;
}

.dialog-section {
  margin-bottom: 10px;
}

.knowledge-table {
  margin-top: 20px;
}

/* 按钮区域的布局 */
.button-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

/* 左侧按钮（返回按钮和搜索按钮） */
.left-buttons {
  display: flex;
  gap: 10px;
}

/* 右侧按钮（添加条目按钮） */
.add-button {
  margin-left: auto; /* 将按钮推到最右侧 */
}

/* 按钮样式 */
.el-button {
  font-size: 14px;
  border-radius: 4px;
}

/* 自定义样式：橙色搜索按钮 */
.search-button {
  background-color: #FFA500; /* 橙色 */
  border-color: #FFA500;
  color: white;
}

.search-button:hover {
  background-color: #FF8C00;
  border-color: #FF8C00;
}

/* 自定义样式：绿色添加条目按钮 */
.add-button {
  background-color: #28a745; /* 绿色 */
  border-color: #28a745;
  color: white;
}

.add-button:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

/* 自定义对话框样式 */
.content-dialog .el-dialog__header {
  background-color: #f4f6f9;
  color: #2c3e50;
  font-size: 18px;
  text-align: center;
  padding: 20px;
  border-bottom: 2px solid #dcdfe6;
}

.flex-row-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.flex-row-container h1 {
  margin: 0;
  font-size: 24px; /* 设置标题大小 */
  color: #63afe3; /* 深色文字 */
  font-weight: bold; /* 加粗文字 */
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

.dialog-footer {
  text-align: center;
}


.el-dialog__body {
  padding: 20px;
}
</style>
