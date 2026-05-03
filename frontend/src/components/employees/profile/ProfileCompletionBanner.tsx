import { useState } from "react";
import {
    CheckCircle2, AlertCircle, ChevronDown, ChevronUp,
    ClipboardList, XCircle, Sparkles
} from "lucide-react";
import { computeProfileCompletion } from "../../../utils/profileCompletion";
import { cn } from "../../../utils/cn";
import { useNavigate } from "react-router-dom";

interface ProfileCompletionBannerProps {
    employee: any;
    employeeId?: string;
    isAdmin?: boolean;
    isOwnProfile?: boolean;
}

export function ProfileCompletionBanner({ employee, employeeId, isAdmin = false, isOwnProfile = false }: ProfileCompletionBannerProps) {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();
    const { percentage, status, sections, missingRequired } = computeProfileCompletion(employee);

    const statusConfig = {
        complete: {
            bg: 'bg-emerald-50 border-emerald-200',
            bar: 'bg-emerald-500',
            badge: 'bg-emerald-100 text-emerald-800',
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
            label: 'Profile Complete',
            desc: 'All required information has been filled in.',
        },
        partial: {
            bg: 'bg-amber-50 border-amber-200',
            bar: 'bg-amber-400',
            badge: 'bg-amber-100 text-amber-800',
            icon: <AlertCircle className="h-5 w-5 text-amber-500" />,
            label: 'Profile Partially Complete',
            desc: 'Some fields are missing. Please complete your profile.',
        },
        incomplete: {
            bg: 'bg-red-50 border-red-200',
            bar: 'bg-red-400',
            badge: 'bg-red-100 text-red-800',
            icon: <XCircle className="h-5 w-5 text-red-500" />,
            label: 'Profile Incomplete',
            desc: 'Critical information is missing. Please fill in all required fields.',
        },
    };

    const cfg = statusConfig[status];

    const getSectionColor = (pct: number) => {
        if (pct === 100) return 'bg-emerald-500';
        if (pct >= 60)  return 'bg-amber-400';
        return 'bg-red-400';
    };

    return (
        <div className={cn("rounded-xl border p-4 transition-all duration-300", cfg.bg)}>
            {/* ── Top Row ── */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    {cfg.icon}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm">{cfg.label}</span>
                            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", cfg.badge)}>
                                {percentage}% complete
                            </span>
                            {status === 'complete' && (
                                <span className="flex items-center gap-1 text-xs text-emerald-700 font-medium">
                                    <Sparkles className="h-3 w-3" /> All done!
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 hidden sm:block">{cfg.desc}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                    {/* CTA for self-service only (Admins can only see) */}
                    {status !== 'complete' && isOwnProfile && (
                        <button
                            onClick={() => navigate(`/employees/${employeeId}/edit`)}
                            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition-colors flex items-center gap-1"
                        >
                            <ClipboardList className="h-3 w-3" />
                            Update Profile
                        </button>
                    )}
                    <button
                        onClick={() => setExpanded(!expanded)}
                        className="p-1.5 rounded-lg hover:bg-white/60 transition-colors text-gray-500"
                        aria-label="Toggle details"
                    >
                        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                </div>
            </div>

            {/* ── Progress Bar ── */}
            <div className="mt-3 h-2 bg-white/70 rounded-full overflow-hidden">
                <div
                    className={cn("h-full rounded-full transition-all duration-700 ease-out", cfg.bar)}
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {/* ── Expandable Detail ── */}
            {expanded && (
                <div className="mt-4 space-y-4 border-t border-white/50 pt-4">
                    {/* Section Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {sections.map((section) => (
                            <div key={section.id} className="bg-white/70 rounded-lg p-3 space-y-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-medium text-gray-700 flex items-center gap-1">
                                        <span>{section.icon}</span>
                                        {section.label}
                                    </span>
                                    <span className="text-xs font-bold text-gray-900">{section.percentage}%</span>
                                </div>
                                <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-500", getSectionColor(section.percentage))}
                                        style={{ width: `${section.percentage}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-500">{section.completed}/{section.total} fields</p>
                            </div>
                        ))}
                    </div>

                    {/* Missing Required Fields */}
                    {missingRequired.length > 0 && (
                        <div className="bg-white/70 rounded-lg p-4">
                            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <XCircle className="h-3.5 w-3.5 text-red-500" />
                                Missing Required Fields ({missingRequired.length})
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {missingRequired.map((field) => (
                                    <span
                                        key={field.key}
                                        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 font-medium"
                                    >
                                        <span className="h-1.5 w-1.5 rounded-full bg-red-400 inline-block" />
                                        {field.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* All fields checklist (optional detail) */}
                    <div className="bg-white/70 rounded-lg p-4">
                        <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Field Checklist</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1.5">
                            {sections.flatMap(s => s.fields).map((field) => (
                                <div key={field.key} className="flex items-center gap-2 text-xs">
                                    {field.filled ? (
                                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                                    ) : (
                                        <XCircle className={cn("h-3.5 w-3.5 shrink-0", field.required ? "text-red-400" : "text-gray-300")} />
                                    )}
                                    <span className={cn(
                                        field.filled ? "text-gray-600" : field.required ? "text-red-600 font-medium" : "text-gray-400"
                                    )}>
                                        {field.label}
                                        {field.required && !field.filled && <span className="ml-0.5 text-red-500">*</span>}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <p className="text-xs text-gray-400 mt-3">* Required fields</p>
                    </div>
                </div>
            )}
        </div>
    );
}
