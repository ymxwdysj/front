// src/hooks/usePagination.js
import { ref } from 'vue';

export default function usePagination(fetchData) {
    const currentPage = ref(1);
    const totalCount = ref(0);
    const totalPages = ref(0);
    const pageSize = ref(5);
    const loading = ref(false);

    const handlePageChange = async (page) => {
        currentPage.value = page;
        await fetchData();
    };

    const setPaginationData = (data) => {
        totalCount.value = data.count;
        totalPages.value = Math.ceil(totalCount.value / pageSize.value);
    };

    return {
        currentPage,
        totalCount,
        totalPages,
        pageSize,
        loading,
        handlePageChange,
        setPaginationData,
    };
}
