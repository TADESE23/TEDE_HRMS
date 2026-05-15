import { useState, useEffect } from "react";
import { Building2, Users, FileText, Briefcase, Network, Plus, Loader2 } from "lucide-react";
import { cn } from "../utils/cn";
import { settingsService } from "../services/settingsService";
import type { College, Job } from "../services/settingsService";

export default function Settings() {
    const [activeTab, setActiveTab] = useState("organization");
    const [colleges, setColleges] = useState<College[]>([]);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(false);
    
    const [newCollegeName, setNewCollegeName] = useState("");
    const [newDeanName, setNewDeanName] = useState("");
    
    useEffect(() => {
        if (activeTab === "structure") fetchStructure();
        if (activeTab === "jobs") fetchJobs();
    }, [activeTab]);
    
    const fetchStructure = async () => {
        setLoading(true);
        try {
            const data = await settingsService.getStructure();
            setColleges(data);
        } catch (error) {
            console.error("Failed to load structure", error);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchJobs = async () => {
        setLoading(true);
        try {
            const data = await settingsService.getJobs();
            setJobs(data);
        } catch (error) {
            console.error("Failed to load jobs", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleAddCollege = async () => {
        if (!newCollegeName) return;
        try {
            await settingsService.addCollege({ name: newCollegeName, dean_name: newDeanName });
            setNewCollegeName("");
            setNewDeanName("");
            fetchStructure();
        } catch (error) {
            console.error("Failed to add college", error);
        }
    };

    const tabs = [
        { id: "organization", label: "Organization", icon: Building2 },
        { id: "structure", label: "Structure", icon: Network },
        { id: "jobs", label: "Jobs & Grades", icon: Briefcase },
        { id: "users", label: "Users & Roles", icon: Users },
        { id: "policies", label: "Policies", icon: FileText },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage university configuration, users, and policies.
                </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2",
                                activeTab === tab.id
                                    ? "border-primary-500 text-primary-600 dark:text-primary-400"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
                {activeTab === "organization" && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Organization Info</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">University Name</label>
                                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm" defaultValue="University of Gondar" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Campus Name</label>
                                <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm" defaultValue="Tede Campus" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                <textarea rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm" />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700">Save Changes</button>
                        </div>
                    </div>
                )}

                {activeTab === "structure" && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Colleges & Schools</h2>
                            <div className="space-y-2">
                                {loading ? (
                                    <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
                                ) : (
                                    colleges.map(college => (
                                        <div key={college.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 flex justify-between">
                                            <div>
                                                <span className="font-medium">{college.name}</span>
                                                {college.dean_name && <span className="text-xs text-gray-500 block">Dean: {college.dean_name}</span>}
                                            </div>
                                            <button className="text-primary-600 text-sm">Edit</button>
                                        </div>
                                    ))
                                )}
                                <div className="mt-4 flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="College Name" 
                                        value={newCollegeName}
                                        onChange={(e) => setNewCollegeName(e.target.value)}
                                        className="text-sm p-2 border rounded flex-1 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <input 
                                        type="text" 
                                        placeholder="Dean Name" 
                                        value={newDeanName}
                                        onChange={(e) => setNewDeanName(e.target.value)}
                                        className="text-sm p-2 border rounded flex-1 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    <button onClick={handleAddCollege} className="bg-primary-600 text-white p-2 rounded text-sm hover:bg-primary-700 flex items-center gap-1">
                                        <Plus className="w-4 h-4"/> Add
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Departments</h2>
                            {loading ? (
                                 <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-primary-500" /></div>
                            ) : (
                                <div className="space-y-4">
                                    {colleges.map(college => (
                                        <div key={college.id}>
                                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{college.name}</h3>
                                            <div className="space-y-2 pl-4 border-l-2 border-gray-100 dark:border-gray-700">
                                                {college.departments && college.departments.length > 0 ? college.departments.map(dept => (
                                                    <div key={dept.id} className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                                                        {dept.name} <span className="text-xs text-gray-400">({dept.head_of_department || 'No Head'})</span>
                                                    </div>
                                                )) : <p className="text-xs text-gray-400 italic">No departments</p>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <button className="mt-4 text-primary-600 text-sm font-medium">+ Add Department</button>
                        </div>
                    </div>
                )}

                {activeTab === "jobs" && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Job Configuration</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Job Titles</h3>
                                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                    {loading ? (
                                         <Loader2 className="w-5 h-5 animate-spin text-primary-500 mx-auto" />
                                    ) : (
                                        jobs.map(job => (
                                            <li key={job.id} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-2 rounded">
                                                <span>{job.grade_name}</span>
                                                <span className="text-xs font-semibold text-green-600">{job.base_salary} {job.currency}</span>
                                            </li>
                                        ))
                                    )}
                                    <li><button className="text-primary-600 font-medium mt-2">+ Add Grade</button></li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Employment Categories</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Academic</span>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Administrative</span>
                                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">Technical</span>
                                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Contract</span>
                                    <button className="px-2 py-1 border border-dashed border-gray-300 rounded text-xs text-gray-500">+ Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "users" && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">User Management</h2>
                            <button className="bg-primary-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-primary-700">Add User</button>
                        </div>
                        <p className="text-sm text-gray-500">Manage system users, role-based permissions, and view audit logs.</p>
                        {/* User Table Placeholder */}
                    </div>
                )}

                {activeTab === "policies" && (
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">HR Policies</h2>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-12 text-center">
                            <FileText className="mx-auto h-12 w-12 text-gray-400" />
                            <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-white">
                                Upload Policy PDF
                            </span>
                            <span className="mt-1 block text-sm text-gray-500">
                                Leave Rules, Overtime Guidelines, Attendance Policy
                            </span>
                            <button className="mt-4 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600/50 rounded-md px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                                Select File
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
