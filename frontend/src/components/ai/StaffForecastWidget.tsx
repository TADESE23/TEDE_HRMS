import { TrendingUp, Users, BookOpen, Stethoscope, Settings, Briefcase, Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { AICard } from "./AICard";
import { useState, useEffect } from "react";
import { aiService } from "../../services/aiService";

interface CategoryForecast {
    metric: string;
    category: string;
    current_staff: number;
    predicted_value: number;
    gap: number;
    confidence_score: number;
}

const CATEGORY_META: Record<string, { icon: any; color: string; bg: string; border: string }> = {
    Academic:       { icon: BookOpen,    color: "text-indigo-600",  bg: "bg-indigo-50 dark:bg-indigo-900/20",  border: "border-indigo-200 dark:border-indigo-800" },
    Technical:      { icon: Settings,    color: "text-amber-600",   bg: "bg-amber-50 dark:bg-amber-900/20",    border: "border-amber-200 dark:border-amber-800"   },
    Administrative: { icon: Briefcase,   color: "text-blue-600",    bg: "bg-blue-50 dark:bg-blue-900/20",      border: "border-blue-200 dark:border-blue-800"     },
    Health:         { icon: Stethoscope, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20",border: "border-emerald-200 dark:border-emerald-800"},
};

export function StaffForecastWidget() {
    const [forecasts, setForecasts] = useState<CategoryForecast[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [regenerating, setRegenerating] = useState(false);

    const load = async (forceRegen = false) => {
        try {
            if (forceRegen) setRegenerating(true);
            else setLoading(true);
            setError(null);

            // If force-regen, call generate endpoint first
            if (forceRegen) await aiService.generateForecasts();

            const data: any[] = await aiService.getForecasts();

            // Normalise: backend returns either cached DB rows or freshly generated enriched objects
            const normalised: CategoryForecast[] = data.map((d: any) => ({
                metric:          d.metric,
                category:        d.category ?? d.metric.replace("category_", ""),
                current_staff:   d.current_staff ?? 0,
                predicted_value: parseInt(d.predicted_value ?? d.predicted_staff ?? 0),
                gap:             d.gap ?? ((parseInt(d.predicted_value ?? "0") - (d.current_staff ?? 0))),
                confidence_score: parseFloat(d.confidence_score ?? 80),
            }));

            setForecasts(normalised);
        } catch (err: any) {
            setError(err.message || "Failed to load AI forecasts.");
        } finally {
            setLoading(false);
            setRegenerating(false);
        }
    };

    useEffect(() => { load(); }, []);

    // ── Summary totals ──────────────────────────────────
    const totalCurrent   = forecasts.reduce((s, f) => s + (f.current_staff || 0), 0);
    const totalPredicted = forecasts.reduce((s, f) => s + f.predicted_value, 0);
    const totalGap       = totalPredicted - totalCurrent;

    return (
        <AICard title="TEDE Campus Staffing Forecast" subtitle="AI model prediction · next 12 months by category">
            {loading ? (
                <div className="flex flex-col items-center justify-center py-10 gap-3">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
                    <p className="text-sm text-gray-500">Running forecast model…</p>
                </div>
            ) : error ? (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 text-sm text-red-600 flex items-start gap-3">
                    <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                    <div className="flex-1">
                        <p>{error}</p>
                        <button
                            onClick={() => load(true)}
                            className="mt-2 text-xs underline font-medium text-red-700 hover:text-red-800"
                        >
                            Retry forecast
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">

                    {/* ── Category rows ── */}
                    {forecasts.map(f => {
                        const meta = CATEGORY_META[f.category] ?? {
                            icon: Users, color: "text-gray-600",
                            bg: "bg-gray-50 dark:bg-gray-700/30",
                            border: "border-gray-200 dark:border-gray-700"
                        };
                        const Icon = meta.icon;
                        const conf = f.confidence_score;
                        const gapPositive = f.gap >= 0;

                        // Progress bar: how much of forecast is already filled
                        const fillPct = f.predicted_value > 0
                            ? Math.min(100, (f.current_staff / f.predicted_value) * 100)
                            : 100;

                        return (
                            <div
                                key={f.metric}
                                className={`p-4 rounded-xl border ${meta.bg} ${meta.border} transition-all hover:shadow-sm`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm`}>
                                            <Icon className={`w-4 h-4 ${meta.color}`} />
                                        </div>
                                        <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                                            {f.category} Staff
                                        </span>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                                        conf >= 85
                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                            : "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                    }`}>
                                        {conf}% conf.
                                    </span>
                                </div>

                                {/* Numbers row */}
                                <div className="flex items-end justify-between mb-2">
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Now</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {f.current_staff.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <TrendingUp className="w-4 h-4 text-gray-400 mx-auto" />
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Predicted</p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            {f.predicted_value.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500 dark:text-gray-400">Gap</p>
                                        <p className={`text-sm font-bold ${gapPositive ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"}`}>
                                            {gapPositive ? "+" : ""}{f.gap}
                                        </p>
                                    </div>
                                </div>

                                {/* Fill bar */}
                                <div className="w-full bg-white dark:bg-gray-700 rounded-full h-1.5">
                                    <div
                                        className={`h-1.5 rounded-full transition-all duration-500 ${meta.color.replace("text-", "bg-")}`}
                                        style={{ width: `${fillPct}%` }}
                                    />
                                </div>
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {fillPct.toFixed(0)}% of predicted headcount already filled
                                </p>
                            </div>
                        );
                    })}

                    {/* ── Campus totals ── */}
                    {forecasts.length > 0 && (
                        <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-100 dark:border-indigo-800">
                            <p className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 mb-2 uppercase tracking-wide">
                                Campus Total
                            </p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-500">Current</p>
                                    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                        {totalCurrent.toLocaleString()}
                                    </p>
                                </div>
                                <TrendingUp className="w-5 h-5 text-indigo-400" />
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Needed (1 yr)</p>
                                    <p className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                                        {totalPredicted.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">Total Gap</p>
                                    <p className={`text-lg font-bold ${totalGap > 0 ? "text-red-600" : "text-green-600"}`}>
                                        {totalGap > 0 ? "+" : ""}{totalGap}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ── Footer ── */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                        <p className="text-xs text-gray-400">
                            Linear regression · trained on 100 TEDE historical data points
                        </p>
                        <button
                            onClick={() => load(true)}
                            disabled={regenerating}
                            className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 font-medium disabled:opacity-50"
                        >
                            <RefreshCw className={`w-3 h-3 ${regenerating ? "animate-spin" : ""}`} />
                            {regenerating ? "Running…" : "Re-run model"}
                        </button>
                    </div>
                </div>
            )}
        </AICard>
    );
}
