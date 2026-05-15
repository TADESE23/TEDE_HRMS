import api from './api';

export interface LeaveRecord {
    id: number;
    employee_id: number;
    first_name?: string;
    last_name?: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    reason: string;
    status: string;
    admin_comments?: string;
}

export const leaveService = {
    getAllLeaves: async (): Promise<LeaveRecord[]> => {
        const response = await api.get('/leaves');
        return response.data;
    },
    updateLeaveStatus: async (id: number, status: string, comments: string = ""): Promise<{message: string}> => {
        const response = await api.put(`/leaves/${id}/status`, { status, comments });
        return response.data;
    }
};
