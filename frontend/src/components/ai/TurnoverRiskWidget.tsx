import { AlertTriangle, ArrowRight } from "lucide-react";
import { AICard } from "./AICard";

export function TurnoverRiskWidget() {
    // Mock risk analysis
    const atRiskEmployees = [
        { name: "Dr. James Wilson", role: "Senior Lecturer", risk: "85%", reason: "High workload, Low engagement" },
        { name: "Sarah Connor", role: "Lab Technician", risk: "72%", reason: "Frequent leave, Stagnant pay" },
    ];

    return (
        <AICard title="Turnover Risk Detection" subtitle="Employees showing signs of exit risk">
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
        </AICard>
    );
}
