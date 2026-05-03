import { Calendar, Briefcase, CheckCircle, Clock } from "lucide-react";
import { Badge } from "../../ui/Badge";

interface EmploymentInfoProps {
    employee: any;
}

export function EmploymentInfo({ employee }: EmploymentInfoProps) {
    const history = employee?.employment_history || [];

    const getStatusColor = (status: string) => {
        if (!status) return "default";
        const s = status.toLowerCase();
        if (s.includes('active')) return "success";
        if (s.includes('leave')) return "warning";
        if (s.includes('terminated') || s.includes('inactive')) return "error";
        return "default";
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Key Dates */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Date of Joining</p>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-lg font-semibold text-gray-900">
                            {employee?.date_of_joining ? new Date(employee.date_of_joining).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Employment Type</p>
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <span className="text-lg font-semibold text-gray-900">{employee?.employment_type || 'Permanent'}</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Current Status</p>
                    <Badge variant={getStatusColor(employee?.status)}>{employee?.status || 'Unknown'}</Badge>
                </div>
            </div>

            {/* Lifecycle Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Employment History
                </h3>

                {history.length === 0 ? (
                    <div className="text-gray-500 text-sm ml-3">No employment history recorded.</div>
                ) : (
                    <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                        {history.map((item: any, index: number) => (
                            <div key={item.id || index} className="ml-6 relative">
                                <span className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full ${index === 0 ? 'bg-green-500' : 'bg-gray-300'} ring-4 ring-white`}></span>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                                    <h4 className="text-base font-semibold text-gray-900">{item.event_type || 'Record'}</h4>
                                    <span className="text-sm text-gray-500">
                                        {item.event_date ? new Date(item.event_date).toLocaleDateString() : 'Unknown Date'}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{item.details}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contract Info (for contract staff logic) */}
            {employee?.employment_type === 'Contract' && (
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-semibold text-orange-900">Contract Employee</h4>
                        <p className="text-sm text-orange-700 mt-1">
                            This employee is on a contract. Please monitor renewal dates.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
