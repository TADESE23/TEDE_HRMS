import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";
import { useTranslation } from "react-i18next";

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({ title, value, icon: Icon, trend, className }: StatsCardProps) {
    const { t } = useTranslation();

    return (
        <div className={cn("bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{t(`stats.${title}`, title)}</p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
                </div>
                <div className="h-12 w-12 bg-primary-50 rounded-lg flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary-600" />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center text-sm">
                    <span className={cn("font-medium", trend.isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400")}>
                        {trend.isPositive ? "+" : ""}{trend.value}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">{t('statsCard.fromLastMonth')}</span>
                </div>
            )}
        </div>
    );
}
