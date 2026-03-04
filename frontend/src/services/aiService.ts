const API_URL = 'http://localhost:5000/api/ai';

export interface Forecast {
    id: number;
    forecast_date: string;
    metric: string;
    predicted_value: string;
    confidence_score: string;
}

export const aiService = {
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
    }
};
