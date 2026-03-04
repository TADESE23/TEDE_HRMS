import { Target, TrendingUp } from "lucide-react";
import { PerformancePredictionWidget } from "../components/ai/PerformancePredictionWidget";

export default function Performance() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage Goals, KPIs, and Appraisals.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <PerformancePredictionWidget />
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="w-6 h-6 text-primary-600" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Goals & KPIs</h2>
                        </div>
                        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <li>• Academic KPIs (Teaching, Research, Community)</li>
                            <li>• Administrative KPIs</li>
                            <li>• Annual Goals</li>
                        </ul>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appraisals</h2>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">Workflow: Staff → Supervisor → Dean → HR → President</p>
                        <button className="px-4 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg">Start Appraisal Cycle</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
