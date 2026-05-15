import api from './api';

export interface SeparationRecord {
    id: number;
    employee_id: number;
    first_name?: string;
    last_name?: string;
    department?: string;
    separation_type: 'Resignation' | 'Retirement' | 'Termination' | 'Other';
    separation_date: string;
    reason: string;
    clearance_status: 'Pending' | 'In Progress' | 'Cleared';
}

export const separationService = {
    getSeparations: async (): Promise<SeparationRecord[]> => {
        const response = await api.get('/separations');
        return response.data;
    },
    addSeparation: async (data: Partial<SeparationRecord>): Promise<{id: number}> => {
        const response = await api.post('/separations', data);
        return response.data;
    }
};
