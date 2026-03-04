import { AlertTriangle, Gavel } from "lucide-react";

export default function Disciplinary() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Disciplinary Cases</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage misconduct cases, warnings, and hearings.
                </p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 rounded-lg p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Confidential Area</h3>
                    <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                        Access to disciplinary records is restricted to authorized HR personnel and the Disciplinary Board.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Cases</h2>
                    <button className="text-sm bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 flex items-center gap-2">
                        <Gavel className="w-4 h-4" /> New Case
                    </button>
                </div>
                <div className="text-center py-8 text-gray-500">No active disciplinary cases found.</div>
            </div>
        </div>
    );
}
