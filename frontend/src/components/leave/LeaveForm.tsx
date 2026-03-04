import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Save, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useNavigate } from "react-router-dom";

const leaveSchema = z.object({
    type: z.string().min(1, "Leave type is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().min(1, "End date is required"),
    reason: z.string().min(5, "Reason must be at least 5 characters"),
}).refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
});

type LeaveFormData = z.infer<typeof leaveSchema>;

export function LeaveForm() {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LeaveFormData>({
        resolver: zodResolver(leaveSchema),
    });

    const onSubmit = async (data: LeaveFormData) => {
        // Simulate API call
        console.log("Submitting Leave:", data);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        navigate("/leave");
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-xl border border-gray-200 shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-700 pb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary-600" />
                            Request Leave
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Submit a new leave request for approval.
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Leave Type
                        </label>
                        <select
                            {...register("type")}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                        >
                            <option value="">Select Type</option>
                            <option value="Annual Leave">Annual Leave</option>
                            <option value="Sick Leave">Sick Leave</option>
                            <option value="Academic Conference">Academic Conference</option>
                            <option value="Research Leave">Research Leave</option>
                            <option value="Maternity/Paternity">Maternity/Paternity</option>
                        </select>
                        {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Start Date"
                            type="date"
                            {...register("startDate")}
                            error={errors.startDate?.message}
                            className="bg-white dark:bg-gray-900"
                        />
                        <Input
                            label="End Date"
                            type="date"
                            {...register("endDate")}
                            error={errors.endDate?.message}
                            className="bg-white dark:bg-gray-900"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Reason
                        </label>
                        <textarea
                            {...register("reason")}
                            rows={4}
                            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:text-white"
                            placeholder="Please provide details about your leave request..."
                        />
                        {errors.reason && <p className="text-sm text-red-500 mt-1">{errors.reason.message}</p>}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <Button type="button" variant="outline" onClick={() => navigate("/leave")}>
                        Cancel
                    </Button>
                    <Button type="submit" isLoading={isSubmitting} className="gap-2">
                        <Save className="h-4 w-4" />
                        Submit Request
                    </Button>
                </div>
            </form>
        </div>
    );
}
