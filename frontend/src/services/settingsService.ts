import api from './api';

export interface College {
    id: number;
    name: string;
    dean_name: string;
    campus_id: number;
    departments?: Department[];
}

export interface Department {
    id: number;
    name: string;
    head_of_department: string;
    college_id: number;
}

export interface Job {
    id: number;
    grade_name: string;
    base_salary: number;
    max_salary: number;
    currency: string;
}

export const settingsService = {
    getStructure: async (): Promise<College[]> => {
        const response = await api.get('/settings/structure');
        return response.data;
    },
    
    addCollege: async (data: Partial<College>): Promise<College> => {
        const response = await api.post('/settings/structure/colleges', data);
        return response.data;
    },
    
    addDepartment: async (data: Partial<Department>): Promise<Department> => {
        const response = await api.post('/settings/structure/departments', data);
        return response.data;
    },
    
    getJobs: async (): Promise<Job[]> => {
        const response = await api.get('/settings/jobs');
        return response.data;
    },
    
    addJob: async (data: Partial<Job>): Promise<Job> => {
        const response = await api.post('/settings/jobs', data);
        return response.data;
    }
};
