import { Calendar, Briefcase, CheckCircle, Clock } from "lucide-react";
import { Badge } from "../../ui/Badge";

export function EmploymentInfo() {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Key Dates */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Date of Joining</p>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-gray-400" />
                        <span className="text-lg font-semibold text-gray-900">Sept 12, 2018</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Employment Type</p>
                    <div className="flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-gray-400" />
                        <span className="text-lg font-semibold text-gray-900">Permanent</span>
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                    <p className="text-sm font-medium text-gray-500 mb-1">Current Status</p>
                    <Badge variant="success">Active</Badge>
                </div>
            </div>

            {/* Lifecycle Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-600" />
                    Employment History
                </h3>

                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                    <div className="ml-6 relative">
                        <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-green-500 ring-4 ring-white"></span>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                            <h4 className="text-base font-semibold text-gray-900">Promoted to Associate Professor</h4>
                            <span className="text-sm text-gray-500">Sept 2022</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Approved by University Senate. Pay Grade increased to Ac-9.</p>
                    </div>

                    <div className="ml-6 relative">
                        <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-blue-500 ring-4 ring-white"></span>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                            <h4 className="text-base font-semibold text-gray-900">Transfer to Tede Campus</h4>
                            <span className="text-sm text-gray-500">Jan 2020</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Transferred from Maraki Campus. Department of Computer Science.</p>
                    </div>

                    <div className="ml-6 relative">
                        <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-gray-300 ring-4 ring-white"></span>
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline">
                            <h4 className="text-base font-semibold text-gray-900">Hired as Assistant Professor</h4>
                            <span className="text-sm text-gray-500">Sept 2018</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">Initial appointment. Probation period verified.</p>
                    </div>
                </div>
            </div>

            {/* Contract Info (for contract staff logic) */}
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                    <h4 className="text-sm font-semibold text-orange-900">Contract Renewal</h4>
                    <p className="text-sm text-orange-700 mt-1">
                        This employee is Permanent. No contract renewal actions required.
                    </p>
                </div>
            </div>
        </div>
    );
}
