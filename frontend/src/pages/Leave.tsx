import { Button } from "../components/ui/Button";
import { Plus } from "lucide-react";
import { AcademicCalendarWidget } from "../components/leave/AcademicCalendarWidget";
import { LeaveList } from "../components/leave/LeaveList";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Leave() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('leave.title')}</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">{t('leave.subtitle')}</p>
                </div>
                <Link to="/leave/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t('leave.requestLeave')}
                    </Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LeaveList />
                </div>
                <div>
                    <AcademicCalendarWidget />
                </div>
            </div>
        </div>
    );
}
