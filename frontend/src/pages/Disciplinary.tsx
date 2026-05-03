import { AlertTriangle, Gavel, Plus, X, Calendar, User, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { disciplinaryService } from "../services/disciplinaryService";

interface DisciplinaryAction {
    id: number;
    employee_id: number;
    first_name?: string;
    last_name?: string;
    incident_date: string;
    violation_type: string;
    action_taken: string;
    file_path?: string;
}

export default function Disciplinary() {
    const [actions, setActions] = useState<DisciplinaryAction[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [newAction, setNewAction] = useState({ 
        employee_id: 1, 
        incident_date: '', 
        violation_type: '', 
        action_taken: 'Verbal Warning' 
    });

    useEffect(() => {
        loadActions();
    }, []);

    const loadActions = async () => {
        try {
            setLoading(true);
            const data = await disciplinaryService.getActions();
            setActions(data);
        } catch (error) {
            console.error("Failed to load disciplinary actions:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAction = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await disciplinaryService.addAction(newAction);
            setShowModal(false);
            setNewAction({ 
                employee_id: 1, 
                incident_date: '', 
                violation_type: '', 
                action_taken: 'Verbal Warning' 
            });
            loadActions();
        } catch (error) {
            console.error("Failed to add disciplinary action:", error);
            alert("Failed to report disciplinary case");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Disciplinary Cases</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage misconduct cases, warnings, and hearings.
                    </p>
                </div>
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
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Active Cases</h2>
                    <button onClick={() => setShowModal(true)} className="text-sm bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 font-medium">
                        <Plus className="w-4 h-4" /> New Case
                    </button>
                </div>
                
                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-red-500" /></div>
                ) : actions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No active disciplinary cases found.</div>
                ) : (
                    <div className="space-y-4">
                        {actions.map(c => (
                            <div key={c.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-full">
                                        <Gavel className="w-5 h-5 text-gray-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">
                                            {c.first_name ? `${c.first_name} ${c.last_name}` : `Emp ID: ${c.employee_id}`}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{c.violation_type}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5"/> 
                                                Reported: {c.incident_date ? new Date(c.incident_date).toLocaleDateString() : 'N/A'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        c.action_taken === 'Dismissal' ? 'bg-red-100 text-red-800' :
                                        c.action_taken === 'Suspension' ? 'bg-orange-100 text-orange-800' :
                                        'bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-gray-200'
                                    }`}>
                                        {c.action_taken}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-2 text-red-600">
                                <AlertTriangle className="w-5 h-5" />
                                <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Report Disciplinary Case</h2>
                            </div>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5"/></button>
                        </div>
                        <form onSubmit={handleAddAction} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Employee ID</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input required type="number" value={newAction.employee_id} onChange={e => setNewAction({...newAction, employee_id: Number(e.target.value)})} className="w-full pl-9 p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="Search employee..." />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Violation Type</label>
                                <input required type="text" value={newAction.violation_type} onChange={e => setNewAction({...newAction, violation_type: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Unexcused Absence, Policy Violation" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Incident Date</label>
                                    <input required type="date" value={newAction.incident_date} onChange={e => setNewAction({...newAction, incident_date: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Action Taken</label>
                                    <select value={newAction.action_taken} onChange={e => setNewAction({...newAction, action_taken: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                        <option>Verbal Warning</option>
                                        <option>Written Warning</option>
                                        <option>Suspension</option>
                                        <option>Dismissal</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Submit Report</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
