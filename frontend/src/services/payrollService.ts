import api from './api';

export interface PayrollRecord {
    id: number;
    employee_id: number;
    first_name?: string;
    last_name?: string;
    employee_id_number?: string;
    department?: string;
    month_year: string;
    basic_salary: string;
    house_allowance: string;
    transport_allowance: string;
    taxable_income: string;
    income_tax: string;
    pension_7_percent: string;
    net_pay: string;
    status: 'Draft' | 'Processed' | 'Paid';
}

export const payrollService = {
    getRecords: async (month_year?: string): Promise<PayrollRecord[]> => {
        const response = await api.get('/payroll/records', { params: { month_year } });
        return response.data;
    },
    
    generatePayroll: async (month_year: string): Promise<{success: boolean, message: string}> => {
        const response = await api.post('/payroll/generate', { month_year });
        return response.data;
    },
    
    approvePayroll: async (id: number): Promise<{success: boolean}> => {
        const response = await api.put(`/payroll/records/${id}/approve`);
        return response.data;
    }
};
