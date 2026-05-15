import api from './api';

export interface PerformanceGoal {
    id: number;
    employee_id: number;
    first_name?: string;
    last_name?: string;
    title: string;
    description: string;
    target_date: string;
    status: 'Not Started' | 'In Progress' | 'Completed' | 'On Hold';
}

export interface Appraisal {
    id: number;
    employee_id: number;
    emp_fn?: string;
    emp_ln?: string;
    reviewer_id: number;
    rev_fn?: string;
    rev_ln?: string;
    review_period: string;
    score: number;
    feedback: string;
    status: 'Draft' | 'Submitted' | 'Reviewed';
    created_at: string;
}

export const performanceService = {
    getGoals: async (employee_id?: number): Promise<PerformanceGoal[]> => {
        const response = await api.get('/performance/goals', { params: { employee_id } });
        return response.data;
    },
    
    addGoal: async (data: Partial<PerformanceGoal>): Promise<PerformanceGoal> => {
        const response = await api.post('/performance/goals', data);
        return response.data;
    },
    
    getAppraisals: async (employee_id?: number): Promise<Appraisal[]> => {
        const response = await api.get('/performance/appraisals', { params: { employee_id } });
        return response.data;
    },
    
    addAppraisal: async (data: Partial<Appraisal>): Promise<{success: boolean, id: number}> => {
        const response = await api.post('/performance/appraisals', data);
        return response.data;
    }
};
