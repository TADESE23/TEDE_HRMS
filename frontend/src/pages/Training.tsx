import { GraduationCap, BookOpen } from "lucide-react";

export default function Training() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training & Development</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage training programs, scholarships, and professional development.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <BookOpen className="w-6 h-6 text-primary-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Training Management</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h3 className="font-medium text-sm">Active Programs</h3>
                            <p className="text-xs text-gray-500">No active training programs.</p>
                        </div>
                        <button className="text-sm text-primary-600 font-medium">Request Training +</button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <GraduationCap className="w-6 h-6 text-indigo-600" />
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Development</h2>
                    </div>
                    <div className="space-y-3">
                        <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                            <h3 className="font-medium text-sm">Scholarships</h3>
                            <p className="text-xs text-gray-500">Track staff on study leave/scholarship.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
