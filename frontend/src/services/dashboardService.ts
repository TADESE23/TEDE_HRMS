const API_URL = 'http://localhost:5000/api/dashboard';

export interface DashboardStat {
    title: string;
    value: string;
    icon: string;
    trend?: {
        value: string;
        isPositive: boolean;
    };
}

export const dashboardService = {
    getStats: async (): Promise<DashboardStat[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch dashboard stats');
        }

        return response.json();
    },

    exportReport: async (): Promise<Blob> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/export`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to export report');
        }

        return response.blob();
    },

    getAnalytics: async (): Promise<{ name: string; value: number }[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/analytics`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch analytics');
        }

        return response.json();
    },

    getActivity: async (): Promise<{ type: string; message: string; time: string }[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/activity`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch activity');
        return response.json();
    },

    getCampusMetrics: async (): Promise<DashboardStat[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/campus-metrics`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch campus metrics');
        return response.json();
    },

    getStaffDistribution: async (): Promise<{ name: string; value: number }[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/staff-distribution`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch staff distribution');
        return response.json();
    },

    getRankDistribution: async (): Promise<{ name: string; value: number }[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/rank-distribution`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch rank distribution');
        return response.json();
    }
};
