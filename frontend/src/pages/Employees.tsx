import { EmployeeList } from "../components/employees/EmployeeList";
import { useTranslation } from "react-i18next";

export default function Employees() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('employees.title')}</h1>
                <p className="text-gray-500">{t('employees.subtitle')}</p>
            </div>
            <EmployeeList />
        </div>
    );
}
