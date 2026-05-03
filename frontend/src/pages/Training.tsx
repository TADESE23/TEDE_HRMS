import { GraduationCap, BookOpen, Plus, Calendar, X, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { trainingService } from "../services/trainingService";

interface TrainingDevelopment {
    id: number;
    employee_id: number;
    first_name?: string;
    last_name?: string;
    training_title: string;
    institution: string;
    start_date: string;
    end_date: string;
    status: string;
    cost: number;
}

export default function Training() {
    const [trainings, setTrainings] = useState<TrainingDevelopment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form state
    const [newTraining, setNewTraining] = useState({
        employee_id: 1, // Defaulting to 1 for demo purposes since we don't have a user selector here yet
        training_title: '',
        institution: '',
        start_date: '',
        end_date: '',
        status: 'Proposed',
        cost: 0
    });

    useEffect(() => {
        loadTrainings();
    }, []);

    const loadTrainings = async () => {
        try {
            setLoading(true);
            const data = await trainingService.getTrainings();
            setTrainings(data);
        } catch (error) {
            console.error("Failed to load trainings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTraining = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await trainingService.addTraining(newTraining);
            setShowModal(false);
            setNewTraining({
                employee_id: 1,
                training_title: '',
                institution: '',
                start_date: '',
                end_date: '',
                status: 'Proposed',
                cost: 0
            });
            loadTrainings(); // Refresh list
        } catch (error) {
            console.error("Failed to add training:", error);
            alert("Failed to add training program");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Training & Development</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage training programs, scholarships, and professional development.
                    </p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                    <Plus className="w-4 h-4" /> Add Program
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">All Training & Study Leave Programs</h2>
                </div>
                
                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
                ) : trainings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No training programs found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {trainings.map(t => (
                            <div key={t.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600 flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1" title={t.training_title}>{t.training_title}</h3>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap ml-2 ${
                                            t.status === 'Ongoing' ? 'bg-green-100 text-green-700' :
                                            t.status === 'Completed' ? 'bg-gray-200 text-gray-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {t.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-indigo-600 font-medium mb-3 flex items-center gap-1">
                                        <GraduationCap className="w-4 h-4"/> {t.institution}
                                    </p>
                                    
                                    <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-1">
                                            <span className="font-medium text-gray-900 dark:text-gray-300">Staff:</span> {t.first_name} {t.last_name} (ID: {t.employee_id})
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3.5 h-3.5"/> 
                                            {new Date(t.start_date).toLocaleDateString()} - {new Date(t.end_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600 text-xs text-right font-medium text-gray-900 dark:text-gray-300">
                                    Cost: ${Number(t.cost).toFixed(2)}
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
                            <h2 className="font-semibold text-lg text-gray-900 dark:text-white">Add Training Program</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700"><X className="w-5 h-5"/></button>
                        </div>
                        <form onSubmit={handleAddTraining} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Employee ID</label>
                                <input required type="number" value={newTraining.employee_id} onChange={e => setNewTraining({...newTraining, employee_id: Number(e.target.value)})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Training Title</label>
                                <input required type="text" value={newTraining.training_title} onChange={e => setNewTraining({...newTraining, training_title: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Institution</label>
                                <input required type="text" value={newTraining.institution} onChange={e => setNewTraining({...newTraining, institution: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Start Date</label>
                                    <input required type="date" value={newTraining.start_date} onChange={e => setNewTraining({...newTraining, start_date: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">End Date</label>
                                    <input required type="date" value={newTraining.end_date} onChange={e => setNewTraining({...newTraining, end_date: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Status</label>
                                    <select value={newTraining.status} onChange={e => setNewTraining({...newTraining, status: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600">
                                        <option>Proposed</option>
                                        <option>Ongoing</option>
                                        <option>Completed</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Cost</label>
                                    <input required type="number" min="0" step="0.01" value={newTraining.cost} onChange={e => setNewTraining({...newTraining, cost: Number(e.target.value)})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700">Save Program</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
