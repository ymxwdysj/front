import { reactive } from 'vue';
import api from '@/components/axios-instance.js';

export default function useForm() {
    const knowledgeForm = reactive({
        title: '',
        content: '',
        category: '',
    });
    const add_dialog_visible = reactive(false);

    const resetForm = (formRef) => {
        formRef.resetFields();
    };

    const submitForm = async (formRef) => {
        if (!knowledgeForm.title || !knowledgeForm.content || !knowledgeForm.category) {
            return Promise.reject('请填写所有字段');
        }

        try {
            const response = await api.post('marks/', knowledgeForm);
            if (response.status === 201) {
                add_dialog_visible.value = false;
                resetForm(formRef);
                return Promise.resolve();
            }
        } catch (error) {
            return Promise.reject('添加知识条目失败');
        }
    };

    return {
        knowledgeForm,
        add_dialog_visible,
        resetForm,
        submitForm,
    };
}
