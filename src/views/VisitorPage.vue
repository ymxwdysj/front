<template>
  <div class="container">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
    </div>

    <!-- 页面标题和展示内容 -->
    <h1 class="title">知识条目</h1>
    <p class="intro-text">展示您选择的素材类型：{{ category }}</p>

    <!-- 按钮区域，使用el-row来隔开按钮 -->
    <div class="button-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button @click="goToSearch" size="small" class="search-btn" block>跳转到搜索</el-button>
        </el-col>
        <el-col :span="12">
          <!-- 引入子组件并监听 entryAdded 事件 -->
          <add-knowledge-dialog @entryAdded="fetchKnowledgeEntries" />
        </el-col>
      </el-row>
    </div>

    <!-- 知识条目表格 -->
    <el-table :data="knowledgeEntries" class="knowledge-table" v-loading="loading">
      <el-table-column label="标题" prop="title" />
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

      <!-- 操作列，提示登录 -->
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="showLoginPrompt" type="text" size="mini">收藏</el-button>
        </template>
      </el-table-column>
    </el-table>


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

        <el-form-item class="form-buttons">
          <el-button @click="submitForm" class="submit-btn" type="primary">提交</el-button>
          <el-button @click="resetForm" class="reset-btn" type="warning">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalCount"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper"
        class="pagination"
    />


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

import FavoriteButton from '@/components/FavoriteButton.vue'; // 引入 FavoriteButton 组件
import AddKnowledgeDialog from '@/components/AddKnowledgeDialog.vue'; // 引入添加条目子组件
import { formatDate, truncateContent } from '@/services/utils.js';
import axios from "axios";

import usePagination from "@/services/usePagination.js";

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
      add_dialog_visible: false, // 控制添加条目弹窗显示
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
        const response = await axios.get('http://127.0.0.1:5173/api/marks/',
            {
              params: {
                page: this.currentPage, // 当前页
                page_size: this.pageSize, // 每页条数
              }
          },
        );

        this.knowledgeEntries = response.data.results;
        console.log(this.knowledgeEntries);

        this.setPaginationData(response.data);
      } catch (error) {
        console.error('获取知识条目出错:', error);
        this.$message.error('获取知识条目失败，请稍后再试。');
      } finally {
        this.loading = false;
      }
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

    // 收藏按钮点击，提示用户登录
    showLoginPrompt() {
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

    // 设置分页数据
    setPaginationData(data) {
      this.totalCount = data.count;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    },

    // 返回按钮
    goBack() {
      this.$router.push({name: 'welcome'});
    },

    // 跳转到搜索页面
    goToSearch() {
      this.$confirm('您需要登录才能进行此操作。', '提示', {
        confirmButtonText: '登录',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.$router.push({name: 'login'});
      }).catch(() => {
      });
    },
  },
  setup() {
    // 使用 usePagination 时需要传递一个数据获取函数
    const pagination = usePagination(async () => {
      await fetchKnowledgeEntries(); // 在 usePagination 中使用 fetchKnowledgeEntries 方法
    });

    return {
      ...pagination, // 返回分页数据
      truncateContent,
      formatDate,
    };

  },


};
</script>

<style scoped>
/* 样式与原页面相同，可以根据需要自定义 */
</style>