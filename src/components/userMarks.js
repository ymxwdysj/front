// src/api/userMarks.js
import api from './axios-instance.js';  // 引入自定义 axios 实例

/**
 * 收藏或取消收藏某个条目
 * @param {number} mark - 被收藏条目的 ID
 * @param {string} note - 用户备注
 * @param {number} preference_level - 收藏的优先级
 * @returns {Promise} - 返回请求的结果
 */
export const toggleFavorite = (mark, note = '', preference_level = 0) => {
    const data = {
        mark,  // 收藏条目的 ID
        note,  // 用户备注
        preference_level,  // 收藏优先级
    };

    return api.post('/user-marks/', data); // 发送请求，自动携带 Authorization 头部
};
