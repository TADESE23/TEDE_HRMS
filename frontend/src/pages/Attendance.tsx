import { Clock, Users, CalendarDays, Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { attendanceService } from "../services/attendanceService";
import type { AttendanceRecord, AttendanceStats } from "../services/attendanceService";

export default function Attendance() {
    const [records, setRecords] = useState<AttendanceRecord[]>([]);
    const [stats, setStats] = useState<AttendanceStats | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [recordsData, statsData] = await Promise.all([
                attendanceService.getAttendance(selectedDate),
                attendanceService.getStats()
            ]);
            setRecords(recordsData);
            setStats(statsData);
        } catch (error) {
            console.error("Failed to load attendance", error);
        } finally {
            setLoading(false);
        }
    };
    
    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Present': return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'Absent': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'Late': return <AlertCircle className="w-4 h-4 text-amber-500" />;
            default: return <Clock className="w-4 h-4 text-blue-500" />;
        }
    };
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Management</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Track daily attendance, overtime, and timesheets.
                    </p>
                </div>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                    Export Report
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Today's Attendance</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats ? stats.todayRate : "..."}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Present / Total</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {stats ? `${stats.present} / ${stats.total}` : "..."}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Pending Leave Requests</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
                        </div>
                    </div>
                </div>
                {/* Add more widgets as per requirements */}
            </div>

            {/* Attendance Sections */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Attendance Tracking</h2>
                    <input 
                        type="date" 
                        value={selectedDate} 
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="text-sm border border-gray-300 rounded p-1.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                            <tr>
                                <th className="px-6 py-3">Employee</th>
                                <th className="px-6 py-3">Department</th>
                                <th className="px-6 py-3">Check In</th>
                                <th className="px-6 py-3">Check Out</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-primary-500 mx-auto" />
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-500">
                                        No attendance records for this date.
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr key={record.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                                            {record.first_name} {record.last_name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{record.department || 'N/A'}</td>
                                        <td className="px-6 py-4">{record.check_in_time || '--:--'}</td>
                                        <td className="px-6 py-4">{record.check_out_time || '--:--'}</td>
                                        <td className="px-6 py-4">
                                            <span className="flex items-center gap-1.5">
                                                {getStatusIcon(record.status)}
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button className="text-primary-600 hover:underline">Edit</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Overtime Requests</h2>
                <p className="text-gray-500 text-sm">Overtime workflow and approvals coming soon.</p>
            </div>
        </div>
    );
}
