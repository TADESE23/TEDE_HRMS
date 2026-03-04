import { Award, BarChart3 } from "lucide-react";
import { AICard } from "./AICard";
import { useTranslation } from "react-i18next";

export function RecruitmentOptimizationWidget() {
    const { t } = useTranslation();
    // Mock prioritization logic
    const vacancies = [
        { title: "Senior Lecturer (Math)", score: 92, factors: ["High Student Ratio", "Critical Gap"] },
        { title: "IT Support Officer", score: 78, factors: ["Dept Growth"] },
        { title: "Librarian Assistant", score: 45, factors: ["Routine Replacement"] },
    ];

    return (
        <AICard title={t('aiWidget.smartPriority')} subtitle={t('aiWidget.aiRanked')}>
            <div className="space-y-3">
                {vacancies.map((job, idx) => (
                    <div key={job.title} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                        <div className={`p-3 rounded-lg font-bold text-lg w-12 h-12 flex items-center justify-center ${idx === 0 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' :
                            idx === 1 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                            }`}>
                            #{idx + 1}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className="font-medium text-gray-900 dark:text-white">{job.title}</h4>
                                <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    <Award className="w-3 h-3 text-yellow-500" />
                                    {t('aiWidget.score')}: {job.score}
                                </div>
                            </div>
                            <div className="flex gap-2 mt-1">
                                {job.factors.map(f => (
                                    <span key={f} className="text-[10px] uppercase tracking-wide bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-400">
                                        {f}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <button className="w-full mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" /> {t('aiWidget.viewScoringModel')}
            </button>
        </AICard>
    );
}
