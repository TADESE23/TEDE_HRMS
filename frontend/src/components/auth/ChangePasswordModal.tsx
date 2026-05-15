import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X, Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useAuth } from "../../context/AuthContext";

const schema = z.object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const { changePassword } = useAuth();
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    if (!isOpen) return null;

    const onSubmit = async (data: FormData) => {
        try {
            setStatus('loading');
            await changePassword(data.currentPassword, data.newPassword);
            setStatus('success');
            setTimeout(() => {
                reset();
                onClose();
                setStatus('idle');
            }, 2000);
        } catch (err: any) {
            setStatus('error');
            setErrorMessage(err.message || "Failed to update password");
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700 animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between bg-primary-50/30 dark:bg-primary-900/10">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-lg">
                            <Lock className="h-5 w-5 text-primary-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Change Password</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-8">
                    {status === 'success' ? (
                        <div className="py-10 text-center animate-in zoom-in duration-300">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-10 w-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Password Updated!</h3>
                            <p className="text-gray-500">Your security settings have been updated successfully.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            {status === 'error' && (
                                <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-700 text-sm animate-in shake duration-300">
                                    <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />
                                    <p>{errorMessage}</p>
                                </div>
                            )}

                            <div>
                                <Input
                                    label="Current Password"
                                    type="password"
                                    {...register("currentPassword")}
                                    error={errors.currentPassword?.message}
                                    className="bg-gray-50/50"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="space-y-4 pt-2 border-t border-gray-100 dark:border-gray-700 mt-6">
                                <div>
                                    <Input
                                        label="New Password"
                                        type="password"
                                        {...register("newPassword")}
                                        error={errors.newPassword?.message}
                                        className="bg-gray-50/50"
                                        placeholder="Min 6 characters"
                                    />
                                </div>
                                <div>
                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        {...register("confirmPassword")}
                                        error={errors.confirmPassword?.message}
                                        className="bg-gray-50/50"
                                        placeholder="Repeat new password"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-6">
                                <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={status === 'loading'}>
                                    Cancel
                                </Button>
                                <Button type="submit" className="flex-1 gap-2" isLoading={status === 'loading'}>
                                    Update Password
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
