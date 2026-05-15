import { Home, Plus, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { housingService } from "../services/housingService";
import type { HousingRecord } from "../services/housingService";

export default function Housing() {
    const [housing, setHousing] = useState<HousingRecord[]>([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        loadHousing();
    }, []);

    const loadHousing = async () => {
        setLoading(true);
        try {
            const data = await housingService.getHousing();
            setHousing(data);
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
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Staff Housing</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage university housing assignments and contracts.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Housing Allocations</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="px-6 py-3">Employee</th>
                                <th className="px-6 py-3">Building/Unit</th>
                                <th className="px-6 py-3">Allocation Date</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-primary-500"/></td></tr>
                            ) : housing.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-8 text-gray-500">No housing records found.</td></tr>
                            ) : (
                                housing.map(h => (
                                    <tr key={h.id} className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
                                        <td className="px-6 py-4 font-medium">{h.first_name} {h.last_name}</td>
                                        <td className="px-6 py-4">{h.building_name} - {h.unit_number}</td>
                                        <td className="px-6 py-4">{new Date(h.allocation_date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                h.status === 'Allocated' ? 'bg-green-100 text-green-800' :
                                                h.status === 'Waitlisted' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                                {h.status}
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
