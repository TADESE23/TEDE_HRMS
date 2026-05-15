import api from './api';

export interface DisciplinaryAction {
    id: number;
    employee_id: number;
    first_name?: string;
    last_name?: string;
    incident_date: string;
    violation_type: string;
    action_taken: string;
    file_path: string;
    created_at?: string;
}

export const disciplinaryService = {
    getActions: async (): Promise<DisciplinaryAction[]> => {
        const response = await api.get('/disciplinary');
        return response.data;
    },
    addAction: async (data: Partial<DisciplinaryAction>): Promise<{id: number}> => {
        const response = await api.post('/disciplinary', data);
        return response.data;
    }
};
