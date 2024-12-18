<template>
  <div>
    <!-- 查看详情按钮 -->
    <el-button size="mini" @click="viewDetails" type="text">查看详情</el-button>

    <!-- 查看详情的弹窗，添加 appendToBody 属性 -->
    <el-dialog
        v-model="detailDialogVisible"
        title="条目详情"
        width="60%"
        :append-to-body="true"
    >
      <div>
        <p><strong>标题:</strong> {{ currentEntry.title }}</p>
        <p><strong>内容:</strong> {{ currentEntry.content }}</p>

        <!-- 修改笔记 -->
        <el-form :model="form" label-width="80px">
          <el-form-item label="笔记">
            <el-input v-model="form.note" type="textarea" placeholder="请输入笔记"></el-input>
          </el-form-item>

          <!-- 修改优先级 -->
          <el-form-item label="优先级">
            <el-select v-model="form.preference_level" placeholder="选择优先级">
              <el-option label="⭐" :value="1" />
              <el-option label="⭐⭐" :value="2" />
              <el-option label="⭐⭐⭐" :value="3" />
              <el-option label="⭐⭐⭐⭐" :value="4" />
              <el-option label="⭐⭐⭐⭐⭐" :value="5" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">关闭</el-button>
        <el-button type="primary" @click="applyChanges">应用修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/components/axios-instance'; // 导入自定义的axios实例

export default {
  name: 'ViewDetailsButton',
  props: {
    entry: {  // 从父组件接收当前条目的数据
      type: Object,
      required: true,
    }
  },
  data() {
    return {
      detailDialogVisible: false, // 控制弹窗的显示
      currentEntry: {}, // 当前选中的条目
      form: {
        note: '', // 修改的笔记
        preference_level: 0, // 修改的优先级
      },
    };
  },
  methods: {
    // 查看详情
    viewDetails() {
      this.currentEntry = this.entry; // 传递当前条目数据
      this.form.note = this.currentEntry.note; // 初始化表单中的笔记
      this.form.preference_level = this.currentEntry.preference_level; // 初始化表单中的优先级
      this.detailDialogVisible = true; // 显示弹窗
    },
    // 关闭弹窗
    closeDialog() {
      this.detailDialogVisible = false;
    },

    async applyChanges() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.$message.error('请先登录');
        this.$router.push({ name: 'login' });
        return;
      }

      const { note, preference_level } = this.form;

      try {
        const response = await api.patch(
          `user-marks/${this.currentEntry.collected_mark_id}/`, // 使用条目的 ID 进行 PATCH 请求
          {
            note,
            preference_level,
          },
        );

        if (response.status === 200) {
          this.currentEntry.note = note;
          this.currentEntry.preference_level = preference_level;
          this.$message.success('修改成功');
          this.closeDialog(); // 关闭弹窗
          this.$emit('updateEntry'); // 通知父组件更新条目列表
        }
      } catch (error) {
        console.error('修改失败:', error);
        this.$message.error('修改失败，请重试');
      }
    },
  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end; /* 将按钮靠左排列 */
  gap: 10px; /* 增加按钮间距 */
}
</style>
