import { useState, useEffect } from "react";
import { Loader2, Calculator, CheckCircle } from "lucide-react";
import { payrollService } from "../services/payrollService";
import type { PayrollRecord } from "../services/payrollService";

export default function Payroll() {
    const [records, setRecords] = useState<PayrollRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [monthYear, setMonthYear] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    useEffect(() => {
        fetchRecords();
    }, [monthYear]);

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const data = await payrollService.getRecords(monthYear);
            setRecords(data);
        } catch (error) {
            console.error("Failed to load payroll records", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            await payrollService.generatePayroll(monthYear);
            fetchRecords();
        } catch (error) {
            console.error("Failed to generate payroll", error);
        } finally {
            setGenerating(false);
        }
    };
    
    const handleApprove = async (id: number) => {
        try {
            await payrollService.approvePayroll(id);
            fetchRecords();
        } catch (error) {
            console.error("Failed to approve payroll", error);
        }
    };
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Configuration</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage salaries, allowances, deductions and tax info.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payroll Records</h2>
                    <div className="flex gap-4 items-center">
                        <input 
                            type="month" 
                            value={monthYear} 
                            onChange={(e) => setMonthYear(e.target.value)}
                            className="text-sm border border-gray-300 rounded p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        />
                        <button 
                            onClick={handleGenerate} 
                            disabled={generating}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 flex items-center gap-2 text-sm"
                        >
                            {generating ? <Loader2 className="w-4 h-4 animate-spin"/> : <Calculator className="w-4 h-4" />}
                            Generate Payroll
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="px-6 py-3">Employee</th>
                                <th className="px-6 py-3">Gross (ETB)</th>
                                <th className="px-6 py-3">Tax (ETB)</th>
                                <th className="px-6 py-3">Pension (ETB)</th>
                                <th className="px-6 py-3">Net Pay (ETB)</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto" />
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="text-center py-8 text-gray-500">
                                        No payroll records for this month. Click generate.
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {record.first_name} {record.last_name}
                                        </td>
                                        <td className="px-6 py-4 font-medium">{parseFloat(record.taxable_income).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-red-500">{parseFloat(record.income_tax).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-orange-500">{parseFloat(record.pension_7_percent).toLocaleString()}</td>
                                        <td className="px-6 py-4 font-bold text-green-600">{parseFloat(record.net_pay).toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                record.status === 'Processed' ? 'bg-blue-100 text-blue-800' :
                                                record.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {record.status === 'Draft' ? (
                                                <button onClick={() => handleApprove(record.id)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-xs">
                                                    <CheckCircle className="w-3 h-3"/> Approve
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400">Locked</span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Config Cards */}
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Salary Grades</h3>
                            <p className="text-sm text-gray-500">Configure base salaries per grade.</p>
                        </div>
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Allowances</h3>
                            <p className="text-sm text-gray-500">Housing, Transport, Position allowances.</p>
                        </div>
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">Deductions & Tax</h3>
                            <p className="text-sm text-gray-500">Pension, Income Tax settings.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
