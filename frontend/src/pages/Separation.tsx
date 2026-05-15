import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { separationService } from "../services/separationService";
import type { SeparationRecord } from "../services/separationService";

export default function Separation() {
    const [separations, setSeparations] = useState<SeparationRecord[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        loadSeparations();
    }, []);

    const loadSeparations = async () => {
        setLoading(true);
        try {
            const data = await separationService.getSeparations();
            setSeparations(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Separation & Exit Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Process resignations, retirements, and contract expiries.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Exit Process Workflows</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="px-6 py-3">Employee</th>
                                <th className="px-6 py-3">Type</th>
                                <th className="px-6 py-3">Separation Date</th>
                                <th className="px-6 py-3">Clearance Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-primary-500"/></td></tr>
                            ) : separations.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No separation records found.</td></tr>
                            ) : (
                                separations.map(s => (
                                    <tr key={s.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium">{s.first_name} {s.last_name}</td>
                                        <td className="px-6 py-4">{s.separation_type}</td>
                                        <td className="px-6 py-4">{new Date(s.separation_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                s.clearance_status === 'Cleared' ? 'bg-green-100 text-green-800' :
                                                s.clearance_status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {s.clearance_status}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
