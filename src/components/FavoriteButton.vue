<template>
  <div>
    <!-- 收藏按钮 -->
    <el-button
        :type="isCollected ? 'danger' : 'primary'"
        @click="toggleFavorite"
    >
      {{ isCollected ? '取消收藏' : '收藏' }}
    </el-button>

    <!-- 收藏时弹出的对话框 -->
    <teleport to="body">
      <el-dialog
          v-model="addDialogVisible"
          title="收藏条目"
          :before-close="handleClose"
          width="50%"
      >
        <p>标题: {{ entry.title }}</p>
        <p>内容: {{ entry.content }}</p>

        <el-form :model="form" ref="formRef">
          <el-form-item label="备注">
            <el-input
                v-model="form.note"
                type="textarea"
                placeholder="请输入备注"
            />
          </el-form-item>
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

        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取消</el-button>
          <el-button
              type="primary"
              @click="submitCollection"
              :loading="isSubmitting"
          >
            确认收藏
          </el-button>
        </span>
      </el-dialog>
    </teleport>

    <!-- 取消收藏时的确认对话框 -->
    <teleport to="body">
      <el-dialog
          v-model="confirmDialogVisible"
          title="确认取消收藏"
          :before-close="handleClose"
          width="40%"
      >
        <p>标题: {{ entry.title }}</p>
        <p>内容: {{ entry.content }}</p>
        <p>确定要取消收藏条目吗？</p>

        <span slot="footer" class="dialog-footer">
          <el-button @click="confirmDialogVisible = false">取消</el-button>
          <el-button
              type="danger"
              @click="confirmCancelFavorite"
              :loading="isSubmitting"
          >
            确认取消
          </el-button>
        </span>
      </el-dialog>
    </teleport>
  </div>
</template>

<script>
import api from "@/components/axios-instance.js"; // 引入自定义 axios 实例

export default {
  props: {
    entry: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isCollected: this.entry.is_collected, // 收藏状态
      addDialogVisible: false, // 控制收藏对话框显示
      confirmDialogVisible: false, // 控制取消收藏对话框显示
      form: {
        note: '', // 备注
        preference_level: 1, // 收藏优先级
      },
      isSubmitting: false, // 提交按钮加载状态
    };
  },
  methods: {
    // 收藏按钮点击时的逻辑
    async toggleFavorite() {
      if (this.isCollected) {
        // 如果已经收藏，弹出确认取消收藏的对话框
        this.confirmDialogVisible = true;
      } else {
        // 否则弹出收藏的表单对话框
        this.addDialogVisible = true;
      }
    },

    // 关闭对话框
    handleClose(done) {
      done();
      this.form = { note: '', preference_level: 1 }; // 重置表单数据
    },

    // 提交收藏
    async submitCollection() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.$message.error('请先登录');
        this.$router.push({ name: 'login' });
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await api.post(
            `user-marks/`,
            {
              mark: this.entry.id,
              preference_level: this.form.preference_level,
              note: this.form.note,
            },
        );

        if (response.status === 201) {
          this.isCollected = true; // 更新收藏状态
          this.addDialogVisible = false;
          this.$emit("update:entry");
          this.$message.success("收藏成功");
        }
      } catch (error) {
        console.error("收藏失败:", error);
        this.$message.error("收藏操作失败，请重试");
      } finally {
        this.isSubmitting = false;
      }
    },

    // 确认取消收藏
    async confirmCancelFavorite() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        this.$message.error('请先登录');
        this.$router.push({ name: 'login' });
        return;
      }

      this.isSubmitting = true;

      try {
        const response = await api.delete(`user-marks/${this.entry.collected_mark_id}/`, {
        });

        if (response.status === 204 ) {
          if (!this.entry.is_inUser) {
            this.isCollected = false; // 更新收藏状态
          }
          this.confirmDialogVisible = false;
          this.$emit("update:entry");
          this.$message.success("取消收藏成功");
        }
      } catch (error) {
        console.error("取消收藏失败:", error);
        this.$message.error("取消收藏操作失败，请重试");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style scoped>
.dialog-footer {
  text-align: right;
}
</style>
