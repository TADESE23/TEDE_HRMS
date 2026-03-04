import { useParams } from "react-router-dom";
import { EmployeeForm } from "../components/employees/EmployeeForm";

export default function EmployeeFormPage() {
    const { id } = useParams();
    const isEditing = !!id;

    // Mock data for editing
    const mockData = isEditing ? {
        firstName: "Abebe",
        lastName: "Bikila",
        email: "abebe.bikila@uog.edu.et",
        idNumber: "UOG-001",
        department: "Computer Science",
        role: "Associate Professor",
        status: "Active" as const,
        academicRank: "Associate Professor"
    } : undefined;

    return (
        <div className="max-w-4xl mx-auto">
            <EmployeeForm initialData={mockData} isEditing={isEditing} />
        </div>
    );
}
