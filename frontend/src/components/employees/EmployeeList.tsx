import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Filter } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { Badge } from "../ui/Badge";
import { useTranslation } from "react-i18next";

const MOCK_DATA = [
    { id: 1, name: "Abebe Bikila", idNumber: "UOG-001", department: "Computer Science", role: "Lecturer", status: "Active" },
    { id: 2, name: "Kebede Michael", idNumber: "UOG-002", department: "Engineering", role: "Associate Professor", status: "On Leave" },
    { id: 3, name: "Almaz Ayana", idNumber: "UOG-003", department: "Human Resources", role: "HR Officer", status: "Active" },
];

export function EmployeeList() {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState("");

    const filteredData = MOCK_DATA.filter(emp =>
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={t('employees.searchPlaceholder')}
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="md" className="gap-2">
                        <Filter className="h-4 w-4" />
                        {t('employees.filter')}
                    </Button>
                </div>
                <Link to="/employees/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" />
                        {t('employees.addEmployee')}
                    </Button>
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden transition-colors duration-200">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>{t('employees.employeeId')}</TableHead>
                            <TableHead>{t('employees.name')}</TableHead>
                            <TableHead>{t('employees.department')}</TableHead>
                            <TableHead>{t('employees.role')}</TableHead>
                            <TableHead>{t('employees.status')}</TableHead>
                            <TableHead className="text-right">{t('employees.actions')}</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredData.map((employee) => (
                            <TableRow key={employee.id}>
                                <TableCell className="font-medium">{employee.idNumber}</TableCell>
                                <TableCell>{employee.name}</TableCell>
                                <TableCell>{employee.department}</TableCell>
                                <TableCell>{employee.role}</TableCell>
                                <TableCell>
                                    <Badge variant={employee.status === "Active" ? "success" : "warning"}>
                                        {employee.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Link to={`/employees/${employee.id}`}>
                                        <Button variant="ghost" size="sm">{t('employees.view')}</Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
