import { useRef } from "react";
import { Mail, Phone, MapPin, Globe, User, Camera } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { employeeService } from "../../../services/employeeService";

interface PersonalInfoProps {
    employee: any;
}

export function PersonalInfo({ employee }: PersonalInfoProps) {
    const { updateProfilePhoto } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && employee?.id) {
            try {
                const response = await employeeService.updateProfilePhoto(employee.id, file);
                // If it's the current user's profile, update the auth context as well
                if (user?.id === employee.user_id) {
                    updateProfilePhoto(response.photo_url);
                }
                // Refresh to show the new photo
                window.location.reload();
            } catch (error) {
                console.error("Failed to upload photo", error);
            }
        }
    };

    const getInitials = () => {
        return `${(employee?.first_name || '').charAt(0)}${(employee?.last_name || '').charAt(0)}`.toUpperCase();
    };

    const getDept = () => employee?.department_name || employee?.department || 'Unassigned';
    const getRole = () => employee?.role || employee?.staff_category || 'Unassigned';

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
                <div className="flex flex-col items-center p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                        <div className="h-32 w-32 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden bg-primary-100 text-3xl font-bold text-primary-600 mb-4">
                            {employee?.photo_url ? (
                                <img 
                                    src={`http://localhost:5000${employee.photo_url}`} 
                                    alt={employee.first_name} 
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span>{getInitials() || "U"}</span>
                            )}
                        </div>
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity mb-4">
                            <Camera className="h-8 w-8 text-white" />
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    </div>

                    <h3 className="text-lg font-bold text-gray-900">{`${employee?.first_name || ''} ${employee?.last_name || ''}`}</h3>
                    <p className="text-sm text-gray-500">{getRole()}</p>
                    <p className="text-xs text-gray-400 mt-1">{employee?.employee_id_number}</p>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Info</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{employee?.email || employee?.email_personal || 'No email provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{employee?.phone || 'No phone provided'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{employee?.address || 'Gondar, Ethiopia'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="md:col-span-2 space-y-8">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <User className="h-5 w-5 text-primary-600" />
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase">Department</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">{getDept()}</p>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase">Date of Birth</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">
                                {employee?.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : 'Not provided'}
                            </p>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase">Gender</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">{employee?.gender || 'Not specified'}</p>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase">TIN Number</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">{employee?.tin_number || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary-600" />
                        Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div className="sm:col-span-2 text-center text-gray-500 text-sm py-2">
                            Emergency contact information not available in current schema.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
