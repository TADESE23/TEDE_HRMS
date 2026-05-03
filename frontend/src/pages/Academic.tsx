import { BookOpen, School, Plus, X, Award, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { academicService } from "../services/academicService";

interface AcademicProfile {
    id: number;
    employee_id: number;
    first_name?: string;
    last_name?: string;
    highest_degree: string;
    academic_rank: string;
    specialization: string;
    total_publications: number;
    community_service_hours: number;
    rank: string;
}

export default function Academic() {
    const [profiles, setProfiles] = useState<AcademicProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const [newProfile, setNewProfile] = useState({
        employee_id: 1, // Defaulting to 1 for demo purposes
        highest_degree: 'PhD',
        academic_rank: 'Assistant Professor',
        specialization: '',
        total_publications: 0,
        community_service_hours: 0,
        rank: 'A'
    });

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        try {
            setLoading(true);
            const data = await academicService.getProfiles();
            setProfiles(data);
        } catch (error) {
            console.error("Failed to load academic profiles:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await academicService.addProfile(newProfile);
            setShowModal(false);
            setNewProfile({
                employee_id: 1,
                highest_degree: 'PhD',
                academic_rank: 'Assistant Professor',
                specialization: '',
                total_publications: 0,
                community_service_hours: 0,
                rank: 'A'
            });
            loadProfiles();
        } catch (error) {
            console.error("Failed to add profile:", error);
            alert("Failed to add academic profile");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage academic profiles, degrees, and publications.
                    </p>
                </div>
                <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                    <Plus className="w-4 h-4" /> Add Profile
                </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-primary-50 dark:bg-primary-900/20 text-primary-600 rounded-lg">
                        <School className="w-6 h-6" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Staff Academic Profiles</h2>
                </div>

                {loading ? (
                    <div className="flex justify-center py-10"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>
                ) : profiles.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No academic profiles found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {profiles.map(p => (
                            <div key={p.id} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white">{p.first_name} {p.last_name}</h3>
                                        <p className="text-sm text-primary-600 font-medium">{p.academic_rank}</p>
                                    </div>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium flex items-center gap-1">
                                        <Award className="w-3 h-3"/> {p.highest_degree}
                                    </span>
                                </div>
                                <div className="mt-3 space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                                    <div className="flex items-center gap-1">
                                        <span className="font-medium text-gray-900 dark:text-gray-300">Spec:</span> {p.specialization}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span><span className="font-medium text-gray-900 dark:text-gray-300">Pubs:</span> {p.total_publications}</span>
                                        <span><span className="font-medium text-gray-900 dark:text-gray-300">Community Hrs:</span> {p.community_service_hours}</span>
                                    </div>
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
                            <h2 className="font-semibold text-lg">Add Academic Profile</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500"><X className="w-5 h-5"/></button>
                        </div>
                        <form onSubmit={handleAddProfile} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Employee ID</label>
                                <input required type="number" value={newProfile.employee_id} onChange={e => setNewProfile({...newProfile, employee_id: Number(e.target.value)})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Highest Degree</label>
                                    <input required type="text" value={newProfile.highest_degree} onChange={e => setNewProfile({...newProfile, highest_degree: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. PhD, MSc" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Academic Rank</label>
                                    <input required type="text" value={newProfile.academic_rank} onChange={e => setNewProfile({...newProfile, academic_rank: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. Professor" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Specialization</label>
                                <input required type="text" value={newProfile.specialization} onChange={e => setNewProfile({...newProfile, specialization: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Total Publications</label>
                                    <input required type="number" min="0" value={newProfile.total_publications} onChange={e => setNewProfile({...newProfile, total_publications: Number(e.target.value)})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Community Svc (Hrs)</label>
                                    <input required type="number" min="0" value={newProfile.community_service_hours} onChange={e => setNewProfile({...newProfile, community_service_hours: Number(e.target.value)})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Rank Category</label>
                                <input type="text" value={newProfile.rank} onChange={e => setNewProfile({...newProfile, rank: e.target.value})} className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600" placeholder="e.g. A, B, C" />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg">Save Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
