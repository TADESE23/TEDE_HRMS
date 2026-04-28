import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";const vacancySchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    department: z.string().min(2, "Department is required"),
    type: z.enum(["Full Time", "Part Time", "Contract", "Temporary"]),
    status: z.enum(["Draft", "Published", "Internal"]),
    closing_date: z.string().min(1, "Closing date is required"),
    responsible_role: z.string().min(2, "Responsible role is required"),
    description: z.string().optional(),
    requirements: z.string().optional()
});

type VacancyFormData = z.infer<typeof vacancySchema>;

interface VacancyFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: VacancyFormData) => void;
    isSubmitting: boolean;
}

export function VacancyForm({ isOpen, onClose, onSubmit, isSubmitting }: VacancyFormProps) {
    const { t } = useTranslation();
    const { register, handleSubmit, formState: { errors }, reset } = useForm<VacancyFormData>({
        resolver: zodResolver(vacancySchema),
        defaultValues: {
            type: "Full Time",
            status: "Draft",
            closing_date: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0], // Default 1 month from now
            responsible_role: "HR Recruitment Officer"
        }
    });

    if (!isOpen) return null;

    const handleFormSubmit = (data: VacancyFormData) => {
        onSubmit(data);
        reset();
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex py-10 justify-center overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-2xl my-auto">
                <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('vacancyForm.postNew')}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vacancyForm.jobTitle')}</label>
                            <input
                                {...register('title')}
                                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder={t('vacancyForm.titlePlaceholder')}
                            />
                            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vacancyForm.department')}</label>
                                <input
                                    {...register('department')}
                                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${errors.department ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                    placeholder={t('vacancyForm.deptPlaceholder')}
                                />
                                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vacancyForm.employmentType')}</label>
                                <select
                                    {...register('type')}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                >
                                    <option value="Full Time">{t('vacancyForm.fullTime')}</option>
                                    <option value="Part Time">{t('vacancyForm.partTime')}</option>
                                    <option value="Contract">{t('vacancyForm.contract')}</option>
                                    <option value="Temporary">{t('vacancyForm.temporary')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vacancyForm.status')}</label>
                                <select
                                    {...register('status')}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                >
                                    <option value="Draft">{t('vacancyForm.draft')}</option>
                                    <option value="Published">{t('vacancyForm.published')}</option>
                                    <option value="Internal">{t('vacancyForm.internalOnly')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vacancyForm.closingDate')}</label>
                                <input
                                    type="date"
                                    {...register('closing_date')}
                                    className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${errors.closing_date ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                />
                                {errors.closing_date && <p className="text-red-500 text-sm mt-1">{errors.closing_date.message}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vacancyForm.responsibleRole')}</label>
                            <input
                                {...register('responsible_role')}
                                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white ${errors.responsible_role ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                                placeholder={t('vacancyForm.rolePlaceholder')}
                            />
                            {errors.responsible_role && <p className="text-red-500 text-sm mt-1">{errors.responsible_role.message}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vacancyForm.description')}</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                placeholder={t('vacancyForm.descPlaceholder')}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t('vacancyForm.requirements')}</label>
                            <textarea
                                {...register('requirements')}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                placeholder={t('vacancyForm.reqPlaceholder')}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            {t('vacancyForm.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                        >
                            {isSubmitting ? t('vacancyForm.posting') : t('vacancyForm.postVacancy')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
