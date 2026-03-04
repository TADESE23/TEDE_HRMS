

export default function Payroll() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payroll Configuration</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage salaries, allowances, deductions and tax info.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Payroll Data</h2>
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
