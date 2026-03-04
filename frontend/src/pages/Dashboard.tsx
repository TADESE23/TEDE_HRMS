import { useState, useEffect, useCallback } from "react";
import {
    Users, UserPlus, Clock, CalendarCheck,
    FileText, Briefcase, GraduationCap, AlertCircle,
    RefreshCw, Download
} from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/Badge";
import { StaffForecastWidget } from "../components/ai/StaffForecastWidget";
import { TurnoverRiskWidget } from "../components/ai/TurnoverRiskWidget";
import { DepartmentChart } from "../components/dashboard/DepartmentChart";
import { dashboardService, type DashboardStat } from "../services/dashboardService";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, any> = {
    Users,
    UserPlus,
    Clock,
    CalendarCheck,
    FileText,
    Briefcase,
    GraduationCap,
    AlertCircle
};

export default function Dashboard() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [activities, setActivities] = useState<{ type: string; message: string; time: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const [statsData, activityData] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getActivity()
            ]);

            setStats(statsData);
            setActivities(activityData);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to load statistics');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleExport = async () => {
        try {
            const blob = await dashboardService.exportReport();

            // Create a link element, hide it, click it, and remove it
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `hrms_report_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);

        } catch (err: any) {
            alert(`${t('dashboard.exportFailed')}: ${err.message}`);
        }
    };

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "admin": return "error";
            case "hr": return "warning";
            case "manager": return "info";
            case "recruiter": return "success";
            default: return "default";
        }
    }

    const showAIInsights = user?.role === "admin" || user?.role === "hr";

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('dashboard.title')}</h1>
                        <Badge variant={getRoleBadgeVariant(user?.role || "") as any} className="text-xs px-2 py-0.5 capitalize">
                            {user?.role} {t('dashboard.account')}
                        </Badge>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">{t('dashboard.welcomeBack')}, {user?.name}.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => fetchStats(true)}
                        disabled={loading || refreshing}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-all dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        {refreshing ? t('dashboard.refreshing') : t('dashboard.refresh')}
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <Download className="w-4 h-4" />
                        {t('dashboard.exportReport')}
                    </button>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                    <button onClick={() => fetchStats()} className="ml-auto underline font-medium">{t('dashboard.retry')}</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {loading ? (
                    Array(4).fill(0).map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-xl border border-gray-200 dark:border-gray-700"></div>
                    ))
                ) : (
                    stats.map((stat) => (
                        <StatsCard
                            key={stat.title}
                            {...stat}
                            icon={ICON_MAP[stat.icon] || Briefcase}
                        />
                    ))
                )}
            </div>

            {/* AI Insights Section */}
            {showAIInsights && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.aiInsights')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StaffForecastWidget />
                        <TurnoverRiskWidget />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[300px] transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {user?.role === "employee" ? t('dashboard.myAnnouncements') : t('dashboard.systemActivity')}
                    </h3>
                    <div className="space-y-4 max-h-[300px] overflow-y-auto">
                        {activities.length === 0 ? (
                            <p className="text-gray-500 text-sm">{t('dashboard.noActivity')}</p>
                        ) : (
                            activities.map((act, index) => (
                                <div key={index} className={`p-4 rounded-lg border ${act.type === 'holiday'
                                    ? 'bg-yellow-50 border-yellow-100 dark:bg-yellow-900/20 dark:border-yellow-800' // Highlight Holidays
                                    : 'bg-gray-50 border-gray-100 dark:bg-gray-700/50 dark:border-gray-700'
                                    }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 p-1.5 rounded-full ${act.type === 'hire' ? 'bg-green-100 text-green-600' :
                                            act.type === 'leave' ? 'bg-blue-100 text-blue-600' :
                                                act.type === 'holiday' ? 'bg-yellow-100 text-yellow-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {act.type === 'hire' ? <UserPlus className="w-4 h-4" /> :
                                                act.type === 'leave' ? <Clock className="w-4 h-4" /> :
                                                    act.type === 'holiday' ? <GraduationCap className="w-4 h-4" /> : // Using GraduationCap as star/celebration proxy
                                                        <FileText className="w-4 h-4" />}
                                        </div>
                                        <div>
                                            <p className={`text-sm ${act.type === 'holiday' ? 'font-medium text-yellow-800 dark:text-yellow-400' : 'text-gray-600 dark:text-gray-300'}`}>
                                                {act.message}
                                            </p>
                                            <span className="text-xs text-gray-400 mt-1 block">
                                                {new Date(act.time).toLocaleDateString()} {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm min-h-[300px] transition-colors duration-200">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                        {user?.role === "employee" ? t('dashboard.performanceStats') : t('dashboard.departmentAnalytics')}
                    </h3>
                    <div className="w-full h-full min-h-[250px]">
                        {user?.role === "employee" ? (
                            <div className="flex items-center justify-center h-full text-gray-400">{t('dashboard.personalStatsComingSoon')}</div>
                        ) : (
                            <DepartmentChart />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
