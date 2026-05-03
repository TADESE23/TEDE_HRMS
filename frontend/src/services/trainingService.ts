import api from './api';

export const trainingService = {
    getTrainings: async () => {
        const response = await api.get('/training');
        return response.data;
    },
    addTraining: async (data: any) => {
        const response = await api.post('/training', data);
        return response.data;
    }
};
