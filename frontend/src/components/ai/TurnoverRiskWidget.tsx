import { AlertTriangle, ArrowRight, Loader2, BookOpen, Settings, Briefcase, Stethoscope } from "lucide-react";
import { AICard } from "./AICard";
import { useState, useEffect } from "react";
import { aiService } from "../../services/aiService";

const CATEGORY_META: Record<string, { icon: any; color: string; bg: string }> = {
    Academic:       { icon: BookOpen,    color: "text-indigo-600",  bg: "bg-indigo-100 dark:bg-indigo-900/30"  },
    Technical:      { icon: Settings,    color: "text-amber-600",   bg: "bg-amber-100 dark:bg-amber-900/30"    },
    Administrative: { icon: Briefcase,   color: "text-blue-600",    bg: "bg-blue-100 dark:bg-blue-900/30"      },
    Health:         { icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30"},
};

export function TurnoverRiskWidget() {
    const [atRiskEmployees, setAtRiskEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        aiService.getTurnoverRisk()
            .then(setAtRiskEmployees)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <AICard title="Turnover Risk Detection" subtitle="TEDE staff showing exit-risk signals">
            {loading ? (
                <div className="flex justify-center p-6">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
            ) : atRiskEmployees.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-sm">
                    <AlertTriangle className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    No significant turnover risk detected.
                </div>
            ) : (
                <div className="space-y-3">
                    {atRiskEmployees.map((emp, idx) => {
                        const risk = parseInt(emp.risk);
                        const meta = CATEGORY_META[emp.category] ?? {
                            icon: Briefcase, color: "text-gray-600", bg: "bg-gray-100 dark:bg-gray-700"
                        };
                        const Icon = meta.icon;

                        const riskColor =
                            risk >= 75 ? "text-red-600 dark:text-red-400" :
                            risk >= 55 ? "text-orange-600 dark:text-orange-400" :
                                         "text-yellow-600 dark:text-yellow-400";

                        const borderColor =
                            risk >= 75 ? "border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10" :
                            risk >= 55 ? "border-orange-100 dark:border-orange-900/30 bg-orange-50/40 dark:bg-orange-900/10" :
                                         "border-yellow-100 dark:border-yellow-900/30 bg-yellow-50/30 dark:bg-yellow-900/10";

                        return (
                            <div key={emp.id ?? idx} className={`p-4 rounded-xl border ${borderColor} transition-all hover:shadow-sm`}>
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 ${meta.bg} rounded-lg`}>
                                            <Icon className={`w-3.5 h-3.5 ${meta.color}`} />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight">
                                                {emp.name}
                                            </h4>
                                            <p className="text-xs text-gray-500">{emp.role} · {emp.department}</p>
                                        </div>
                                    </div>
                                    <div className={`flex items-center gap-1 font-bold text-sm ${riskColor}`}>
                                        <AlertTriangle className="w-3.5 h-3.5" />
                                        {emp.risk}
                                    </div>
                                </div>

                                {/* Risk bar */}
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mb-2">
                                    <div
                                        className={`h-1 rounded-full transition-all duration-500 ${
                                            risk >= 75 ? "bg-red-500" :
                                            risk >= 55 ? "bg-orange-500" : "bg-yellow-500"
                                        }`}
                                        style={{ width: `${risk}%` }}
                                    />
                                </div>

                                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                                    <span className="font-medium">Risk signals: </span>{emp.reason}
                                </p>
                                <button className="mt-2 text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium">
                                    View Retention Plan <ArrowRight className="w-3 h-3" />
                                </button>
                            </div>
                        );
                    })}

                    <p className="text-xs text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-700">
                        Heuristic model calibrated for TEDE campus categories · updated on each page load
                    </p>
                </div>
            )}
        </AICard>
    );
}
