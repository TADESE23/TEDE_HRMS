import { Badge } from "../ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { useTranslation } from "react-i18next";

const MOCK_LEAVE_REQUESTS = [
    { id: 1, type: "Annual Leave", start: "2024-12-24", end: "2024-12-28", days: 5, status: "Approved", reason: "Family vacation" },
    { id: 2, type: "Sick Leave", start: "2024-11-10", end: "2024-11-12", days: 3, status: "Approved", reason: "Flu" },
    { id: 3, type: "Academic Conference", start: "2025-01-15", end: "2025-01-20", days: 6, status: "Pending", reason: "AI Conference in Addis Ababa" },
];

export function LeaveList() {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('leave.historyTitle')}</h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t('leave.type')}</TableHead>
                        <TableHead>{t('leave.dates')}</TableHead>
                        <TableHead>{t('leave.days')}</TableHead>
                        <TableHead>{t('leave.reason')}</TableHead>
                        <TableHead>{t('leave.status')}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {MOCK_LEAVE_REQUESTS.map((request) => (
                        <TableRow key={request.id}>
                            <TableCell className="font-medium">{request.type}</TableCell>
                            <TableCell>
                                {request.start} <span className="text-gray-400 mx-1">{t('leave.to')}</span> {request.end}
                            </TableCell>
                            <TableCell>{request.days}</TableCell>
                            <TableCell className="max-w-xs truncate" title={request.reason}>{request.reason}</TableCell>
                            <TableCell>
                                <Badge variant={
                                    request.status === "Approved" ? "success" :
                                        request.status === "Pending" ? "warning" : "error"
                                }>
                                    {request.status}
                                </Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
