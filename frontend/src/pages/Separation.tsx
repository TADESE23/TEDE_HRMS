

export default function Separation() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Separation & Exit Management</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Process resignations, retirements, and contract expiries.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Resignations</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">2</div>
                    <div className="mt-2 text-sm text-yellow-600">Pending Clearance</div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Retirements (This Year)</h3>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">5</div>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Exit Process Workflows</h2>
                <div className="space-y-4">
                    {/* Placeholder for list of exiting employees */}
                    <div className="p-4 border border-gray-100 dark:border-gray-700 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">John Doe</p>
                                <p className="text-xs text-gray-500">Lecturer I • Resignation</p>
                            </div>
                        </div>
                        <button className="text-primary-600 text-sm font-medium">View Clearance</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
