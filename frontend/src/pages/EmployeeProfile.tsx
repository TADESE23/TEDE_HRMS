import { useState } from "react";
import { User, BookOpen, Briefcase, FileText } from "lucide-react";
import { Button } from "../components/ui/Button";
import { PersonalInfo } from "../components/employees/profile/PersonalInfo";
import { AcademicInfo } from "../components/employees/profile/AcademicInfo";
import { EmploymentInfo } from "../components/employees/profile/EmploymentInfo";
import { DocumentInfo } from "../components/employees/profile/DocumentInfo";
import { cn } from "../utils/cn";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function EmployeeProfile() {
    const { id } = useParams();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("personal");

    const tabs = [
        { id: "personal", label: t('employeeProfile.tabs.personalInfo'), icon: User },
        { id: "academic", label: t('employeeProfile.tabs.academicProfile'), icon: BookOpen },
        { id: "employment", label: t('employeeProfile.tabs.employment'), icon: Briefcase },
        { id: "documents", label: t('employeeProfile.tabs.documents'), icon: FileText },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{t('employeeProfile.title')}</h1>
                    <p className="text-gray-500">{t('employeeProfile.desc')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">{t('employeeProfile.downloadCv')}</Button>
                    <Button>{t('employeeProfile.editProfile')}</Button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex space-x-1 p-2" aria-label="Tabs">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                    activeTab === tab.id
                                        ? "bg-primary-50 text-primary-700"
                                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                <tab.icon className="h-4 w-4" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-6">
                    {activeTab === "personal" && <PersonalInfo />}
                    {activeTab === "academic" && <AcademicInfo />}
                    {activeTab === "employment" && <EmploymentInfo />}
                    {activeTab === "documents" && <DocumentInfo employeeId={id} />}
                </div>
            </div>
        </div>
    );
}
