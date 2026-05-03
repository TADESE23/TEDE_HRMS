const API_URL = 'http://localhost:5000/api/departments';

export interface Department {
    id: number;
    name: string;
    college_id: number | null;
    college_name: string | null;
    head_of_department: number | null;
    employee_count: number;
}

export const departmentService = {
    async getAllDepartments(): Promise<Department[]> {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch departments');
        }
        return response.json();
    },

    async getDepartmentById(id: string): Promise<Department & { employees: any[] }> {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error('Failed to fetch department details');
        }
        return response.json();
    },

    async assignEmployee(employeeId: string | number, departmentId: string | number): Promise<{ message: string }> {
        const response = await fetch(`${API_URL}/assign-employee`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ employeeId, departmentId })
        });
        
        if (!response.ok) {
            throw new Error('Failed to assign employee to department');
        }
        return response.json();
    }
};
