import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter, Mail, Briefcase, Building2, User, Loader2, LayoutGrid, List as ListIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { employeeService } from "../../services/employeeService";

export function EmployeeList() {
    const { t } = useTranslation();
    const [employees, setEmployees] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            console.error("Failed to load employees", error);
        } finally {
            setLoading(false);
        }
    };

    const getDept = (emp: any) => emp.department_name || emp.department || 'Unassigned';
    const getRole = (emp: any) => emp.role || emp.staff_category || 'Unassigned';

    const filteredData = employees.filter(emp =>
        (`${emp.first_name || ''} ${emp.last_name || ''}`).toLowerCase().includes(searchTerm.toLowerCase()) ||
        getDept(emp).toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.employee_id_number || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        if (!status) return "bg-gray-100 text-gray-700 border-gray-200";
        const s = status.toLowerCase();
        if (s.includes('active')) return "bg-green-50 text-green-700 border-green-200";
        if (s.includes('leave')) return "bg-yellow-50 text-yellow-700 border-yellow-200";
        if (s.includes('terminated') || s.includes('inactive')) return "bg-red-50 text-red-700 border-red-200";
        return "bg-blue-50 text-blue-700 border-blue-200";
    };

    const getInitials = (first: string, last: string) => {
        return `${(first || '').charAt(0)}${(last || '').charAt(0)}`.toUpperCase();
    };

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, or department..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg transition-colors">
                        <Filter className="h-5 w-5" />
                    </button>
                    <div className="hidden sm:flex items-center bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-gray-700 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                        >
                            <ListIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
                <Link to="/employees/new" className="w-full sm:w-auto">
                    <button className="w-full flex justify-center items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors shadow-sm">
                        <Plus className="h-4 w-4" />
                        {t('employees.addEmployee')}
                    </button>
                </Link>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="h-10 w-10 text-primary-500 animate-spin mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">Loading directory...</p>
                </div>
            ) : filteredData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                    <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-full mb-4">
                        <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">No employees found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search filters.</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredData.map((emp) => (
                        <div key={emp.id} className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-xl hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-300">
                            <div className="h-24 bg-gradient-to-r from-primary-500/10 via-primary-500/5 to-transparent relative">
                                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(emp.status)}`}>
                                    {emp.status || 'Unknown'}
                                </span>
                            </div>
                            
                            <div className="px-6 pb-6 relative">
                                <div className="absolute -top-12 left-6">
                                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center text-2xl font-bold border-4 border-white dark:border-gray-800 shadow-md transform group-hover:scale-105 transition-transform">
                                        {getInitials(emp.first_name, emp.last_name)}
                                    </div>
                                </div>
                                
                                <div className="pt-10">
                                    <div className="mb-1">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-1">
                                            {emp.first_name} {emp.last_name}
                                        </h3>
                                        <p className="text-sm font-medium text-primary-600 dark:text-primary-400 flex items-center gap-1.5 mt-0.5 line-clamp-1">
                                            <Briefcase className="h-3.5 w-3.5 flex-shrink-0" />
                                            {getRole(emp)}
                                        </p>
                                    </div>

                                    <div className="mt-4 space-y-2.5">
                                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-md">
                                                <Building2 className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                            </div>
                                            <span className="truncate">{getDept(emp)}</span>
                                        </div>
                                        <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                                            <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-md">
                                                <User className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                            </div>
                                            <span>ID: {emp.employee_id_number}</span>
                                        </div>
                                        {emp.email && (
                                            <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300">
                                                <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-md">
                                                    <Mail className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                                                </div>
                                                <span className="truncate">{emp.email}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <Link to={`/employees/${emp.id}`} className="block w-full text-center py-2 text-sm font-medium text-gray-700 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 bg-gray-50 hover:bg-primary-50 dark:bg-gray-700/50 dark:hover:bg-primary-900/20 rounded-lg transition-colors">
                                            View Full Profile
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                            <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-900 dark:text-white font-semibold border-b border-gray-200 dark:border-gray-700">
                                <tr>
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">ID Number</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredData.map((emp) => (
                                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                                    {getInitials(emp.first_name, emp.last_name)}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">{emp.first_name} {emp.last_name}</div>
                                                    <div className="text-xs text-gray-500">{emp.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium">{emp.employee_id_number}</td>
                                        <td className="px-6 py-4">{getDept(emp)}</td>
                                        <td className="px-6 py-4">{getRole(emp)}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(emp.status)}`}>
                                                {emp.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link to={`/employees/${emp.id}`} className="text-primary-600 hover:text-primary-700 font-medium">
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
