import { Badge } from "../ui/Badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { Loader2, Check, X } from "lucide-react";
import { leaveService } from "../../services/leaveService";
import type { LeaveRecord } from "../../services/leaveService";

export function LeaveList() {
    const { t } = useTranslation();
    const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadLeaves();
    }, []);

    const loadLeaves = async () => {
        setLoading(true);
        try {
            const data = await leaveService.getAllLeaves();
            setLeaves(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id: number, status: string) => {
        try {
            await leaveService.updateLeaveStatus(id, status);
            loadLeaves();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('leave.historyTitle')}</h3>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>{t('leave.type')}</TableHead>
                        <TableHead>{t('leave.dates')}</TableHead>
                        <TableHead>{t('leave.reason')}</TableHead>
                        <TableHead>{t('leave.status')}</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {loading ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8">
                                <Loader2 className="animate-spin text-primary-500 mx-auto" />
                            </TableCell>
                        </TableRow>
                    ) : leaves.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                No leave requests found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        leaves.map((request) => (
                            <TableRow key={request.id}>
                                <TableCell className="font-medium">
                                    {request.first_name} {request.last_name}
                                </TableCell>
                                <TableCell>{request.leave_type}</TableCell>
                                <TableCell>
                                    {new Date(request.start_date).toLocaleDateString()} <span className="text-gray-400 mx-1">{t('leave.to')}</span> {new Date(request.end_date).toLocaleDateString()}
                                </TableCell>
                                <TableCell className="max-w-xs truncate" title={request.reason}>{request.reason}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        request.status === "Approved" ? "success" :
                                            request.status.includes("Pending") ? "warning" : "error"
                                    }>
                                        {request.status.replace('_', ' ')}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    {request.status.includes("Pending") && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleUpdateStatus(request.id, 'Approved')}
                                                className="text-green-600 hover:text-green-800 p-1"
                                                title="Approve"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                            <button 
                                                onClick={() => handleUpdateStatus(request.id, 'Rejected')}
                                                className="text-red-600 hover:text-red-800 p-1"
                                                title="Reject"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
