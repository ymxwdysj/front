<template>
  <div class="container">
    <!-- 返回按钮 -->
    <div class="back-button">
      <el-button @click="goBack" size="small" class="back-btn">返回</el-button>
    </div>

    <!-- 页面标题和展示内容 -->
    <h1 class="title">管理员知识条目</h1>
    <p class="intro-text">展示所有知识条目</p>

    <!-- 按钮区域 -->
    <div class="button-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-button @click="goToSearch" size="small" class="search-btn" block>跳转到搜索</el-button>
        </el-col>
        <el-col :span="12">
          <!-- 添加知识条目按钮 -->
          <el-button @click="showAddDialog" size="small" class="add-btn" block>添加条目</el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 知识条目表格 -->
    <el-table :data="knowledgeEntries" class="knowledge-table" v-loading="loading">
      <el-table-column label="类型">
        <template #header>
          <el-select v-model="category" placeholder="请选择类型" @change="fetchKnowledgeEntries" size="small">
            <el-option label="Poem" value="poem" />
            <el-option label="Math" value="math" />
            <el-option label="Science" value="science" />
            <el-option label="English" value="english" />
            <el-option label="全部科目" value="" />
          </el-select>
        </template>
        <template #default="scope">
          <span>{{ scope.row.category }}</span>
        </template>
      </el-table-column>

      <!-- 标题 -->
      <el-table-column label="标题" prop="title" />

      <!-- 标签 -->
      <el-table-column label="标签">
        <template #default="scope">
          <div>
            <span v-if="scope.row.tags && scope.row.tags.length">
              <el-tag
                v-for="(tag, index) in scope.row.tags"
                :key="index"
                :type="getTagType(tag.name)"
              >
                {{ tag.name }}
              </el-tag>
            </span>
            <span v-else>无标签</span>
          </div>
        </template>
      </el-table-column>



      <!-- 内容 -->
      <el-table-column label="内容">
        <template #default="scope">
          <div>
            <span>{{ truncateContent(scope.row.content) }}</span>
            <el-button v-if="scope.row.content.length > 10" type="text" size="mini" @click="showFullContent(scope.row)">
              展开
            </el-button>
          </div>
        </template>
      </el-table-column>

      <!-- 创建时间 -->
      <el-table-column label="创建时间" prop="created_at">
        <template #default="scope">
          <span>{{ formatDate(scope.row.created_at) }}</span>
        </template>
      </el-table-column>

      <!-- 操作列 -->
      <el-table-column label="操作">
        <template #default="scope">
          <el-button @click="editEntry(scope.row)" type="text" size="mini">编辑</el-button>
          <el-button @click="confirmDeleteDialog(scope.row)" type="text" size="mini" style="color: red;">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加条目的弹窗 -->
    <el-dialog title="添加知识条目" v-model="add_dialog_visible" width="60%" :before-close="handleClose" class="add-dialog">
      <el-form :model="knowledgeForm" ref="addFormRef" class="form-container">
        <el-form-item label="标题">
          <el-input v-model="knowledgeForm.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="knowledgeForm.content" autocomplete="off" />
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="knowledgeForm.category" placeholder="请选择类型">
            <el-option label="Poem" value="poem" />
            <el-option label="Math" value="math" />
            <el-option label="Science" value="science" />
            <el-option label="English" value="english" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签">
          <!-- 动态渲染标签输入框 -->
          <div v-for="(tag, index) in tagInputs" :key="index" class="tag-input-group">
            <el-input v-model="tagInputs[index]" placeholder="请输入标签" @blur="handleTagBlur" />
            <!-- 将按钮图标改为 "+" -->
            <el-button @click="addTagInput" icon="el-icon-plus" size="mini" circle></el-button>
          </div>
        </el-form-item>


        <el-form-item class="form-buttons">
          <el-button @click="submitForm" class="submit-btn" type="primary">提交</el-button>
          <el-button @click="resetForm" class="reset-btn" type="warning">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 编辑条目的弹窗 -->
    <el-dialog title="编辑知识条目" v-model="edit_dialog_visible" width="60%" :before-close="handleClose" class="edit-dialog">
      <el-form :model="currentEntry" ref="editFormRef" class="form-container">
        <el-form-item label="标题">
          <el-input v-model="currentEntry.title" autocomplete="off" />
        </el-form-item>
        <el-form-item label="内容">
          <el-input v-model="currentEntry.content" autocomplete="off" />
        </el-form-item>

        <el-form-item label="类型">
          <el-select v-model="currentEntry.category" placeholder="请选择类型">
            <el-option label="Poem" value="poem" />
            <el-option label="Math" value="math" />
            <el-option label="Science" value="science" />
            <el-option label="English" value="english" />
          </el-select>
        </el-form-item>

        <el-form-item label="标签">
          <el-input v-model="currentEntry.tags" placeholder="输入标签，用逗号分隔" />
        </el-form-item>

        <el-form-item class="form-buttons">
          <el-button @click="submitEditForm" class="submit-btn" type="primary">提交</el-button>
          <el-button @click="cancelEdit" class="reset-btn" type="warning">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 删除确认弹窗 -->
    <el-dialog
      title="确认删除"
      v-model="deleteConfirmVisible"
      width="30%"
      @close="cancelDelete"
    >
      <div>
        <p><strong>标题：</strong>{{ currentEntry.title }}</p>
        <p><strong>标签：</strong>{{ currentEntry.tags.map(tag => tag.name).join(", ") || "无标签" }}</p>
        <p><strong>类型：</strong>{{ currentEntry.category }}</p>
        <p><strong>内容：</strong>{{ currentEntry.content }}</p>
        <p><strong>创建时间：</strong>{{ formatDate(currentEntry.created_at) }}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelDelete">取消</el-button>
        <el-button type="primary" @click="deleteEntryConfirm">确认</el-button>
      </span>
    </el-dialog>

    <!-- 查看完整内容的对话框 -->
    <el-dialog v-model="dialogVisible" width="50%" @close="dialogVisible = false" class="content-dialog">
      <div class="dialog-section">
        <strong>标题：</strong> {{ currentEntry.title }}
      </div>
      <div class="dialog-section">
        <strong>标签：</strong>
        <span>{{ currentEntry.tags.map(tag => tag.name).join(", ") || "无标签" }}</span>
      </div>
      <div class="dialog-section">
        <strong>类型：</strong> {{ currentEntry.category }}
      </div>
      <div class="dialog-section">
        <strong>内容：</strong>
        <p>{{ currentEntry.content }}</p>
      </div>
      <div class="dialog-section">
        <strong>创建时间：</strong> {{ formatDate(currentEntry.created_at) }}
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false" type="primary">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/components/axios-instance.js";
import { formatDate, truncateContent } from "@/services/utils.js";
import axios from "axios";

export default {
  data() {
    return {
      knowledgeEntries: [],
      category: "",
      dialogVisible: false,
      add_dialog_visible: false,
      edit_dialog_visible: false,
      deleteConfirmVisible: false,
      currentEntry: {},
      knowledgeForm: {
        title: "",
        content: "",
        category: "",
        tags: "",
      },
      loading: false,
      tagInputs: [""] // 用于动态添加标签输入框
    };
  },
  mounted() {
    this.fetchKnowledgeEntries();
  },
  methods: {
    // 删除确认
    confirmDeleteDialog(entry) {
      this.currentEntry = entry;  // 设置当前条目
      this.deleteConfirmVisible = true;  // 打开删除确认弹窗
    },

    cancelDelete() {
      this.deleteConfirmVisible = false;  // 关闭弹窗
    },

    async deleteEntryConfirm() {
      try {
        // 调用API删除当前条目
        await api.delete(`marks/${this.currentEntry.id}/`);
        this.$message.success("删除成功");
        this.deleteConfirmVisible = false;  // 关闭弹窗
        this.fetchKnowledgeEntries();  // 刷新知识条目列表
      } catch (error) {
        this.$message.error("删除失败");
      }
    },

    // 获取知识条目
    async fetchKnowledgeEntries() {
      this.loading = true;
      try {
        const response = await axios.get('http://127.0.0.1:5173/api/marks/', {
          params: {
            category: this.category,
          },
        });
        this.knowledgeEntries = response.data;
      } catch (error) {
        console.error("获取知识条目出错:", error);
        this.$message.error("获取知识条目失败，请稍后再试。");
      } finally {
        this.loading = false;
      }
    },

    showFullContent(entry) {
      this.currentEntry = entry;
      this.dialogVisible = true;
    },

    // 显示添加条目弹窗
    showAddDialog() {
      this.add_dialog_visible = true;
    },

    async submitForm() {
      try {
        // 过滤掉空标签，处理标签
        const tags = this.tagInputs.filter(tag => tag.trim()).map(tag => tag.trim());
        const formData = {
          ...this.knowledgeForm,
          tags: tags,
        };
        await api.post("marks/", formData);
        this.$message.success("条目添加成功");
        this.fetchKnowledgeEntries();
        this.add_dialog_visible = false;
      } catch (error) {
        this.$message.error("添加条目失败，请稍后再试。");
      }
    },

    resetForm() {
      this.knowledgeForm = {
        title: "",
        content: "",
        category: "",
        tags: "",
      };
      this.tagInputs = [""]; // 初始化标签输入框
    },

    // 添加标签输入框
    addTagInput() {
      this.tagInputs.push(""); // 向tagInputs数组中添加一个空字符串，用于新的标签输入框
    },

    // 标签输入框失去焦点时处理
    handleTagBlur() {
      // 可以在这里处理标签的逻辑
    },

    async editEntry(entry) {
      this.currentEntry = { ...entry };
      this.edit_dialog_visible = true;
    },

    async submitEditForm() {
      try {
        const data = {
          title: this.currentEntry.title,
          content: this.currentEntry.content,
          category: this.currentEntry.category,
        };
        console.log(data,this.currentEntry.id);
        await api.put(`marks/${this.currentEntry.id}/`, data);

        this.$message.success("条目更新成功");
        this.fetchKnowledgeEntries();
        this.edit_dialog_visible = false;
      } catch (error) {
        this.$message.error("更新条目失败，请稍后再试。");
      }
    },

    cancelEdit() {
      this.edit_dialog_visible = false;
    },

    // 删除条目
    async deleteEntry(id) {
      try {
        await api.delete(`marks/${id}/`);
        this.$message.success("条目删除成功");
        this.fetchKnowledgeEntries();
      } catch (error) {
        this.$message.error("删除条目失败，请稍后再试。");
      }
    },

    goBack() {
      this.$router.push({name: "welcome"});
    },

    goToSearch() {
      this.$router.push({name: "search"});
    },
    getTagType(tagName) {
      const tagTypes = {
        "Poem": "success",
        "Math": "info",
        "Science": "warning",
        "English": "primary",
      };
      return tagTypes[tagName] || "default";  // 如果没有匹配类型，默认使用 "default"
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
.container {
  padding: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
}

.intro-text {
  font-size: 16px;
  color: #888;
}

.button-container {
  margin-top: 20px;
}

.search-btn {
  background-color: #6065D9;
  color: white;
}

.add-btn {
  background-color: #17D7FA;
  color: white;
}

.knowledge-table {
  margin-top: 20px;
}

.form-container {
  padding: 20px;
}

.tag-input-group {
  display: flex;
  margin-bottom: 10px;
}

.submit-btn {
  margin-right: 10px;
}

.reset-btn {
  margin-left: 10px;
}

.dialog-section {
  margin-bottom: 10px;
}

.content-dialog .dialog-footer {
  text-align: center;
}
</style>
