import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const employeeSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    idNumber: z.string().min(3, "ID Number is required"),
    department: z.string().min(1, "Department is required"),
    role: z.string().min(1, "Role is required"),
    status: z.enum(["Active", "On Leave", "Terminated"]),
    // Academic fields (optional/nullable in schema, simplified for now)
    academicRank: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
    initialData?: EmployeeFormData;
    isEditing?: boolean;
}

export function EmployeeForm({ initialData, isEditing = false }: EmployeeFormProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: initialData || {
            status: "Active",
            role: "Lecturer", // Default for easier testing
        },
    });

    const selectedRole = watch("role");
    const isAcademic = ["Lecturer", "Assistant Professor", "Associate Professor", "Professor"].includes(selectedRole);

    const onSubmit = async (data: EmployeeFormData) => {
        // Simulate API call
        console.log("Submitting:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/employees");
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {isEditing ? t('employeeForm.editEmployee') : t('employeeForm.newEmployee')}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {isEditing ? t('employeeForm.editDesc') : t('employeeForm.newDesc')}
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => navigate("/employees")}>
                        {t('employeeForm.cancel')}
                    </Button>
                    <Button type="submit" isLoading={isSubmitting} className="gap-2">
                        <Save className="h-4 w-4" />
                        {t('employeeForm.save')}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {t('employeeForm.personalInfo')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('employeeForm.firstName')}
                            {...register("firstName")}
                            error={errors.firstName?.message}
                            className="bg-white dark:bg-gray-900"
                        />
                        <Input
                            label={t('employeeForm.lastName')}
                            {...register("lastName")}
                            error={errors.lastName?.message}
                            className="bg-white dark:bg-gray-900"
                        />
                    </div>
                    <Input
                        label={t('employeeForm.email')}
                        type="email"
                        {...register("email")}
                        error={errors.email?.message}
                        className="bg-white dark:bg-gray-900"
                    />
                    <Input
                        label={t('employeeForm.idNumber')}
                        {...register("idNumber")}
                        error={errors.idNumber?.message}
                        className="bg-white dark:bg-gray-900"
                    />
                </div>

                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {t('employeeForm.employmentDetails')}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('employeeForm.department')}
                            </label>
                            <select
                                {...register("department")}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                            >
                                <option value="">{t('employeeForm.selectDepartment')}</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Engineering">Engineering</option>
                                <option value="Medicine">Medicine</option>
                                <option value="Human Resources">Human Resources</option>
                            </select>
                            {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('employeeForm.role')}
                            </label>
                            <select
                                {...register("role")}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                            >
                                <option value="">{t('employeeForm.selectRole')}</option>
                                <optgroup label={t('employeeForm.academic')}>
                                    <option value="Lecturer">Lecturer</option>
                                    <option value="Assistant Professor">Assistant Professor</option>
                                    <option value="Associate Professor">Associate Professor</option>
                                    <option value="Professor">Professor</option>
                                </optgroup>
                                <optgroup label={t('employeeForm.administrative')}>
                                    <option value="HR Officer">HR Officer</option>
                                    <option value="Department Head">Department Head</option>
                                    <option value="Administrator">Administrator</option>
                                </optgroup>
                            </select>
                            {errors.role && <p className="text-sm text-red-500 mt-1">{errors.role.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('employeeForm.status')}
                            </label>
                            <select
                                {...register("status")}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                            >
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Terminated">Terminated</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {isAcademic && (
                <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {t('employeeForm.academicInfo')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('employeeForm.academicRank')}
                            </label>
                            <select
                                {...register("academicRank")}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                            >
                                <option value="">{t('employeeForm.selectRank')}</option>
                                <option value="Lecturer">Lecturer</option>
                                <option value="Assistant Professor">Assistant Professor</option>
                                <option value="Associate Professor">Associate Professor</option>
                                <option value="Professor">Professor</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </form>
    );
}
