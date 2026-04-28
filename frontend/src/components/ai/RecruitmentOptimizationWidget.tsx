import { Award, BarChart3, Loader2 } from "lucide-react";
import { AICard } from "./AICard";
import { useState, useEffect } from "react";
import { aiService, type RankedCandidate } from "../../services/aiService";

interface Props {
    vacancyId: number;
    vacancyTitle?: string;
}

export function RecruitmentOptimizationWidget({ vacancyId, vacancyTitle }: Props) {
    const [candidates, setCandidates] = useState<RankedCandidate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        aiService.rankCandidates(vacancyId)
            .then(data => setCandidates(data.slice(0, 5))) // Top 5
            .catch(err => {
                console.error("AI Error:", err);
                setError("Failed to load AI Rankings");
            })
            .finally(() => setLoading(false));
    }, [vacancyId]);


    return (
        <AICard title={"Top Candidates (AI Rated)"} subtitle={vacancyTitle ? `AI ranked for ${vacancyTitle}` : "AI ranked for current vacancy"}>

            {loading ? (
                <div className="flex justify-center p-6"><Loader2 className="w-6 h-6 animate-spin text-indigo-500" /></div>
            ) : error ? (
                <div className="p-4 text-sm text-red-500 text-center">{error}</div>
            ) : (
                <div className="space-y-3">
                    {candidates.length === 0 && <p className="text-center text-sm text-gray-500">No candidates available for ranking.</p>}
                    {candidates.map((candidate, idx) => (
                        <div key={candidate.applicant_id} className="flex items-center gap-4 p-3 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg shadow-sm">
                            <div className={`p-3 rounded-lg font-bold text-lg w-12 h-12 flex items-center justify-center ${idx === 0 ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400' :
                                idx === 1 ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' :
                                    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'
                                }`}>
                                #{idx + 1}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-gray-900 dark:text-white">{candidate.name}</h4>
                                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        <Award className="w-3 h-3 text-yellow-500" />
                                        Score: {(candidate.score * 100).toFixed(1)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <button className="w-full mt-4 text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" /> View Full Report
            </button>
        </AICard>
    );
}
