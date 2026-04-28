import { FileText, BarChart2, PieChart, Users, TrendingUp, AlertCircle, BookOpen, X } from "lucide-react";
import { dashboardService } from "../services/dashboardService";
import { DepartmentChart } from "../components/dashboard/DepartmentChart";
import { useState } from "react";

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

    const [selectedReport, setSelectedReport] = useState<string | null>(null);

    const handleView = (title: string) => {
        setSelectedReport(title);
    };

    const handleExport = async (title: string) => {
        try {
            const blob = await dashboardService.exportReport();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${title.replace(/\s+/g, '_').toLowerCase()}_report.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err: any) {
            alert(`Export Failed: ${err.message}`);
        }
    };

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
                            <button 
                                onClick={() => handleView(report.title)}
                                className="text-sm font-medium text-primary-600 hover:text-primary-800"
                            >
                                View Report
                            </button>
                            <span className="text-gray-300">|</span>
                            <button 
                                onClick={() => handleExport(report.title)}
                                className="text-sm font-medium text-gray-500 hover:text-gray-700"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {selectedReport && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col">
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedReport} Report</h2>
                            <button onClick={() => setSelectedReport(null)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-6 flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-[300px]">
                            {selectedReport === "Headcount per Department" ? (
                                <div className="w-full h-full min-h-[300px] bg-white dark:bg-gray-800 p-4 rounded-xl">
                                    <DepartmentChart />
                                </div>
                            ) : (
                                <div className="text-center">
                                    <BarChart2 className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">Detailed visualization for <strong>{selectedReport}</strong></p>
                                    <p className="text-sm text-gray-500 mt-2">Full historical charts are available on the main Dashboard view.</p>
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-white dark:bg-gray-800">
                            <button onClick={() => setSelectedReport(null)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">Close</button>
                            <button onClick={() => handleExport(selectedReport)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Download CSV</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
