import React from "react";
import { BarChart2, X } from "lucide-react";
import { DepartmentChart } from "../dashboard/DepartmentChart";
import {
    AcademicAdminChart,
    LeaveConsumptionChart,
    AttendanceChart,
    PromotionHistoryChart,
    PayrollGradeChart,
    TurnoverChart,
    QualificationChart,
    TeachingLoadChart
} from "./ReportCharts";

interface ReportViewModalProps {
    selectedReport: string;
    onClose: () => void;
    onExport: (title: string) => void;
}

export function ReportViewModal({ selectedReport, onClose, onExport }: ReportViewModalProps) {
    
    const renderChart = () => {
        switch (selectedReport) {
            case "Headcount per Department":
                return <DepartmentChart />;
            case "Academic vs Admin Ratio":
                return <AcademicAdminChart />;
            case "Leave Consumption":
                return <LeaveConsumptionChart />;
            case "Attendance Violations":
                return <AttendanceChart />;
            case "Promotion History":
                return <PromotionHistoryChart />;
            case "Payroll Grade Distribution":
                return <PayrollGradeChart />;
            case "Employee Turnover":
                return <TurnoverChart />;
            case "Staff Qualification":
                return <QualificationChart />;
            case "Teaching Load Summary":
                return <TeachingLoadChart />;
            default:
                return (
                    <div className="text-center">
                        <BarChart2 className="w-16 h-16 text-primary-300 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">Detailed visualization for <strong>{selectedReport}</strong></p>
                        <p className="text-sm text-gray-500 mt-2">Full historical charts are available on the main Dashboard view.</p>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedReport} Report</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6 flex-1 bg-gray-50 dark:bg-gray-900 flex items-center justify-center min-h-[400px]">
                    <div className="w-full h-full min-h-[350px] bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center justify-center">
                        {renderChart()}
                    </div>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-white dark:bg-gray-800">
                    <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600">Close</button>
                    <button onClick={() => onExport(selectedReport)} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">Download CSV</button>
                </div>
            </div>
        </div>
    );
}
