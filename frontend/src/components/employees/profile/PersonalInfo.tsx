import { useRef } from "react";
import { Mail, Phone, MapPin, Globe, User, Camera } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

export function PersonalInfo() {
    const { user, updateProfilePhoto } = useAuth();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handlePhotoClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Mock upload: create a local object URL
            const imageUrl = URL.createObjectURL(file);
            updateProfilePhoto(imageUrl);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-6">
                <div className="flex flex-col items-center p-4 border border-gray-100 rounded-lg bg-gray-50">
                    <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
                        <div className="h-32 w-32 rounded-full flex items-center justify-center border-4 border-white shadow-sm overflow-hidden bg-primary-100 text-3xl font-bold text-primary-600 mb-4">
                            {user?.photoUrl ? (
                                <img src={user.photoUrl} alt={user.name} className="h-full w-full object-cover" />
                            ) : (
                                <span>{user?.name ? user.name.charAt(0) : "U"}</span>
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

                    <h3 className="text-lg font-bold text-gray-900">{user?.name || "Dr. Abebe Bikila"}</h3>
                    <p className="text-sm text-gray-500">Associate Professor</p>
                    <p className="text-xs text-gray-400 mt-1">UOG-COM-2019-042</p>
                </div>

                <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Contact Info</h4>
                    <div className="space-y-2">
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>abebe.bikila@uog.edu.et</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>+251 91 123 4567</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>Gondar, Ethiopia</span>
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
                            <span className="block text-xs font-medium text-gray-500 uppercase">Values</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">Ethiopian</p>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase">Date of Birth</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">12 September 1980</p>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase">Gender</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">Male</p>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase">Marital Status</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">Married</p>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Globe className="h-5 w-5 text-primary-600" />
                        Emergency Contact
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase">Name</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">Almaz Tadesse</p>
                        </div>
                        <div>
                            <span className="block text-xs font-medium text-gray-500 uppercase">Relationship</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">Spouse</p>
                        </div>
                        <div className="sm:col-span-2">
                            <span className="block text-xs font-medium text-gray-500 uppercase">Phone</span>
                            <p className="mt-1 text-sm font-medium text-gray-900">+251 91 198 7654</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
