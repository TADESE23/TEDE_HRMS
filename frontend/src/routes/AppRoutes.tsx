import { Routes, Route } from "react-router-dom";
import { AppLayout } from "../components/layout/AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import Dashboard from "../pages/Dashboard";
import Employees from "../pages/Employees";
import Leave from "../pages/Leave";
import { LeaveForm } from "../components/leave/LeaveForm";
import Recruitment from "../pages/Recruitment";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import EmployeeProfile from "../pages/EmployeeProfile";
import EmployeeFormPage from "../pages/EmployeeFormPage";
import Attendance from "../pages/Attendance";
import Performance from "../pages/Performance";
import Payroll from "../pages/Payroll";
import Documents from "../pages/Documents";
import Training from "../pages/Training";
import Disciplinary from "../pages/Disciplinary";
import Separation from "../pages/Separation";
import Academic from "../pages/Academic";
import Housing from "../pages/Housing";

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/employees/new" element={<EmployeeFormPage />} />
                    <Route path="/employees/:id/edit" element={<EmployeeFormPage />} />
                    <Route path="/employees/:id" element={<EmployeeProfile />} />
                    <Route path="/leave" element={<Leave />} />
                    <Route path="/leave/new" element={<LeaveForm />} />
                    <Route path="/recruitment" element={<Recruitment />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/performance" element={<Performance />} />
                    <Route path="/payroll" element={<Payroll />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/disciplinary" element={<Disciplinary />} />
                    <Route path="/separation" element={<Separation />} />
                    <Route path="/academic" element={<Academic />} />
                    <Route path="/housing" element={<Housing />} />
                </Route>
            </Route>
        </Routes>
    );
}
