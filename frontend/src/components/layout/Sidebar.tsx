import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    Briefcase,
    FileText,
    Settings,
    LogOut,
    GraduationCap,
    BookOpen,
    Clock,
    Target,
    FolderOpen,
    DollarSign,
    Home,
    AlertTriangle
} from "lucide-react";
import { cn } from "../../utils/cn";

import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

export function Sidebar() {
    const { t } = useTranslation();
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const getNavigation = (role?: string) => {
        const common = [
            { name: t('sidebar.dashboard'), href: "/", icon: LayoutDashboard },
        ];

        switch (role) {
            case "admin":
                return [
                    ...common,
                    { name: t('sidebar.employees'), href: "/employees", icon: Users },
                    { name: t('sidebar.attendance'), href: "/attendance", icon: Clock },
                    { name: t('sidebar.leave'), href: "/leave", icon: CalendarDays },
                    { name: t('sidebar.recruitment'), href: "/recruitment", icon: Briefcase },
                    { name: t('sidebar.performance'), href: "/performance", icon: Target },
                    { name: t('sidebar.training'), href: "/training", icon: GraduationCap },
                    { name: t('sidebar.academic'), href: "/academic", icon: BookOpen },
                    { name: t('sidebar.disciplinary'), href: "/disciplinary", icon: AlertTriangle },
                    { name: t('sidebar.documents'), href: "/documents", icon: FolderOpen },
                    { name: t('sidebar.payroll'), href: "/payroll", icon: DollarSign },
                    { name: t('sidebar.housing'), href: "/housing", icon: Home },
                    { name: t('sidebar.separation'), href: "/separation", icon: LogOut },
                    { name: t('sidebar.reports'), href: "/reports", icon: FileText },
                    { name: t('sidebar.settings'), href: "/settings", icon: Settings },
                ];
            case "hr":
                return [
                    ...common,
                    { name: t('sidebar.employees'), href: "/employees", icon: Users },
                    { name: t('sidebar.leave'), href: "/leave", icon: CalendarDays },
                    { name: t('sidebar.recruitment'), href: "/recruitment", icon: Briefcase },
                    { name: t('sidebar.reports'), href: "/reports", icon: FileText },
                ];
            case "manager":
                return [
                    ...common,
                    { name: t('sidebar.myTeam'), href: "/employees", icon: Users },
                    { name: t('sidebar.leaveApprovals'), href: "/leave", icon: CalendarDays },
                    { name: t('sidebar.reports'), href: "/reports", icon: FileText },
                ];
            case "recruiter":
                return [
                    ...common,
                    { name: t('sidebar.jobPostings'), href: "/recruitment", icon: Briefcase },
                    { name: t('sidebar.candidates'), href: "/recruitment/candidates", icon: Users },
                ];
            case "employee":
            default:
                return [
                    ...common,
                    { name: t('sidebar.myProfile'), href: `/employees/me`, icon: Users },
                    { name: t('sidebar.leaveRequest'), href: "/leave", icon: CalendarDays },
                    { name: t('sidebar.academicProfile'), href: `/employees/me?tab=academic`, icon: BookOpen },
                ];
        }
    };

    const navigation = getNavigation(user?.role);

    return (
        <div className="flex h-screen w-64 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex h-16 items-center gap-2 px-6 border-b border-gray-100 dark:border-gray-700">
                <GraduationCap className="h-8 w-8 text-primary-600 dark:text-primary-400" />
                <div className="flex flex-col">
                    <span className="text-lg font-bold text-gray-900 dark:text-white leading-none">UOG TEDEy</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">HR Management</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3">
                <nav className="space-y-1">
                    {navigation.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            end={item.href === "/"}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400"
                                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                                )
                            }
                        >
                            <item.icon className="h-5 w-5" />
                            {item.name}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                    <LogOut className="h-5 w-5" />
                    {t('sidebar.signOut')}
                </button>
            </div>
        </div>
    );
}
