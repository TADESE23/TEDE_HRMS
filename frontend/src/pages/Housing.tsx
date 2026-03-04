import { Home } from "lucide-react";

export default function Housing() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Housing</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage university housing assignments and contracts.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stats */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                        <Home className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-gray-500">Available Units</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Housing Requests</h2>
                <div className="text-center py-6 text-gray-500 text-sm">
                    No pending housing requests.
                </div>
            </div>
        </div>
    );
}
