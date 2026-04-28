import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { AICard } from "./AICard";
import { useState, useEffect } from "react";
import { aiService } from "../../services/aiService";

export function TurnoverRiskWidget() {
    const [atRiskEmployees, setAtRiskEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRisk = async () => {
            try {
                const data = await aiService.getTurnoverRisk();
                setAtRiskEmployees(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRisk();
    }, []);

    return (
        <AICard title="Turnover Risk Detection" subtitle="Employees showing signs of exit risk">
            {loading ? (
                <div className="flex justify-center p-6">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
            ) : atRiskEmployees.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">No significant turnover risk detected.</div>
            ) : (
                <div className="space-y-3">
                    {atRiskEmployees.map((emp) => (
                        <div key={emp.name} className="relative group p-4 border border-red-100 dark:border-red-900/30 bg-red-50/50 dark:bg-red-900/10 rounded-lg hover:shadow-sm transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{emp.name}</h4>
                                    <p className="text-xs text-gray-500">{emp.role}</p>
                                </div>
                                <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                                    <AlertTriangle className="w-4 h-4" />
                                    {emp.risk}
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                <span className="font-medium">Drivers:</span> {emp.reason}
                            </p>
                            <button className="text-xs flex items-center gap-1 text-red-600 hover:text-red-700 font-medium">
                                View Retention Plan <ArrowRight className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </AICard>
    );
}
