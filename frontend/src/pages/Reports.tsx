import { FileText, BarChart2, PieChart, Users, TrendingUp, AlertCircle, BookOpen } from "lucide-react";

export default function Reports() {
    const reports = [
        { title: "Headcount per Department", description: "Total employees by department/unit.", icon: Users },
        { title: "Academic vs Admin Ratio", description: "Staff distribution statistics.", icon: PieChart },
        { title: "Leave Consumption", description: "Annual leave utilization report.", icon: BarChart2 },
        { title: "Attendance Violations", description: "Lateness and absence records.", icon: AlertCircle },
        { title: "Promotion History", description: "Staff promotion logs over time.", icon: TrendingUp },
        { title: "Payroll Grade Distribution", description: "Salary scale distribution analysis.", icon: FileText },
        { title: "Employee Turnover", description: "Resignation and retirement stats.", icon: TrendingUp },
        { title: "Staff Qualification", description: "PhD, Masters, Degree holders count.", icon: BookOpen },
        { title: "Teaching Load Summary", description: "Workload distribution per department.", icon: BookOpen },
    ];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">HR Analytics & Reports</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Generate insights for decision making.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="p-3 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg group-hover:bg-primary-100 transition-colors">
                                <report.icon className="w-6 h-6" />
                            </div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{report.description}</p>
                        <div className="flex gap-2">
                            <button className="text-sm font-medium text-primary-600 hover:text-primary-800">View Report</button>
                            <span className="text-gray-300">|</span>
                            <button className="text-sm font-medium text-gray-500 hover:text-gray-700">Export CSV</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
