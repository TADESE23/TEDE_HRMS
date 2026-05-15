import { Target, TrendingUp, Plus, Loader2 } from "lucide-react";
import { PerformancePredictionWidget } from "../components/ai/PerformancePredictionWidget";
import { useState, useEffect } from "react";
import { performanceService } from "../services/performanceService";
import type { PerformanceGoal, Appraisal } from "../services/performanceService";

export default function Performance() {
    const [goals, setGoals] = useState<PerformanceGoal[]>([]);
    const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
    const [loading, setLoading] = useState(false);
    
    // Add goal state
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    
    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        setLoading(true);
        try {
            const [goalsData, appraisalsData] = await Promise.all([
                performanceService.getGoals(),
                performanceService.getAppraisals()
            ]);
            setGoals(goalsData);
            setAppraisals(appraisalsData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleAddGoal = async () => {
        if (!newTitle || !newDesc) return;
        try {
            await performanceService.addGoal({
                employee_id: 1, // Hardcoded for demo/admin
                title: newTitle,
                description: newDesc,
                target_date: new Date().toISOString().split('T')[0]
            });
            setNewTitle("");
            setNewDesc("");
            fetchData();
        } catch (error) {
            console.error("Failed to add goal", error);
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Manage Goals, KPIs, and Appraisals.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <PerformancePredictionWidget />
                </div>

                <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <Target className="w-6 h-6 text-primary-600" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Goals & KPIs</h2>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary-500" /></div>
                        ) : (
                            <div className="space-y-4">
                                {goals.map(goal => (
                                    <div key={goal.id} className="p-3 border rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-sm text-gray-900 dark:text-white">{goal.title}</h3>
                                                <p className="text-xs text-gray-500 mt-1">{goal.description}</p>
                                            </div>
                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                goal.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                goal.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                'bg-gray-200 text-gray-700'
                                            }`}>
                                                {goal.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                                    <input 
                                        type="text" 
                                        placeholder="Goal Title" 
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.target.value)}
                                        className="w-full text-sm p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Description" 
                                        value={newDesc}
                                        onChange={(e) => setNewDesc(e.target.value)}
                                        className="w-full text-sm p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <button onClick={handleAddGoal} className="w-full bg-primary-600 text-white p-2 rounded text-sm hover:bg-primary-700 flex items-center justify-center gap-1">
                                        <Plus className="w-4 h-4"/> Add Goal
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Appraisals</h2>
                        </div>
                        {loading ? (
                            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-primary-500" /></div>
                        ) : (
                            <div className="space-y-4">
                                {appraisals.length === 0 ? (
                                    <p className="text-sm text-gray-500">No active appraisals.</p>
                                ) : (
                                    appraisals.map(app => (
                                        <div key={app.id} className="p-3 border rounded border-gray-200 dark:border-gray-700">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-medium">{app.review_period}</span>
                                                <span className="text-xs font-bold text-primary-600">Score: {app.score}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">Reviewer: {app.rev_fn} {app.rev_ln}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                        <button className="w-full mt-4 px-4 py-2 text-sm bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100">
                            Start Appraisal Cycle
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
