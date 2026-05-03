import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { EmployeeForm } from "../components/employees/EmployeeForm";
import { employeeService } from "../services/employeeService";
import { Loader2 } from "lucide-react";

export default function EmployeeFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    
    const [initialData, setInitialData] = useState<any>(null);
    const [loading, setLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing && id) {
            const loadEmployee = async () => {
                try {
                    let data;
                    if (id === 'me') {
                        data = await employeeService.getMe();
                    } else {
                        data = await employeeService.getEmployeeById(id);
                    }
                    // Map backend data to form fields
                    setInitialData({
                        firstName: data.first_name,
                        lastName: data.last_name,
                        email: data.email || data.email_personal || "",
                        idNumber: data.employee_id_number,
                        department: data.department_name || data.department || "",
                        role: data.role || data.staff_category || "",
                        status: data.status || "Active",
                        academicRank: data.academic?.rank || ""
                    });
                } catch (error: any) {
                    console.error("Failed to load employee for editing", error);
                    if (error.response?.status === 403) {
                        navigate("/employees/me");
                    } else {
                        navigate("/employees");
                    }
                } finally {
                    setLoading(false);
                }
            };
            loadEmployee();
        }
    }, [id, isEditing, navigate]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-500">Loading form data...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <EmployeeForm initialData={initialData} isEditing={isEditing} employeeId={id} />
        </div>
    );
}
