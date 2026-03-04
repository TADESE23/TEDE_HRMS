import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { useState, useEffect } from 'react';
import { dashboardService } from '../../services/dashboardService';
import { Loader2 } from 'lucide-react';
import { useTranslation } from "react-i18next";

export function DepartmentChart() {
    const { t } = useTranslation();
    const [data, setData] = useState<{ name: string; value: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadAnalytics = async () => {
            try {
                const analyticsData = await dashboardService.getAnalytics();
                // Sort by count descending
                analyticsData.sort((a, b) => b.value - a.value);
                setData(analyticsData);
            } catch (err: any) {
                console.error(err);
                setError(t('chart.failedLoad'));
            } finally {
                setLoading(false);
            }
        };

        loadAnalytics();
    }, []);

    const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#10B981', '#3B82F6'];

    if (loading) {
        return (
            <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-indigo-500 animate-spin opacity-50" />
            </div>
        );
    }

    if (error) {
        return <div className="h-[300px] flex items-center justify-center text-red-500 text-sm">{error}</div>;
    }

    if (data.length === 0) {
        return <div className="h-[300px] flex items-center justify-center text-gray-400 text-sm">{t('chart.noData')}</div>;
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#4B5563"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        width={100}
                    />
                    <Tooltip
                        cursor={{ fill: 'transparent' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
