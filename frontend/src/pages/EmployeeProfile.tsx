import { useState, useEffect } from "react";
import { User, BookOpen, Briefcase, FileText, Loader2, ArrowLeft, Edit2 } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PersonalInfo } from "../components/employees/profile/PersonalInfo";
import { AcademicInfo } from "../components/employees/profile/AcademicInfo";
import { EmploymentInfo } from "../components/employees/profile/EmploymentInfo";
import { DocumentInfo } from "../components/employees/profile/DocumentInfo";
import { ProfileCompletionBanner } from "../components/employees/profile/ProfileCompletionBanner";
import { cn } from "../utils/cn";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { employeeService } from "../services/employeeService";
import { useAuth } from "../context/AuthContext";

export default function EmployeeProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState("personal");
    const [employee, setEmployee] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Determine if the current user is an admin / HR viewing someone else's profile
    const isAdmin = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'HR Officer';
    
    // Check if the current logged-in user is viewing their own profile
    const isOwnProfile = user?.id === employee?.user_id;

    useEffect(() => {
        if (id) {
            loadEmployee();
        }
    }, [id]);

    const loadEmployee = async () => {
        try {
            setLoading(true);
            let data;
            if (id === 'me') {
                data = await employeeService.getMe();
            } else {
                data = await employeeService.getEmployeeById(id as string);
            }
            setEmployee(data);
        } catch (error: any) {
            console.error("Failed to load employee details", error);
            if (error.response?.status === 403) {
                // If forbidden, maybe they tried to access someone else's profile
                // Redirect to their own profile
                navigate('/employees/me');
            } else {
                navigate('/');
            }
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: "personal",   label: t('employeeProfile.tabs.personalInfo'),    icon: User      },
        { id: "academic",   label: t('employeeProfile.tabs.academicProfile'),  icon: BookOpen  },
        { id: "employment", label: t('employeeProfile.tabs.employment'),       icon: Briefcase },
        { id: "documents",  label: t('employeeProfile.tabs.documents'),        icon: FileText  },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 h-full">
                <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
                <p className="text-gray-500">Loading profile...</p>
            </div>
        );
    }

    if (!employee) {
        return <div className="p-6 text-center text-gray-500">Employee not found.</div>;
    }

    const fullName = `${employee?.first_name || ''} ${employee?.last_name || ''}`.trim();

    return (
        <div className="space-y-4">
            {/* ── Header ── */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/employees')}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                        title="Back to Employees"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {fullName || t('employeeProfile.title')}
                        </h1>
                        <p className="text-gray-500 text-sm">{employee?.role} &mdash; {employee?.department_name || employee?.department || 'Unassigned'}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">{t('employeeProfile.downloadCv')}</Button>
                    {isOwnProfile && (
                        <Button
                            onClick={() => navigate(`/employees/${id}/edit`)}
                            className="flex items-center gap-2"
                        >
                            <Edit2 className="h-4 w-4" />
                            {t('employeeProfile.editProfile')}
                        </Button>
                    )}
                </div>
            </div>

            {/* ── Profile Completion Banner ── */}
            <ProfileCompletionBanner
                employee={employee}
                employeeId={id}
                isAdmin={isAdmin}
                isOwnProfile={isOwnProfile}
            />

            {/* ── Tab Content ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200 bg-gray-50">
                    <nav className="flex space-x-1 p-2" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors",
                                    activeTab === tab.id
                                        ? "bg-white text-primary-700 shadow-sm border border-gray-200"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "personal"   && <PersonalInfo employee={employee} />}
                    {activeTab === "academic"   && <AcademicInfo employee={employee} />}
                    {activeTab === "employment" && <EmploymentInfo employee={employee} />}
                    {activeTab === "documents"  && <DocumentInfo employeeId={id} />}
                </div>
            </div>
        </div>
    );
}
