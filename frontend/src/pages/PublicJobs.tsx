import { useState, useEffect } from "react";
import { Search, Briefcase, MapPin, Clock, GraduationCap, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { cn } from "../utils/cn";
import axios from "axios";

// Using a standard axios instance for public calls (no token)
const publicApi = axios.create({
    baseURL: "http://localhost:5000/api",
});

interface Vacancy {
    id: number;
    title: string;
    department: string;
    type: string;
    status: string;
    closing_date: string;
    description: string;
    requirements: string;
    responsible_role?: string;
    contact_email?: string;
}

export default function PublicJobs() {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [filteredVacancies, setFilteredVacancies] = useState<Vacancy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("All");

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const response = await publicApi.get('/recruitment/public/vacancies');
                if (response.data.success) {
                    setVacancies(response.data.data);
                    setFilteredVacancies(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJobs();
    }, []);

    useEffect(() => {
        let filtered = vacancies.filter(v => 
            v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            v.department.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (selectedDept !== "All") {
            filtered = filtered.filter(v => v.department === selectedDept);
        }
        setFilteredVacancies(filtered);
    }, [searchTerm, selectedDept, vacancies]);

    const departments = ["All", ...new Set(vacancies.map(v => v.department))];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Navigation / Header */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mxauto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-primary-600" />
                            <span className="text-xl font-bold text-slate-900">{t('publicCareers.title')}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={() => i18n.changeLanguage(i18n.language === 'am' ? 'en' : 'am')} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                                <Globe className="w-4 h-4" />
                                {i18n.language === 'am' ? 'EN' : 'አማ'}
                            </button>
                            <a href="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">{t('publicCareers.adminLogin')}</a>
                            <Button variant="primary" size="sm" onClick={() => window.scrollTo({ top: 500, behavior: 'smooth' })}>{t('publicCareers.browseJobs')}</Button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-primary-900 to-indigo-900 text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                        {t('publicCareers.joinExcellence')}
                    </h1>
                    <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-8">
                        {t('publicCareers.discoverCareers')}
                    </p>
                    <div className="max-w-3xl mx-auto relative">
                        <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden p-2">
                            <div className="flex-1 flex items-center px-4 gap-3">
                                <Search className="text-slate-400 h-5 w-5" />
                                <input 
                                    type="text" 
                                    placeholder={t('publicCareers.searchPlaceholder')}
                                    className="w-full py-3 border-none focus:ring-0 text-slate-900 placeholder-slate-400"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Button className="rounded-xl px-8 hidden md:block">{t('publicCareers.searchJobs')}</Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full md:w-64 space-y-8">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-4">{t('publicCareers.departments')}</h3>
                            <div className="space-y-2">
                                {departments.map(dept => (
                                    <button
                                        key={dept}
                                        onClick={() => setSelectedDept(dept)}
                                        className={cn(
                                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all",
                                            selectedDept === dept 
                                                ? "bg-primary-100 text-primary-700 font-semibold" 
                                                : "text-slate-600 hover:bg-slate-100"
                                        )}
                                    >
                                        {dept === "All" ? t('publicCareers.all') : dept}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-900 mb-2">{t('publicCareers.cantFindRole')}</h3>
                            <p className="text-sm text-slate-600 mb-4">{t('publicCareers.sendCvText')}</p>
                            <Button variant="outline" className="w-full text-xs">{t('publicCareers.generalApplication')}</Button>
                        </div>
                    </aside>

                    {/* Job Listings */}
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-slate-900">
                                {isLoading ? t('publicCareers.searching') : `${filteredVacancies.length} ${t('publicCareers.openingsFound')}`}
                            </h2>
                        </div>

                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="bg-white h-32 rounded-xl animate-pulse border border-slate-200" />
                                ))}
                            </div>
                        ) : filteredVacancies.length === 0 ? (
                            <div className="bg-white py-16 text-center rounded-2xl border border-slate-200 shadow-sm">
                                <Briefcase className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-slate-900">{t('publicCareers.noMatchingJobs')}</h3>
                                <p className="text-slate-500">{t('publicCareers.adjustSearch')}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredVacancies.map(job => (
                                    <div 
                                        key={job.id} 
                                        className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden"
                                    >
                                        <div className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <Badge variant="info" className="bg-primary-50 text-primary-700 border-primary-100">{job.type === 'Full Time' ? t('vacancyForm.fullTime') : job.type === 'Part Time' ? t('vacancyForm.partTime') : job.type === 'Contract' ? t('vacancyForm.contract') : job.type}</Badge>
                                                        <span className="text-xs text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {t('publicCareers.closes')} {new Date(job.closing_date).toLocaleDateString()}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                                                    <p className="text-slate-600 mt-1 flex items-center gap-1 font-medium text-sm">
                                                        <MapPin className="h-4 w-4" /> {job.department}
                                                    </p>
                                                    {job.responsible_role && (
                                                        <div className="mt-2 flex items-center gap-2">
                                                            <Badge variant="info" className="text-[10px] py-0 px-2 bg-blue-50 text-blue-700">{t('publicCareers.responsibility')}: {job.responsible_role}</Badge>
                                                            {job.contact_email && <span className="text-[10px] text-slate-400">{t('publicCareers.contact')}: {job.contact_email}</span>}
                                                        </div>
                                                    )}

                                                    <p className="text-slate-500 mt-3 text-sm line-clamp-2">{job.description}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" onClick={() => navigate(`/jobs/apply/${job.id}`)}>{t('publicCareers.viewAndApply')}</Button>
                                                    <Button onClick={() => navigate(`/jobs/apply/${job.id}`)}>{t('publicCareers.applyNow')}</Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <GraduationCap className="h-10 w-10 text-primary-500 mx-auto mb-4" />
                    <p className="text-slate-300 font-bold text-lg mb-2">{t('publicCareers.uog')}</p>
                    <p className="text-sm mb-6">{t('publicCareers.campus')}</p>
                    <div className="flex justify-center gap-6 text-sm">
                        <a href="#" className="hover:text-white">{t('publicCareers.privacyPolicy')}</a>
                        <a href="#" className="hover:text-white">{t('publicCareers.termsOfService')}</a>
                        <a href="#" className="hover:text-white">{t('publicCareers.contactUs')}</a>
                    </div>
                    <p className="mt-8 text-xs">{t('publicCareers.copyright')}</p>
                </div>
            </footer>
        </div>
    );
}
