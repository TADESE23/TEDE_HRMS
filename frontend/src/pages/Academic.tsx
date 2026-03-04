import { BookOpen, School } from "lucide-react";

export default function Academic() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Management</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage academic loads, research, and publications.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Load</h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Track course assignments and workload per semester.</p>
                    <button className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300">View Workload Distribution</button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <School className="w-6 h-6 text-purple-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Research & Publications</h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Track journals, conferences, and community service.</p>
                    <button className="w-full py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300">Add Publication</button>
                </div>
            </div>
        </div>
    );
}
