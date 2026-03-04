import { useState } from "react";
import { Briefcase, Users, UserCheck, Calendar, Plus, Search } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { cn } from "../utils/cn";
import { RecruitmentOptimizationWidget } from "../components/ai/RecruitmentOptimizationWidget";
import { useTranslation } from "react-i18next";

export default function Recruitment() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("jobs");
    // ... existing code ...
    const tabs = [
        { id: "jobs", label: t('recruitment.tabs.jobs'), icon: Briefcase },
        { id: "candidates", label: t('recruitment.tabs.candidates'), icon: Users },
        { id: "interviews", label: t('recruitment.tabs.interviews'), icon: Calendar },
        { id: "hiring", label: t('recruitment.tabs.hiring'), icon: UserCheck },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('recruitment.title')}</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        {t('recruitment.subtitle')}
                    </p>
                </div>
                {activeTab === "jobs" && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        <Plus className="w-4 h-4" />
                        {t('recruitment.postVacancy')}
                    </button>
                )}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2",
                                activeTab === tab.id
                                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Content */}
            <div className="mt-6">
                {activeTab === "jobs" && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-4">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {/* Job List Header */}
                                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-900 dark:text-white">{t('recruitment.activeVacancies')}</h3>
                                    <div className="flex items-center gap-2">
                                        <Search className="w-4 h-4 text-gray-400" />
                                        <input type="text" placeholder={t('recruitment.searchPlaceholder')} className="text-sm bg-transparent border-none focus:ring-0 text-gray-600 placeholder-gray-400" />
                                    </div>
                                </div>
                                {/* Job Items */}
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-medium text-primary-600">Senior Lecturer - Computer Science</h4>
                                            <p className="text-sm text-gray-500 mt-1">Faculty of Informatics • {t('recruitment.fullTime')}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="info">{t('recruitment.internal')}</Badge>
                                                <Badge variant="success">{t('recruitment.published')}</Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                                            <p className="text-xs text-gray-500">{t('recruitment.applicants')}</p>
                                            <p className="text-xs text-gray-400 mt-2">{t('recruitment.closing')}: {t('recruitment.dec')} 30</p>
                                        </div>
                                    </div>
                                    <div className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex justify-between items-start">
                                        <div>
                                            <h4 className="text-lg font-medium text-primary-600">HR Assistant</h4>
                                            <p className="text-sm text-gray-500 mt-1">Human Resources • {t('recruitment.contract')}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="warning">{t('recruitment.draft')}</Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                                            <p className="text-xs text-gray-500">{t('recruitment.applicants')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <RecruitmentOptimizationWidget />
                        </div>
                    </div>
                )}

                {activeTab === "candidates" && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
                        <Users className="mx-auto h-12 w-12 text-gray-300" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t('recruitment.noCandidates')}</h3>
                        <p className="mt-1 text-sm text-gray-500">{t('recruitment.selectJob')}</p>
                    </div>
                )}

                {activeTab === "interviews" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('recruitment.upcomingInterviews')}</h3>
                            <div className="space-y-4">
                                <div className="flex gap-4 items-start p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                    <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm text-center min-w-[60px]">
                                        <span className="block text-xs text-gray-500 uppercase">{t('recruitment.dec')}</span>
                                        <span className="block text-xl font-bold text-blue-600">12</span>
                                    </div>
                                    <div>
                                        <h4 className="font-medium text-gray-900 dark:text-white">Dr. Sarah Johnson</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Lecturer I Position</p>
                                        <p className="text-xs text-gray-500 mt-1">10:00 AM • Conference Room B</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "hiring" && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4">{t('recruitment.onboardingPipeline')}</h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold">JD</div>
                                    <div>
                                        <p className="font-medium">John Doe</p>
                                        <p className="text-xs text-gray-500">{t('recruitment.offerAccepted')}</p>
                                    </div>
                                </div>
                                <button className="text-sm text-primary-600 font-medium">{t('recruitment.viewChecklist')}</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
