import api from './api';

export interface AttendanceRecord {
    id: number;
    employee_id: number;
    first_name: string;
    last_name: string;
    department: string;
    date: string;
    check_in_time: string;
    check_out_time: string;
    status: 'Present' | 'Absent' | 'Late' | 'Permission';
}

export interface AttendanceStats {
    todayRate: string;
    present: number;
    total: number;
}

export const attendanceService = {
    getAttendance: async (date?: string): Promise<AttendanceRecord[]> => {
        const response = await api.get('/attendance', { params: { date } });
        return response.data;
    },
    
    logAttendance: async (data: Partial<AttendanceRecord>): Promise<{success: boolean, message: string}> => {
        const response = await api.post('/attendance/log', data);
        return response.data;
    },
    
    getStats: async (): Promise<AttendanceStats> => {
        const response = await api.get('/attendance/stats');
        return response.data;
    }
};
