import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Send, FileText, Clock, MapPin, GraduationCap, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Badge } from "../components/ui/Badge";
import axios from "axios";

const publicApi = axios.create({
    baseURL: "http://localhost:5000/api",
});

interface Vacancy {
    id: number;
    title: string;
    department: string;
    type: string;
    closing_date: string;
    description: string;
    requirements: string;
    responsible_role?: string;
    contact_email?: string;
}

export default function JobApply() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const [job, setJob] = useState<Vacancy | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formLoading, setFormLoading] = useState(false);
    const [applySuccess, setApplySuccess] = useState(false);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                // We'll fetch all public vacancies and find the one with the matching ID
                // Alternatively, we could add a specific /public/vacancies/:id endpoint
                const response = await publicApi.get('/recruitment/public/vacancies');
                if (response.data.success) {
                    const foundJob = response.data.data.find((v: Vacancy) => v.id === Number(id));
                    if (foundJob) {
                        setJob(foundJob);
                    } else {
                        console.error("Job not found");
                    }
                }
            } catch (error) {
                console.error("Error fetching job details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchJobDetails();
        }
    }, [id]);

    const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!job) return;

        setFormLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append('vacancy_id', job.id.toString());

        try {
            const response = await publicApi.post('/recruitment/public/apply', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                setApplySuccess(true);
                // Redirect to jobs page after 3 seconds
                setTimeout(() => {
                    navigate('/jobs');
                }, 3000);
            }
        } catch (error) {
            console.error("Apply error:", error);
            alert("Error submitting application. Please try again.");
        } finally {
            setFormLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!job && !isLoading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
                <FileText className="h-16 w-16 text-slate-300 mb-4" />
                <h2 className="text-2xl font-bold text-slate-900">{t('publicCareers.jobNotFound')}</h2>
                <p className="text-slate-600 mt-2 mb-6">{t('publicCareers.jobNotFoundDesc')}</p>
                <Button onClick={() => navigate('/jobs')}>{t('publicCareers.returnToJobBoard')}</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Nav */}
            <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link to="/jobs" className="flex items-center gap-2">
                            <GraduationCap className="h-8 w-8 text-primary-600" />
                            <span className="text-xl font-bold text-slate-900">{t('publicCareers.title')}</span>
                        </Link>
                        <div className="flex items-center gap-4">
                            <button onClick={() => i18n.changeLanguage(i18n.language === 'am' ? 'en' : 'am')} className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-primary-600 transition-colors">
                                <Globe className="w-4 h-4" />
                                {i18n.language === 'am' ? 'EN' : 'አማ'}
                            </button>
                            <Button variant="outline" size="sm" onClick={() => navigate('/jobs')}>
                                <ArrowLeft className="h-4 w-4 mr-2" /> {t('publicCareers.backToJobs')}
                            </Button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Job Info Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                            <Badge variant="info" className="mb-4">{job?.type === 'Full Time' ? t('vacancyForm.fullTime') : job?.type === 'Part Time' ? t('vacancyForm.partTime') : job?.type === 'Contract' ? t('vacancyForm.contract') : job?.type}</Badge>
                            <h1 className="text-2xl font-bold text-slate-900 mb-2">{job?.title}</h1>
                            <div className="space-y-3 mb-6">
                                <p className="text-slate-600 flex items-center gap-2 text-sm">
                                    <MapPin className="h-4 w-4" /> {job?.department}
                                </p>
                                <p className="text-slate-500 flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4" /> {t('publicCareers.closes')} {job ? new Date(job.closing_date).toLocaleDateString() : ''}
                                </p>
                            </div>
                            
                            <hr className="my-6 border-slate-100" />
                            
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('publicCareers.responsibility')}</h4>
                                    <p className="text-sm text-slate-700">{job?.responsible_role || 'HR Administrative'}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t('publicCareers.contact')}</h4>
                                    <p className="text-sm text-slate-700">{job?.contact_email || 'hr@uog.edu.et'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-primary-900 rounded-2xl p-6 text-white shadow-lg">
                            <h3 className="font-bold mb-2">{t('publicCareers.needHelp')}</h3>
                            <p className="text-primary-100 text-sm mb-4">{t('publicCareers.supportText')}</p>
                            <a href="mailto:support@uog.edu.et" className="text-xs text-primary-300 hover:text-white underline transition-colors">support@uog.edu.et</a>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            {applySuccess ? (
                                <div className="p-16 text-center">
                                    <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
                                    <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('publicCareers.applicationSent')}</h2>
                                    <p className="text-slate-600 text-lg mb-8">
                                        {t('publicCareers.yourApplicationFor')} <strong>{job?.title}</strong> {t('publicCareers.hasBeenSubmitted')}
                                    </p>
                                    <p className="text-slate-500 text-sm">{t('publicCareers.redirectingToJobBoard')}</p>
                                    <Button onClick={() => navigate('/jobs')} className="mt-8">{t('publicCareers.returnNow')}</Button>
                                </div>
                            ) : (
                                <div className="p-8">
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-bold text-slate-900">{t('publicCareers.applicationForm')}</h2>
                                        <p className="text-slate-500 text-sm mt-1">{t('publicCareers.provideAccurateInfo')}</p>
                                    </div>

                                    <form onSubmit={handleApply} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">{t('publicCareers.firstName')}</label>
                                                <Input name="first_name" required />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">{t('publicCareers.lastName')}</label>
                                                <Input name="last_name" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">{t('publicCareers.emailAddress')}</label>
                                            <Input type="email" name="email" placeholder="email@example.com" required />
                                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">{t('publicCareers.weWillContactYou')}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">{t('publicCareers.phoneNumber')}</label>
                                            <Input name="phone" placeholder="+251 ..." />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">{t('publicCareers.highestEducationLevel')}</label>
                                                <select 
                                                    name="education_level" 
                                                    className="w-full rounded-xl border-slate-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-2.5 bg-white"
                                                    required
                                                >
                                                    <option value="">{t('publicCareers.selectLevel')}</option>
                                                    <option value="High School">{t('publicCareers.highSchool')}</option>
                                                    <option value="Diploma">{t('publicCareers.diploma')}</option>
                                                    <option value="Bachelor's Degree">{t('publicCareers.bachelorsDegree')}</option>
                                                    <option value="Master's Degree">{t('publicCareers.mastersDegree')}</option>
                                                    <option value="PhD">{t('publicCareers.phdDoctorate')}</option>
                                                </select>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-slate-700">{t('publicCareers.yearsOfExperience')}</label>
                                                <Input type="number" name="years_of_experience" placeholder="e.g. 5" min="0" required />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">{t('publicCareers.keySkills')}</label>
                                            <Input name="skills" required />
                                            <p className="text-[10px] text-slate-400 font-medium uppercase mt-1">{t('publicCareers.aiRankApp')}</p>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">{t('publicCareers.expectedSalary')}</label>
                                            <Input type="number" name="expected_salary" placeholder="e.g. 2000" min="0" required={false} />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">{t('publicCareers.professionalSummary')}</label>

                                            <textarea 
                                                name="resume_text" 
                                                className="w-full rounded-xl border-slate-200 focus:border-primary-500 focus:ring-primary-500 text-sm p-3 min-h-[120px]" 
                                                placeholder={t('publicCareers.summaryPlaceholder')}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">{t('publicCareers.uploadCv')}</label>
                                            <div className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-slate-200 border-dashed rounded-xl hover:border-primary-400 transition-all cursor-pointer bg-slate-50 group">
                                                <div className="space-y-2 text-center">
                                                    <FileText className="mx-auto h-10 w-10 text-slate-300 group-hover:text-primary-400 transition-colors" />
                                                    <div className="flex text-sm text-slate-600 justify-center">
                                                        <label htmlFor="cv" className="relative cursor-pointer rounded-md font-bold text-primary-600 hover:text-primary-500 focus-within:outline-none">
                                                            <span>{t('publicCareers.uploadAFile')}</span>
                                                            <input id="cv" name="cv" type="file" className="sr-only" />
                                                        </label>
                                                        <p className="pl-1">{t('publicCareers.orDragAndDrop')}</p>
                                                    </div>
                                                    <p className="text-xs text-slate-400">{t('publicCareers.pdfLimit')}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-100 flex gap-4">
                                            <Button variant="outline" className="flex-1 py-6 rounded-xl" type="button" onClick={() => navigate('/jobs')}>
                                                {t('publicCareers.cancel')}
                                            </Button>
                                            <Button className="flex-[2] py-6 rounded-xl shadow-lg shadow-primary-200 gap-2" type="submit" disabled={formLoading}>
                                                {formLoading ? t('publicCareers.submitting') : (
                                                    <>{t('publicCareers.submitApplication')} <Send className="h-5 w-5" /></>
                                                )}
                                            </Button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-slate-400 text-xs">{t('publicCareers.copyright')}</p>
                </div>
            </footer>
        </div>
    );
}
