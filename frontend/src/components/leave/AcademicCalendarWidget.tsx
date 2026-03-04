import { Calendar, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function AcademicCalendarWidget() {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                {t('leave.calendarTitle')}
            </h3>
            <div className="space-y-4">
                <div className="flex gap-4 items-start">
                    <div className="w-12 text-center text-gray-500 dark:text-gray-400">
                        <span className="block text-xs font-bold uppercase">{t('leave.months.dec')}</span>
                        <span className="block text-xl font-bold">20</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('leave.semesterBreak')}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('leave.noClasses')}</p>
                    </div>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="w-12 text-center text-gray-500 dark:text-gray-400">
                        <span className="block text-xs font-bold uppercase">{t('leave.months.jan')}</span>
                        <span className="block text-xl font-bold">08</span>
                    </div>
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">{t('leave.classesResume')}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t('leave.springSemester')}</p>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex gap-3 text-sm text-blue-700 dark:text-blue-300">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>{t('leave.leaveNotice')}</p>
                </div>
            </div>
        </div>
    );
}
