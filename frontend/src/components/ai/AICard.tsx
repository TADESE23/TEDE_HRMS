import React from "react";
import { Sparkles } from "lucide-react";

interface AICardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    className?: string;
}

export function AICard({ title, subtitle, children, className = "" }: AICardProps) {
    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shadow-sm overflow-hidden ${className}`}>
            <div className="px-6 py-4 border-b border-indigo-50 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/10 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
                    </div>
                    {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">
                    AI Insight
                </span>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );
}
