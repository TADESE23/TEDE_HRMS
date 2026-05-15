import { useState, useEffect, useCallback } from "react";
import {
    Users, UserPlus, Clock, CalendarCheck,
    FileText, Briefcase, GraduationCap, AlertCircle,
    RefreshCw, Download, Award, TrendingUp,
    PieChart as PieChartIcon, BarChart3, Lock
} from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { useAuth } from "../context/AuthContext";
import { Badge } from "../components/ui/Badge";
import { StaffForecastWidget } from "../components/ai/StaffForecastWidget";
import { TurnoverRiskWidget } from "../components/ai/TurnoverRiskWidget";
import { DepartmentChart } from "../components/dashboard/DepartmentChart";
import { StaffCompositionChart } from "../components/dashboard/StaffCompositionChart";
import { RankDistributionChart } from "../components/dashboard/RankDistributionChart";
import { ChangePasswordModal } from "../components/auth/ChangePasswordModal";
import { dashboardService, type DashboardStat } from "../services/dashboardService";
import { employeeService } from "../services/employeeService";
import { ProfileCompletionBanner } from "../components/employees/profile/ProfileCompletionBanner";
import { useTranslation } from "react-i18next";

const ICON_MAP: Record<string, any> = {
    Users,
    UserPlus,
    Clock,
    CalendarCheck,
    FileText,
    Briefcase,
    GraduationCap,
    AlertCircle,
    Award,
    TrendingUp
};

export default function Dashboard() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [stats, setStats] = useState<DashboardStat[]>([]);
    const [campusMetrics, setCampusMetrics] = useState<DashboardStat[]>([]);
    const [activities, setActivities] = useState<{ type: string; message: string; time: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [employeeData, setEmployeeData] = useState<any>(null);

    const fetchStats = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) setRefreshing(true);
            else setLoading(true);

            const [statsData, activityData] = await Promise.all([
                dashboardService.getStats(),
                dashboardService.getActivity()
            ]);

            if (user?.role === 'admin' || user?.role === 'hr') {
                const campusData = await dashboardService.getCampusMetrics();
                setCampusMetrics(campusData);
            }

            if (user?.role === 'employee') {
                const me = await employeeService.getMe();
                setEmployeeData(me);
            }

            setStats(statsData);
            setActivities(activityData);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to load statistics');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, [user]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const handleExport = async () => {
        try {
            const blob = await dashboardService.exportReport();
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

    const showAdminFeatures = user?.role === "admin" || user?.role === "hr";

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {user?.role === 'employee' ? `${user?.name}'s ${t('dashboard.title')}` : t('dashboard.title')}
                        </h1>
                        <Badge variant={getRoleBadgeVariant(user?.role || "") as any} className="text-xs px-2 py-0.5 capitalize">
                            {user?.role} {t('dashboard.account')}
                        </Badge>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400">{t('dashboard.welcomeBack')}, {user?.name}.</p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
                    >
                        <Lock className="w-4 h-4" />
                        {t('dashboard.security') || "Security"}
                    </button>
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

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)} 
            />

            {error && (
                <div className="p-4 bg-red-50 border border-red-100 text-red-700 rounded-lg flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    <p>{error}</p>
                    <button onClick={() => fetchStats()} className="ml-auto underline font-medium">{t('dashboard.retry')}</button>
                </div>
            )}

            {user?.role === 'employee' && employeeData && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                    <ProfileCompletionBanner 
                        employee={employeeData} 
                        employeeId={employeeData.id} 
                        isOwnProfile={true} 
                    />
                </div>
            )}

            {/* Core Stats Section */}
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

            {/* Campus Health Metrics (Admin Only) */}
            {showAdminFeatures && campusMetrics.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary-600" />
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Campus Health Metrics</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {campusMetrics.map((stat) => (
                            <div key={stat.title} className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-primary-100 dark:border-gray-700 shadow-sm border-t-4 border-t-primary-500">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                                        {ICON_MAP[stat.icon] ? (
                                            <div className="text-primary-600">
                                                {(() => {
                                                    const Icon = ICON_MAP[stat.icon];
                                                    return <Icon className="h-5 w-5" />;
                                                })()}
                                            </div>
                                        ) : <Briefcase className="h-5 w-5 text-primary-600" />}
                                    </div>
                                    {stat.trend && (
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${stat.trend.isPositive ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                            {stat.trend.value}
                                        </span>
                                    )}
                                </div>
                                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</h4>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Insights Section */}
            {showAdminFeatures && (
                <div className="space-y-4">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">{t('dashboard.aiInsights')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <StaffForecastWidget />
                        <TurnoverRiskWidget />
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Analytics Section */}
                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <PieChartIcon className="h-5 w-5 text-indigo-500" />
                                {user?.role === "employee" ? t('dashboard.performanceStats') : "Staff Composition"}
                            </h3>
                        </div>
                        <div className="w-full min-h-[250px]">
                            {user?.role === "employee" ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                                    <BarChart3 className="h-12 w-12 opacity-20 mb-3" />
                                    <p>{t('dashboard.personalStatsComingSoon')}</p>
                                </div>
                            ) : (
                                <StaffCompositionChart />
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-primary-500" />
                                {user?.role === "employee" ? "Leave Trends" : "Department Headcount"}
                            </h3>
                        </div>
                        <div className="w-full min-h-[250px]">
                            <DepartmentChart />
                        </div>
                    </div>

                    {showAdminFeatures && (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Award className="h-5 w-5 text-amber-500" />
                                    Academic Rank Distribution
                                </h3>
                            </div>
                            <div className="w-full min-h-[250px]">
                                <RankDistributionChart />
                            </div>
                        </div>
                    )}
                </div>

                {/* Activity Feed Section */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-all duration-200 hover:shadow-md h-fit sticky top-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-gray-500" />
                        {user?.role === "employee" ? t('dashboard.myAnnouncements') : t('dashboard.systemActivity')}
                    </h3>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                        {activities.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <RefreshCw className="h-10 w-10 mx-auto opacity-20 mb-3 animate-spin-slow" />
                                <p>{t('dashboard.noActivity')}</p>
                            </div>
                        ) : (
                            activities.map((act, index) => (
                                <div key={index} className={`p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${act.type === 'holiday'
                                    ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800'
                                    : 'bg-gray-50 border-gray-100 dark:bg-gray-700/50 dark:border-gray-700 shadow-sm'
                                    }`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-0.5 p-2 rounded-lg shadow-sm ${act.type === 'hire' ? 'bg-green-100 text-green-600' :
                                            act.type === 'leave' ? 'bg-blue-100 text-blue-600' :
                                                act.type === 'holiday' ? 'bg-amber-100 text-amber-600' :
                                                    'bg-gray-100 text-gray-600'
                                            }`}>
                                            {act.type === 'hire' ? <UserPlus className="w-4 h-4" /> :
                                                act.type === 'leave' ? <Clock className="w-4 h-4" /> :
                                                    act.type === 'holiday' ? <GraduationCap className="w-4 h-4" /> :
                                                        <FileText className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className={`text-sm leading-relaxed ${act.type === 'holiday' ? 'font-semibold text-amber-900 dark:text-amber-400' : 'text-gray-700 dark:text-gray-200'}`}>
                                                {act.message}
                                            </p>
                                            <span className="text-xs text-gray-400 mt-2 block font-medium">
                                                {new Date(act.time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })} at {new Date(act.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
