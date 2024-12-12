<template>
  <el-button
      :type="isFavorite ? 'danger' : 'primary'"
      @click="toggleFavorite"
      class="favorite-btn"
  >
    {{ isFavorite ? '取消收藏' : '收藏' }}
  </el-button>
</template>

<script>
import { toggleFavorite } from '@/components/userMarks.js'; // 引入切换收藏的接口

export default {
  props: {
    itemId: {
      type: Number,
      required: true,
    },
    isFavorite: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    async toggleFavorite() {
      try {
        // 切换收藏状态，mark 为 1 表示收藏，0 表示取消收藏
        await toggleFavorite(this.itemId , 'this.isFavorite ? 0 : 1', 0);

        // 触发父组件事件，更新收藏状态
        this.$emit('toggle-favorite', this.itemId);
      } catch (error) {
        console.error('Error toggling favorite:', error);
      }
    }
  }
};
</script>

<style scoped>
.favorite-btn {
  margin-top: 10px;
}
</style>
