import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Lock, Info } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { departmentService, type Department } from "../../services/departmentService";
import { employeeService } from "../../services/employeeService";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/cn";

const employeeSchema = z.object({
    firstName: z.string().min(2, "First name is required"),
    middleName: z.string().optional(),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    emailPersonal: z.string().email("Invalid email address").optional().or(z.literal("")),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    dateOfBirth: z.string().min(1, "Date of birth is required"),
    gender: z.enum(["Male", "Female"]),
    address: z.string().optional(),
    idNumber: z.string().min(3, "ID Number is required"),
    department: z.string().min(1, "Department is required"),
    role: z.string().min(1, "Role is required"),
    status: z.enum(["Active", "On Leave", "Terminated", "Study Leave", "Retired"]),
    academicRank: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters").optional().or(z.literal("")),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
    initialData?: EmployeeFormData;
    isEditing?: boolean;
    employeeId?: string;
}

export function EmployeeForm({ initialData, isEditing = false, employeeId }: EmployeeFormProps) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [departments, setDepartments] = useState<Department[]>([]);

    // Check if user has permission to edit administrative fields
    const isAdmin = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'HR Officer';
    const isSelfService = isEditing && !isAdmin;

    useEffect(() => {
        const loadDepartments = async () => {
            try {
                const data = await departmentService.getAllDepartments();
                setDepartments(data);
            } catch (err) {
                console.error("Failed to load departments", err);
            }
        };
        loadDepartments();
    }, []);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<EmployeeFormData>({
        resolver: zodResolver(employeeSchema),
        defaultValues: initialData || {
            status: "Active",
            role: "Lecturer",
            gender: "Male"
        },
    });

    const selectedRole = watch("role");
    const isAcademic = ["Lecturer", "Assistant Professor", "Associate Professor", "Professor"].includes(selectedRole);

    const firstName = watch("firstName");
    const lastName = watch("lastName");
    const currentEmail = watch("email");

    useEffect(() => {
        // Auto-generate email only when creating new employee and fields are empty/unchanged
        if (!isEditing && firstName && lastName && (!currentEmail || currentEmail.includes("@uog.edu.et"))) {
            const cleanFirst = firstName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
            const cleanLast = lastName.toLowerCase().trim().replace(/[^a-z0-9]/g, '');
            if (cleanFirst && cleanLast) {
                setValue("email", `${cleanFirst}.${cleanLast}@uog.edu.et`);
            }
        }
    }, [firstName, lastName, isEditing, setValue]);

    const onSubmit = async (data: EmployeeFormData) => {
        try {
            if (isEditing && employeeId) {
                await employeeService.updateEmployee(employeeId, data);
                navigate(`/employees/${employeeId}`);
            } else {
                await employeeService.createEmployee(data);
                navigate("/employees");
            }
        } catch (error) {
            console.error("Failed to save employee", error);
        }
    };

    const LockedBadge = () => (
        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 ml-2 uppercase tracking-wider">
            <Lock className="h-2.5 w-2.5" />
            HR Managed
        </span>
    );

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
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                        {t('employeeForm.cancel')}
                    </Button>
                    <Button type="submit" isLoading={isSubmitting} className="gap-2">
                        <Save className="h-4 w-4" />
                        {t('employeeForm.save')}
                    </Button>
                </div>
            </div>

            {isSelfService && (
                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-3 items-start">
                    <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-blue-900">Self-Service Mode</h4>
                        <p className="text-sm text-blue-700">
                            Some employment details are locked and can only be updated by the HR Department. 
                            However, you can update your personal contact information and personal details.
                        </p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Personal Information */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-primary-500 pl-3">
                        {t('employeeForm.personalInfo')}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('employeeForm.firstName')}
                            {...register("firstName")}
                            error={errors.firstName?.message}
                            className="bg-gray-50/50 dark:bg-gray-900"
                        />
                        <Input
                            label="Middle Name"
                            {...register("middleName")}
                            error={errors.middleName?.message}
                            className="bg-gray-50/50 dark:bg-gray-900"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t('employeeForm.lastName')}
                            {...register("lastName")}
                            error={errors.lastName?.message}
                            className="bg-gray-50/50 dark:bg-gray-900"
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Gender
                            </label>
                            <select
                                {...register("gender")}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="Date of Birth"
                            type="date"
                            {...register("dateOfBirth")}
                            error={errors.dateOfBirth?.message}
                            className="bg-gray-50/50 dark:bg-gray-900"
                        />
                        <Input
                            label="Phone Number"
                            {...register("phone")}
                            error={errors.phone?.message}
                            className="bg-gray-50/50 dark:bg-gray-900"
                        />
                    </div>
                    <Input
                        label="Personal Email"
                        type="email"
                        {...register("emailPersonal")}
                        error={errors.emailPersonal?.message}
                        className="bg-gray-50/50 dark:bg-gray-900"
                        placeholder="personal@example.com"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Home Address
                        </label>
                        <textarea
                            {...register("address")}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white min-h-[80px]"
                            placeholder="Current living address..."
                        />
                    </div>
                </div>

                {/* Employment Details */}
                <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-l-4 border-primary-500 pl-3">
                        {t('employeeForm.employmentDetails')}
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Official Email
                                {isSelfService && <LockedBadge />}
                            </label>
                            <Input
                                type="email"
                                {...register("email")}
                                disabled={isSelfService}
                                error={errors.email?.message}
                                className={cn("bg-gray-50/50 dark:bg-gray-900", isSelfService && "bg-gray-100 cursor-not-allowed opacity-75")}
                            />
                        </div>

                        {!isEditing && (
                            <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-lg border border-amber-100 dark:border-amber-900/30">
                                <label className="block text-sm font-medium text-amber-900 dark:text-amber-400 mb-1">
                                    Initial Account Password
                                </label>
                                <Input
                                    type="text"
                                    {...register("password")}
                                    placeholder="e.g. Welcome@2026"
                                    error={errors.password?.message}
                                    className="bg-white dark:bg-gray-900"
                                />
                                <p className="text-[11px] text-amber-700 dark:text-amber-500 mt-2 italic">
                                    Note: The employee will use this password for their first login and can change it later.
                                </p>
                            </div>
                        )}

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('employeeForm.idNumber')}
                                {isSelfService && <LockedBadge />}
                            </label>
                            <Input
                                {...register("idNumber")}
                                disabled={isSelfService}
                                error={errors.idNumber?.message}
                                className={cn("bg-gray-50/50 dark:bg-gray-900", isSelfService && "bg-gray-100 cursor-not-allowed opacity-75")}
                            />
                        </div>
                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('employeeForm.department')}
                                {isSelfService && <LockedBadge />}
                            </label>
                            <select
                                {...register("department")}
                                disabled={isSelfService}
                                className={cn(
                                    "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white",
                                    isSelfService && "bg-gray-100 cursor-not-allowed opacity-75"
                                )}
                            >
                                <option value="">{t('employeeForm.selectDepartment')}</option>
                                {departments.map(dept => (
                                    <option key={dept.id} value={dept.name}>{dept.name}</option>
                                ))}
                            </select>
                            {errors.department && <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>}
                        </div>

                        <div>
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('employeeForm.role')}
                                {isSelfService && <LockedBadge />}
                            </label>
                            <select
                                {...register("role")}
                                disabled={isSelfService}
                                className={cn(
                                    "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white",
                                    isSelfService && "bg-gray-100 cursor-not-allowed opacity-75"
                                )}
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
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('employeeForm.status')}
                                {isSelfService && <LockedBadge />}
                            </label>
                            <select
                                {...register("status")}
                                disabled={isSelfService}
                                className={cn(
                                    "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white",
                                    isSelfService && "bg-gray-100 cursor-not-allowed opacity-75"
                                )}
                            >
                                <option value="Active">Active</option>
                                <option value="On Leave">On Leave</option>
                                <option value="Study Leave">Study Leave</option>
                                <option value="Terminated">Terminated</option>
                                <option value="Retired">Retired</option>
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
                            <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                {t('employeeForm.academicRank')}
                                {isSelfService && <LockedBadge />}
                            </label>
                            <select
                                {...register("academicRank")}
                                disabled={isSelfService}
                                className={cn(
                                    "w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white",
                                    isSelfService && "bg-gray-100 cursor-not-allowed opacity-75"
                                )}
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
