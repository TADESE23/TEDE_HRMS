import { GraduationCap, BookOpen, Award, Layers } from "lucide-react";
import { Badge } from "../../ui/Badge";

export function AcademicInfo() {
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
                    <p className="text-2xl font-bold text-blue-900">Associate Professor</p>
                    <p className="text-xs text-blue-600 mt-1">Since Sept 2022</p>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <BookOpen className="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-purple-900">Department</h4>
                    </div>
                    <p className="text-2xl font-bold text-purple-900">Computer Science</p>
                    <p className="text-xs text-purple-600 mt-1">Faculty of Informatics</p>
                </div>

                <div className="bg-green-50 p-6 rounded-xl border border-green-100">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Award className="h-5 w-5 text-green-600" />
                        </div>
                        <h4 className="text-sm font-semibold text-green-900">Specialization</h4>
                    </div>
                    <p className="text-2xl font-bold text-green-900">AI & Machine Learning</p>
                    <p className="text-xs text-green-600 mt-1">PhD from Addis Ababa University</p>
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
                            <Badge variant="info">Total: 12</Badge>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 hover:bg-gray-50 transition-colors">
                                <p className="text-sm font-medium text-primary-600 line-clamp-1">
                                    "Deep Learning Applications in Agriculture: A Case Study of Ethiopian Crop Diseases"
                                </p>
                                <p className="text-xs text-gray-500 mt-1">IEEE Access • 2024</p>
                            </div>
                            <div className="p-4 hover:bg-gray-50 transition-colors">
                                <p className="text-sm font-medium text-primary-600 line-clamp-1">
                                    "Optimizing Network Traffic in Rural Campus Environments"
                                </p>
                                <p className="text-xs text-gray-500 mt-1">African Journal of Computing • 2023</p>
                            </div>
                            <div className="p-4 hover:bg-gray-50 transition-colors">
                                <p className="text-sm font-medium text-primary-600 line-clamp-1">
                                    "Ethical AI Frameworks for Developing Nations"
                                </p>
                                <p className="text-xs text-gray-500 mt-1">Conference on AI Ethics • 2023</p>
                            </div>
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
                            <Badge variant="warning">12 Credit Hours</Badge>
                        </div>
                        <div className="divide-y divide-gray-100">
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Introduction to AI</p>
                                    <p className="text-xs text-gray-500">CS-301 • Year 3</p>
                                </div>
                                <Badge variant="default">4 Credits</Badge>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Advanced Algorithms</p>
                                    <p className="text-xs text-gray-500">CS-402 • Year 4</p>
                                </div>
                                <Badge variant="default">4 Credits</Badge>
                            </div>
                            <div className="p-4 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">MSc Thesis Supervision</p>
                                    <p className="text-xs text-gray-500">Postgraduate</p>
                                </div>
                                <Badge variant="default">4 Credits</Badge>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
