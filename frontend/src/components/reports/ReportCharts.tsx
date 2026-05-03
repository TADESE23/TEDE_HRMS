import React from 'react';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid,
    PieChart, Pie, Legend, LineChart, Line
} from 'recharts';

const COLORS = ['#6366F1', '#8B5CF6', '#EC4899', '#F43F5E', '#10B981', '#3B82F6', '#F59E0B'];

const renderTooltipContent = (props: any) => {
    const { payload, label } = props;
    if (payload && payload.length) {
        return (
            <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                <p className="text-gray-900 dark:text-gray-100 font-medium mb-1">{label || payload[0].name}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

// 1. Academic vs Admin Ratio
export function AcademicAdminChart() {
    const data = [
        { name: 'Academic Staff', value: 350 },
        { name: 'Admin Staff', value: 150 },
    ];
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={renderTooltipContent} />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

// 2. Leave Consumption
export function LeaveConsumptionChart() {
    const data = [
        { name: 'Annual', value: 120 },
        { name: 'Sick', value: 45 },
        { name: 'Maternity', value: 15 },
        { name: 'Paternity', value: 5 },
        { name: 'Study', value: 30 },
    ];
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={renderTooltipContent} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={40}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// 3. Attendance Violations
export function AttendanceChart() {
    const data = [
        { month: 'Jan', Lateness: 20, Absence: 5 },
        { month: 'Feb', Lateness: 15, Absence: 8 },
        { month: 'Mar', Lateness: 25, Absence: 12 },
        { month: 'Apr', Lateness: 18, Absence: 4 },
        { month: 'May', Lateness: 10, Absence: 2 },
        { month: 'Jun', Lateness: 30, Absence: 15 },
    ];
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={renderTooltipContent} />
                    <Legend />
                    <Bar dataKey="Lateness" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                    <Bar dataKey="Absence" stackId="a" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// 4. Promotion History
export function PromotionHistoryChart() {
    const data = [
        { year: '2020', Promotions: 45 },
        { year: '2021', Promotions: 52 },
        { year: '2022', Promotions: 38 },
        { year: '2023', Promotions: 65 },
        { year: '2024', Promotions: 48 },
        { year: '2025', Promotions: 70 },
    ];
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={renderTooltipContent} />
                    <Line type="monotone" dataKey="Promotions" stroke="#10B981" strokeWidth={3} activeDot={{ r: 8 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// 5. Payroll Grade Distribution
export function PayrollGradeChart() {
    const data = [
        { grade: 'Grade 1-3', count: 40 },
        { grade: 'Grade 4-6', count: 85 },
        { grade: 'Grade 7-9', count: 120 },
        { grade: 'Grade 10-12', count: 70 },
        { grade: 'Grade 13-15', count: 30 },
        { grade: 'Grade 16+', count: 10 },
    ];
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                    <XAxis type="number" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis dataKey="grade" type="category" stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} width={80} />
                    <Tooltip content={renderTooltipContent} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={20} fill="#8B5CF6" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// 6. Employee Turnover
export function TurnoverChart() {
    const data = [
        { year: '2020', Resignations: 12, Retirements: 8 },
        { year: '2021', Resignations: 15, Retirements: 10 },
        { year: '2022', Resignations: 18, Retirements: 12 },
        { year: '2023', Resignations: 14, Retirements: 9 },
        { year: '2024', Resignations: 20, Retirements: 15 },
    ];
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="year" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={renderTooltipContent} />
                    <Legend />
                    <Line type="monotone" dataKey="Resignations" stroke="#EF4444" strokeWidth={2} />
                    <Line type="monotone" dataKey="Retirements" stroke="#6366F1" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

// 7. Staff Qualification
export function QualificationChart() {
    const data = [
        { name: 'PhD', value: 85 },
        { name: 'Masters', value: 210 },
        { name: 'Bachelors', value: 150 },
        { name: 'Diploma', value: 45 },
        { name: 'Other', value: 10 },
    ];
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie data={data} cx="50%" cy="50%" outerRadius={100} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip content={renderTooltipContent} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}

// 8. Teaching Load Summary
export function TeachingLoadChart() {
    const data = [
        { dept: 'Computer Sci', load: 350 },
        { dept: 'Engineering', load: 420 },
        { dept: 'Medicine', load: 280 },
        { dept: 'Business', load: 310 },
        { dept: 'Law', load: 190 },
    ];
    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="dept" stroke="#9CA3AF" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#4B5563" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip content={renderTooltipContent} />
                    <Bar dataKey="load" name="Total Hours/Week" radius={[4, 4, 0, 0]} barSize={40} fill="#EC4899" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
