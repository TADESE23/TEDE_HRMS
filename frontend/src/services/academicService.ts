import api from './api';

export const academicService = {
    getProfiles: async () => {
        const response = await api.get('/academic');
        return response.data;
    },
    addProfile: async (data: any) => {
        const response = await api.post('/academic', data);
        return response.data;
    }
};
