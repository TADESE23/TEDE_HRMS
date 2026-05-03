import api from './api';

export const employeeService = {
    getAllEmployees: async () => {
        const response = await api.get('/employees');
        return response.data;
    },
    getEmployeeById: async (id: number | string) => {
        const response = await api.get(`/employees/${id}`);
        return response.data;
    },
    getMe: async () => {
        const response = await api.get('/employees/me');
        return response.data;
    },
    createEmployee: async (data: any) => {
        const response = await api.post('/employees', data);
        return response.data;
    },
    updateEmployee: async (id: number | string, data: any) => {
        const response = await api.put(`/employees/${id}`, data);
        return response.data;
    },
    updateProfilePhoto: async (id: number | string, file: File) => {
        const formData = new FormData();
        formData.append('photo', file);
        const response = await api.post(`/employees/${id}/photo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },
    deleteEmployee: async (id: number | string) => {
        const response = await api.delete(`/employees/${id}`);
        return response.data;
    }
};
