import { useState, useEffect } from "react";
import { Briefcase, Users, UserCheck, Calendar, Plus, Search } from "lucide-react";
import { Badge } from "../components/ui/Badge";
import { cn } from "../utils/cn";
import { RecruitmentOptimizationWidget } from "../components/ai/RecruitmentOptimizationWidget";
import { useTranslation } from "react-i18next";
import { VacancyForm } from "../components/recruitment/VacancyForm";
import { CandidateCVForm } from "../components/recruitment/CandidateCVForm";
import api from "../services/api";

interface Vacancy {
    id: number;
    title: string;
    department: string;
    type: string;
    status: string;
    closing_date: string;
    created_at: string;
    posted_by_email?: string;
    responsible_role?: string;
}


export default function Recruitment() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("jobs");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedVacancyId, setSelectedVacancyId] = useState<number | null>(null);
    const [selectedVacancyTitle, setSelectedVacancyTitle] = useState<string>("");


    // Candidate States
    const [isCandidateFormOpen, setIsCandidateFormOpen] = useState(false);
    const [candidates, setCandidates] = useState<any[]>([]);
    const [isCandidateLoading, setIsCandidateLoading] = useState(false);

    useEffect(() => {
        fetchVacancies();
        fetchCandidates();
    }, []);

    const fetchCandidates = async () => {
        try {
            setIsCandidateLoading(true);
            const response = await api.get('/recruitment/candidates');
            if (response.data.success) {
                setCandidates(response.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch candidates', error);
        } finally {
            setIsCandidateLoading(false);
        }
    };

    const handleUploadCV = async (data: FormData) => {
        try {
            setIsSubmitting(true);
            const response = await api.post('/recruitment/candidates', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                setCandidates([response.data.data, ...candidates]);
                setIsCandidateFormOpen(false);
            }
        } catch (error) {
            console.error('Failed to upload CV', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchVacancies = async () => {
        try {
            setIsLoading(true);
            const response = await api.get('/recruitment/vacancies');
            if (response.data.success) {
                setVacancies(response.data.data);
                if (response.data.data.length > 0 && !selectedVacancyId) {
                    setSelectedVacancyId(response.data.data[0].id);
                    setSelectedVacancyTitle(response.data.data[0].title);
                }
            }

        } catch (error) {
            console.error('Failed to fetch vacancies', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateVacancy = async (data: any) => {
        try {
            setIsSubmitting(true);
            const response = await api.post('/recruitment/vacancies', data);
            if (response.data.success) {
                setVacancies([response.data.data, ...vacancies]);
                setIsFormOpen(false);
            }
        } catch (error) {
            console.error('Failed to create vacancy', error);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
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
                                    {isLoading ? (
                                        <div className="p-6 text-center text-gray-500">Loading vacancies...</div>
                                    ) : vacancies.length === 0 ? (
                                        <div className="p-6 text-center text-gray-500">No active vacancies found.</div>
                                    ) : (
                                        vacancies.map((vacancy) => (
                                            <div 
                                                key={vacancy.id} 
                                                onClick={() => {
                                                    setSelectedVacancyId(vacancy.id);
                                                    setSelectedVacancyTitle(vacancy.title);
                                                }}
                                                className={cn(
                                                    "p-6 transition-colors flex justify-between items-start cursor-pointer border-l-4",
                                                    selectedVacancyId === vacancy.id 
                                                        ? "bg-primary-50 dark:bg-primary-900/10 border-primary-500" 
                                                        : "hover:bg-gray-50 dark:hover:bg-gray-700/30 border-transparent divide-y divide-gray-200 dark:divide-gray-700"
                                                )}
                                            >
                                                <div>
                                                    <h4 className={cn("text-lg font-medium", selectedVacancyId === vacancy.id ? "text-primary-700" : "text-primary-600")}>{vacancy.title}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">{vacancy.department} • {t(`recruitment.${vacancy.type.replace(/\s+/g, '').replace(/^./, str => str.toLowerCase())}`, vacancy.type)}</p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <Badge variant={vacancy.status === 'Published' ? 'success' : vacancy.status === 'Draft' ? 'warning' : 'info'}>
                                                            {t(`recruitment.${vacancy.status.toLowerCase()}`, vacancy.status)}
                                                        </Badge>
                                                        {vacancy.posted_by_email && (
                                                            <Badge variant="default" className="text-[10px]">
                                                                Posted by: {vacancy.posted_by_email}
                                                            </Badge>
                                                        )}

                                                        {vacancy.responsible_role && (
                                                            <Badge variant="info" className="text-[10px]">
                                                                Role: {vacancy.responsible_role}
                                                            </Badge>
                                                        )}
                                                    </div>

                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p>
                                                    <p className="text-xs text-gray-500">{t('recruitment.applicants')}</p>
                                                    <p className="text-xs text-gray-400 mt-2">{t('recruitment.closing')}: {new Date(vacancy.closing_date).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        ))

                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-1">
                            <RecruitmentOptimizationWidget 
                                vacancyId={selectedVacancyId || 1} 
                                vacancyTitle={selectedVacancyTitle} 
                            />
                        </div>

                    </div>
                )}

                {activeTab === "candidates" && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Applicant Pipeline</h3>
                            <button
                                onClick={() => setIsCandidateFormOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                {t('Upload Applicant CV')}
                            </button>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {isCandidateLoading ? (
                                    <div className="p-6 text-center text-gray-500">Loading candidates...</div>
                                ) : candidates.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <Users className="mx-auto h-12 w-12 text-gray-300" />
                                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No Candidates Found</h3>
                                        <p className="mt-1 text-sm text-gray-500">Upload CVs to begin tracking applicants.</p>
                                    </div>
                                ) : (
                                    candidates.map((candidate) => (
                                        <div key={candidate.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors flex justify-between items-center">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                                                    {candidate.first_name?.[0]}{candidate.last_name?.[0]}
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-900 dark:text-white">
                                                        {candidate.first_name} {candidate.last_name}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <p className="text-xs font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                                                            {candidate.vacancy_title || 'General Pool'}
                                                        </p>
                                                        <span className="text-xs text-gray-400">•</span>
                                                        <p className="text-xs text-gray-500 max-w-md truncate">
                                                            {candidate.skills ? candidate.skills : 'No skills listed'}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>
                                            <div className="text-right flex gap-3 items-center">
                                                {candidate.cv_file_path && (
                                                    <Badge variant="info">CV Attached</Badge>
                                                )}
                                                <Badge variant={candidate.prediction_label === 'High' ? 'success' : 'default'}>
                                                    AI Score: {candidate.ai_match_score || 'N/A'}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
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

            <VacancyForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleCreateVacancy}
                isSubmitting={isSubmitting}
            />
            <CandidateCVForm
                isOpen={isCandidateFormOpen}
                onClose={() => setIsCandidateFormOpen(false)}
                onSubmit={handleUploadCV}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
