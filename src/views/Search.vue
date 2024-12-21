<template>
  <div class="search-container">
    <!-- 返回上一页按钮 -->
    <el-button @click="goBack" type="default" icon="el-icon-arrow-left" class="back-button">
      返回上一页
    </el-button>

    <div class="filters">
      <!-- 搜索框 -->
      <el-input
          v-model="searchQuery"
          placeholder="请输入搜索内容"
          clearable
          class="filter-item"
          prefix-icon="el-icon-search"
          size="medium"
      ></el-input>

      <!-- 标题筛选 -->
      <el-input
          v-model="title"
          placeholder="标题"
          clearable
          class="filter-item"
          size="medium"
      ></el-input>

      <!-- 学科筛选 -->
      <el-input
          v-model="category"
          placeholder="学科"
          clearable
          class="filter-item"
          size="medium"
      ></el-input>

      <!-- 创建日期筛选 -->
      <el-date-picker
          v-model="createdAtAfter"
          type="date"
          placeholder="创建日期之后"
          class="filter-item"
          size="medium"
      ></el-date-picker>
      <el-date-picker
          v-model="createdAtBefore"
          type="date"
          placeholder="创建日期之前"
          class="filter-item"
          size="medium"
      ></el-date-picker>

      <!-- 搜索按钮 -->
      <el-button
          type="primary"
          @click="handleSearch"
          class="filter-item"
          size="medium"
          icon="el-icon-search"
      >
        搜索
      </el-button>
    </div>

    <!-- 搜索结果表格 -->
    <el-table :data="results" class="results-table" border>
      <el-table-column label="标题" prop="title"></el-table-column>
      <el-table-column label="学科" prop="category"></el-table-column>
      <el-table-column label="内容" prop="content"></el-table-column>
      <el-table-column label="创建时间" prop="created_at"></el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalCount"
        @current-change="handlePageChange"
        layout="prev, pager, next, jumper"
        class="pagination"
    />
  </div>
</template>

<script>
import {ref} from "vue";
import api from "@/components/axios-instance.js"; // 使用自定义的 axios 实例
import {useRouter} from "vue-router"; // 导入 Vue Router

export default {
  name: "SearchPage",
  setup() {
    const router = useRouter(); // 获取路由对象

    // 绑定搜索输入框
    const searchQuery = ref("");
    const title = ref("");
    const category = ref("");
    const createdAtAfter = ref(null);
    const createdAtBefore = ref(null);
    const results = ref([]);
    const totalCount = ref(0); // 总结果数
    const totalPages = ref(0); // 总页数
    const currentPage = ref(1); // 当前页
    const pageSize = ref(1); // 每页条数

    // 返回上一页面
    const goBack = () => {
      router.go(-1); // 返回上一页
    };

    // 处理搜索逻辑
    const handleSearch = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        this.$message.error("请先登录");
        this.$router.push({name: "login"});
        return;
      }

      const params = {
        search: searchQuery.value,
        category: category.value || null,
        title: title.value || null,
        created_at_after: createdAtAfter.value || null,
        created_at_before: createdAtBefore.value || null,
        page: currentPage.value,
        page_size: pageSize.value, // 每页条数
      };

      try {
        const response = await api.get("collection/", {
          params,
        });
        if (response.data) {
          // 确保响应数据包含分页信息
          results.value = response.data.results || []; // 当前页的结果
          totalCount.value = response.data.count || 0; // 总条目数
          totalPages.value = Math.ceil(totalCount.value / pageSize.value); // 计算总页数
        } else {
          console.error("返回数据格式不正确", response.data);
          results.value = [];
        }
      } catch (error) {
        console.error("搜索请求失败", error);
        results.value = [];
      }
    };

    // 处理分页变化
    const handlePageChange = (page) => {
      currentPage.value = page;
      handleSearch(); // 请求新的页面数据
    };

    return {
      searchQuery,
      title,
      category,
      createdAtAfter,
      createdAtBefore,
      results,
      totalCount,
      totalPages,
      currentPage,
      pageSize,
      handleSearch,
      handlePageChange,
      goBack,
    };
  },
};
</script>

<style scoped>
/* 页面整体背景和边距 */
.search-container {
  padding: 30px;
  background: linear-gradient(135deg, #f7f9fc 0%, #e1e8f0 100%);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 返回上一页按钮 */
.back-button {
  font-weight: bold;
  margin-bottom: 20px;
  background-color: #409eff;
  color: white;
  border-radius: 5px;
  padding: 8px 16px;
  transition: all 0.3s;
}

.back-button:hover {
  background-color: #66b1ff;
}

/* 筛选部分样式 */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

/* 每个筛选项的样式 */
.filter-item {
  margin-bottom: 15px;
  min-width: 200px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}

/* 搜索框和日期选择器样式 */
.el-input, .el-date-picker, .el-button {
  font-size: 14px;
  padding: 12px 16px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.el-input:focus,
.el-date-picker:focus,
.el-button:hover {
  border-color: #409eff;
  box-shadow: 0 0 5px rgba(64, 158, 255, 0.5);
}

/* 搜索结果表格样式 */
.results-table {
  margin-top: 20px;
  width: 100%;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.results-table:hover {
  transform: translateY(-2px);
}

/* 表格中的文本样式 */
.el-table .cell {
  font-size: 14px;
  text-align: center;
  padding: 12px;
}

/* 分页器样式 */
.pagination {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .filter-item {
    min-width: 100%;
  }
}
</style>
