<template>
  <div class="container">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
    </div>

    <h1 class="title">用户信息</h1>
    <div v-if="user">
      <p><strong>用户名:</strong> {{ user.username }}</p>
      <!-- 修改密码按钮 -->
      <p><strong>登录时间:</strong> {{ formatDate(user.loginTime) }}</p>
      <el-button @click="openChangePasswordDialog" type="primary" size="large">修改密码</el-button>

      <h2 class="favorite-title">收藏的知识条目</h2>


      <!-- 知识条目表格 -->
      <el-table :data="favoriteKnowledgeEntries" class="knowledge-table">
        <!-- 表头类型选择 -->
        <el-table-column label="类型" prop="category">
          <template #header>
            <el-select v-model="selectedCategory" placeholder="选择类型" @change="loadFavoriteEntries" size="small">
              <el-option label="全部" value="all"></el-option> <!-- 添加全部选项 -->
              <el-option label="Poem" value="poem"></el-option>
              <el-option label="Math" value="Math"></el-option>
              <el-option label="Science" value="Science"></el-option>
              <el-option label="English" value="English"></el-option>
            </el-select>
          </template>
        </el-table-column>

        <!-- 标题列，展示前10个字符 -->
        <el-table-column label="标题" prop="title">
          <template #default="scope">
            <span class="ellipsis-text">{{ scope.row.title.length > 10 ? scope.row.title.slice(0, 10) + '...' : scope.row.title }}</span>
          </template>
        </el-table-column>

        <!-- 内容列，展示前10个字符 -->
        <el-table-column label="内容" prop="content">
          <template #default="scope">
            <span class="ellipsis-text">{{ scope.row.content.length > 10 ? scope.row.content.slice(0, 10) + '...' : scope.row.content }}</span>
          </template>
        </el-table-column>

        <!-- 笔记列，展示前10个字符 -->
        <el-table-column label="笔记" prop="note">
          <template #default="scope">
            <span class="ellipsis-text">{{ scope.row.note.length > 10 ? scope.row.note.slice(0, 10) + '...' : scope.row.note }}</span>
          </template>
        </el-table-column>

        <!-- 优先级列，支持排序 -->
        <el-table-column
          label="优先级"
          prop="preference_level"
          sortable
          :sort-method="sortPriority"
          @sort-change="toggleSortOrder"
        >
          <template #default="{ row }">
            <span>{{ renderPriority(row.preference_level) }}</span>
          </template>
        </el-table-column>

        <!-- 操作列，使用 flex 布局并排显示按钮 -->
        <el-table-column align="center" label="操作" width="220px">
          <template #default="scope">
            <div class="action-buttons">
              <!-- 取消收藏按钮 -->
              <favorite-button :entry="scope.row" @update:entry="updateEntry" />

              <!-- 查看详情按钮 -->
              <view-details-button :entry="scope.row" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-else>
      <p>未登录，无法查看用户信息。</p>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
        v-model="changePasswordDialogVisible"
        title="修改密码"
        :before-close="handleClose"
        width="50%"
    >
      <el-form :model="passwordForm" ref="passwordForm" label-width="120px">
        <el-form-item label="当前密码" :rules="[{ required: true, message: '请输入当前密码', trigger: 'blur' }]">
          <el-input v-model="passwordForm.currentPassword" type="password" placeholder="请输入当前密码" />
        </el-form-item>
        <el-form-item label="新密码" :rules="[{ required: true, message: '请输入新密码', trigger: 'blur' }]">
          <el-input v-model="passwordForm.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" :rules="[{ required: true, message: '请确认新密码', trigger: 'blur' }]">
          <el-input v-model="passwordForm.confirmPassword" type="password" placeholder="请再次确认新密码" />
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="changePasswordDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="isSubmitting" @click="submitPasswordChange">确认修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/components/axios-instance'; // 导入自定义的axios实例
import FavoriteButton from '@/components/FavoriteButton.vue'; // 导入 FavoriteButton 组件
import ViewDetailsButton from '@/components/ViewDetailsButton.vue'; // 引入 ViewDetailsButton 组件

export default {
  name: 'UserProfile',
  components: {
    FavoriteButton,
    ViewDetailsButton, // 注册 ViewDetailsButton 组件
  },
  data() {
    return {
      user: null,
      favoriteKnowledgeEntries: [],
      selectedCategory: 'all',
      sortBy: 'title', // 排序方式：标题或优先级
      sortOrder: 'asc', // 排序顺序：升序或降序
      changePasswordDialogVisible: false,
      passwordForm: {
        currentPassword: '', // 当前密码
        newPassword: '', // 新密码
        confirmPassword: '', // 确认密码
      },
      isSubmitting: false, // 提交按钮的加载状态
    };
  },
  mounted() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      this.$message.error('请先登录');
      this.$router.push({ name: 'login' });
    } else {
      const user = localStorage.getItem('user');
      if (user) {
        this.user = JSON.parse(user); // 确保从 localStorage 获取并解析 JSON 字符串
        this.loadFavoriteEntries(); // 用户登录后加载收藏的条目
      }
    }
  },
  methods: {
    // 获取用户的收藏条目，支持类型筛选
    loadFavoriteEntries() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.$message.error('请先登录');
        this.$router.push({ name: 'login' });
        return;
      }

      const params = {
        category: this.selectedCategory === 'all' ? '' : this.selectedCategory,  // 如果是“全部”，则传空字符串
        sort_by: this.sortBy, // 动态设置排序字段
        order: this.sortOrder, // 动态设置排序顺序
      };

      api.get('user-marks/', {
        headers: {Authorization: `Bearer ${token}`},
        params: params,  // 将类型作为请求参数传递
      })
          .then(response => {
            this.favoriteKnowledgeEntries = response.data.results.map(entry => {
              return {
                ...entry.mark,  // 复制 mark 对象的所有字段
                is_collected: true,  // 给每个条目添加 is_collected 属性，默认值为 true
                collected_mark_id: entry.id,
                preference_level: entry.preference_level,
                note: entry.note,
                is_inUser: true,
              };
            });
            if (this.favoriteKnowledgeEntries.length === 0) {
              this.$message.info('没有符合条件的收藏条目');
            }
          })
          .catch(error => {
            console.error('获取用户收藏条目失败:', error);
          });
    },

    // 更新收藏状态
    updateEntry() {
      this.loadFavoriteEntries();
    },

    openChangePasswordDialog() {
      this.changePasswordDialogVisible = true;
    },

    // 提交修改密码
    async submitPasswordChange() {
      // 表单验证
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.$message.error('新密码与确认密码不一致');
        return;
      }

      const token = localStorage.getItem('access_token');
      if (!token) {
        this.$message.error('请先登录');
        this.$router.push({name: 'login'});
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await api.post(
            'user/password/change/',
            this.passwordForm,
            {
              headers: {Authorization: `Bearer ${token}`},
            }
        );

        if (response.status === 200) {
          this.$message.success('密码修改成功');
          this.changePasswordDialogVisible = false; // 关闭对话框
        }
      } catch (error) {
        console.error('修改密码失败:', error);
        this.$message.error('密码修改失败，请重试');
      } finally {
        this.isSubmitting = false;
      }
    },

    // 关闭对话框
    handleClose(done) {
      done();
      this.passwordForm = {currentPassword: '', newPassword: '', confirmPassword: ''}; // 重置表单
    },
    // 排序优先级（升序或降序）
    sortPriority(a, b) {
      if (this.sortOrder === 'asc') {
        return a.preference_level - b.preference_level; // 升序
      } else {
        return b.preference_level - a.preference_level; // 降序
      }
    },

    // 返回上一页面
    goBack() {
      this.$router.go(-1);  // 返回上一个页面
    },

    formatDate(dateStr) {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    },
    renderPriority(priority) {
      let stars = '⭐'.repeat(priority); // 根据优先级的值生成相应数量的星星
      return stars;
    },
  }
};
</script>

<style scoped>
.ellipsis-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.knowledge-table {
  margin-top: 20px;
}

/* 按钮并排 */
.action-buttons {
  display: flex;
  justify-content: space-between;
}

.back-button {
  margin-bottom: 20px;
}

.title {
  margin-bottom: 10px;
}

.favorite-title {
  margin-top: 30px;
}
</style>
