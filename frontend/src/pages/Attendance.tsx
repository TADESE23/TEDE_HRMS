import { Clock } from "lucide-react";

export default function Attendance() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Track daily attendance, overtime, and timesheets.
                    </p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Today's Attendance</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">95%</p>
                        </div>
                    </div>
                </div>
                {/* Add more widgets as per requirements */}
            </div>

            {/* Attendance Sections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Attendance Tracking</h2>
                <p className="text-gray-500">Attendance grid and logs will appear here.</p>
                {/* Requirements: Daily attendance, Clock-in/out, Manual correction, Timesheet */}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Overtime Requests</h2>
                <p className="text-gray-500">Overtime workflow and approvals.</p>
            </div>
        </div>
    );
}
