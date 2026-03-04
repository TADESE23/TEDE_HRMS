import { CheckCircle2, TrendingUp, AlertCircle } from "lucide-react";
import { AICard } from "./AICard";

export function PerformancePredictionWidget() {
    // Mock prediction
    const prediction = {
        score: 84,
        grade: "A-",
        factors: [
            { label: "High Attendance", impact: "positive", value: "+12%" },
            { label: "Training Completion", impact: "positive", value: "+5%" },
            { label: "Recent Disciplinary", impact: "negative", value: "-2%" },
        ]
    };

    return (
        <AICard title="Performance Predictor" subtitle="Projected End-of-Year Score">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">{prediction.score}%</span>
                    <span className="ml-2 text-lg text-gray-500 dark:text-gray-400">({prediction.grade})</span>
                </div>
                <div className="h-12 w-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
            </div>

            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Key Influencing Factors</h4>
            <div className="space-y-3">
                {prediction.factors.map((factor) => (
                    <div key={factor.label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-300">{factor.label}</span>
                        <div className={`flex items-center gap-1 font-medium ${factor.impact === 'positive' ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                            }`}>
                            {factor.impact === 'positive' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {factor.value}
                        </div>
                    </div>
                ))}
            </div>
        </AICard>
    );
}
