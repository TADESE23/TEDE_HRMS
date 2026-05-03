import api from './api';

export const disciplinaryService = {
    getActions: async () => {
        const response = await api.get('/disciplinary');
        return response.data;
    },
    addAction: async (data: any) => {
        const response = await api.post('/disciplinary', data);
        return response.data;
    }
};
