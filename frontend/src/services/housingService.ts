import api from './api';

export interface HousingRecord {
    id: number;
    employee_id: number;
    first_name?: string;
    last_name?: string;
    department?: string;
    building_name: string;
    unit_number: string;
    status: 'Waitlisted' | 'Allocated' | 'Vacated';
    allocation_date: string;
    notes: string;
}

export const housingService = {
    getHousing: async (): Promise<HousingRecord[]> => {
        const response = await api.get('/housing');
        return response.data;
    },
    addHousing: async (data: Partial<HousingRecord>): Promise<{id: number}> => {
        const response = await api.post('/housing', data);
        return response.data;
    }
};
