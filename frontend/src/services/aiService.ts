const API_URL = 'http://localhost:5000/api/ai';

export interface Forecast {
    id: number;
    forecast_date: string;
    metric: string;
    predicted_value: string;
    confidence_score: string;
}

export interface RankedCandidate {
    applicant_id: number;
    score: number;
    name: string;
    skills_matched: string;
}

export const aiService = {
    rankCandidates: async (vacancyId: number): Promise<RankedCandidate[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/rank-candidates/${vacancyId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to rank candidates');
        }

        return response.json();
    },

    getForecasts: async (): Promise<Forecast[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/forecasts`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch AI forecasts');
        }

        return response.json();
    },

    generateForecasts: async (): Promise<void> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to generate forecasts');
        }
    },

    getTurnoverRisk: async (): Promise<any[]> => {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/turnover-risk`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch turnover risk data');
        }

        const data = await response.json();
        return data.data; // The endpoint returns { success: true, data: [...] }
    }
};
