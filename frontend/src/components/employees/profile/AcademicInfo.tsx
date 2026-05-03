import { GraduationCap, BookOpen, Award, Layers } from "lucide-react";
import { Badge } from "../../ui/Badge";

interface AcademicInfoProps {
    employee: any;
}

export function AcademicInfo({ employee }: AcademicInfoProps) {
    const ac = employee?.academic_profile || {};
    const getDept = () => employee?.department_name || employee?.department || 'Unassigned';

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <GraduationCap className="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-blue-900">Current Rank</h4>
                    </div>
                    <p className="text-2xl font-bold text-blue-900">{ac.rank || ac.academic_rank || 'N/A'}</p>
                    <p className="text-xs text-blue-600 mt-1">Verified Academic Status</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-purple-900">Department</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-900 line-clamp-1">{getDept()}</p>
                    <p className="text-xs text-purple-600 mt-1">Primary Affiliation</p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-green-900">Specialization</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-900 line-clamp-1">{ac.specialization || 'Not Specified'}</p>
                    <p className="text-xs text-green-600 mt-1">{ac.highest_degree || 'Unknown Degree'}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary-600" />
                        Research & Publications
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Recent Publications</span>
                            <Badge variant="info">Total: {ac.total_publications || 0}</Badge>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {ac.total_publications > 0 ? (
                                <div className="p-4">
                                    <p className="text-sm text-gray-600">Publications are logged in the research registry. Total reported: {ac.total_publications}.</p>
                                </div>
                            ) : (
                                <div className="p-4">
                                    <p className="text-sm text-gray-500">No publications recorded.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary-600" />
                        Teaching Load (Current Semester)
                    </h3>
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-700">Courses</span>
                            <Badge variant="warning">Pending Sync</Badge>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="p-4">
                                <p className="text-sm text-gray-500">Course loads are fetched from the Academic Registry.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
