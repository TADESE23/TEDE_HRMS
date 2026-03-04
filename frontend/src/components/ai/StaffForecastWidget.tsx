import { TrendingUp, Users, Loader2 } from "lucide-react";
import { AICard } from "./AICard";
import { useState, useEffect } from "react";
import { aiService, type Forecast } from "../../services/aiService";

export function StaffForecastWidget() {
    const [forecasts, setForecasts] = useState<Forecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadForecasts = async () => {
            try {
                const data = await aiService.getForecasts();
                setForecasts(data);
            } catch (err) {
                console.error(err);
                // Don't show error explicitly in widget to keep UI clean, just show empty or mock fallbacks if needed?
                // Or better, show retry.
                setError("Failed to load AI insights.");
            } finally {
                setLoading(false);
            }
        };

        loadForecasts();
    }, []);

    // Process forecasts to group by metric
    // We expect metrics like 'dept_CS_count' or 'staff_count'
    // Let's filter for department metrics for the list
    const departmentForecasts = forecasts.filter(f => f.metric.startsWith('dept_'));
    const totalForecast = forecasts.find(f => f.metric === 'staff_count');

    // If no department forecasts, maybe we haven't generated them or we only did total.
    // For this UI, let's try to parse the metric name.

    return (
        <AICard title="HR Planning Forecast" subtitle="AI-Predicted staffing needs next 12mo">
            {loading ? (
                <div className="flex justify-center p-6">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
                </div>
            ) : error ? (
                <div className="p-4 text-sm text-red-500 text-center">{error}</div>
            ) : (
                <div className="space-y-4">
                    {departmentForecasts.length > 0 ? (
                        departmentForecasts.slice(0, 3).map((item) => {
                            const deptName = item.metric.replace('dept_', '').replace('_count', '');
                            const confidence = parseFloat(item.confidence_score);
                            const trendVal = "+?"; // We'd need current to calc trend, simplified for now

                            return (
                                <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white dark:bg-gray-800 rounded shadow-sm">
                                            <Users className="w-4 h-4 text-gray-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white capitalize">{deptName}</p>
                                            <p className="text-xs text-gray-500">Predicted: {item.predicted_value}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${confidence > 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                confidence > 50 ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {confidence}% Conf.
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-4 text-gray-500 text-sm">
                            {totalForecast ? (
                                <div>
                                    <p>Total Staff Prediction (1 Year):</p>
                                    <p className="text-2xl font-bold text-indigo-600">{totalForecast.predicted_value}</p>
                                    <p className="text-xs">Confidence: {totalForecast.confidence_score}%</p>
                                </div>
                            ) : "No sufficient data for breakdown yet."}
                        </div>
                    )}

                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500">
                        <p>Analysis based on Linear Regression of historical data.</p>
                    </div>
                </div>
            )}
        </AICard>
    );
}
