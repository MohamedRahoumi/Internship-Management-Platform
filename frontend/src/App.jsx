import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Welcome from './pages/auth/Welcome';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminDepartments from './pages/admin/Departments';
import AdminAuditLogs from './pages/admin/AuditLogs';
import RhDashboard from './pages/rh/Dashboard';
import RhApplications from './pages/rh/Applications';
import RhInterns from './pages/rh/Interns';
import RhCertificates from './pages/rh/Certificates';

import SupervisorDashboard from './pages/supervisor/Dashboard';
import SupervisorInterns from './pages/supervisor/Interns';
import SupervisorScanner from './pages/supervisor/Scanner';
import SupervisorEvaluation from './pages/supervisor/Evaluation';
import SupervisorReports from './pages/supervisor/Reports';
import Profile from './pages/Profile';
import InternDashboard from './pages/intern/Dashboard';
import InternApplication from './pages/intern/Application';
import InternReport from './pages/intern/Report';
import InternAttendance from './pages/intern/AttendanceHistory';
import InternEvaluation from './pages/intern/MyEvaluation';
import InternCertificate from './pages/intern/MyCertificate';
import InternOffreStage from './pages/intern/MyOffreStage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route path="/admin" element={<ProtectedRoute roles={['administrator']}><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="departments" element={<AdminDepartments />} />
        <Route path="audit-logs" element={<AdminAuditLogs />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/rh" element={<ProtectedRoute roles={['rh']}><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<RhDashboard />} />
        <Route path="applications" element={<RhApplications />} />
        <Route path="interns" element={<RhInterns />} />
        <Route path="certificates" element={<RhCertificates />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/supervisor" element={<ProtectedRoute roles={['supervisor']}><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SupervisorDashboard />} />
        <Route path="interns" element={<SupervisorInterns />} />
        <Route path="scanner" element={<SupervisorScanner />} />
        <Route path="evaluations" element={<SupervisorEvaluation />} />
        <Route path="rapports" element={<SupervisorReports />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="/intern" element={<ProtectedRoute roles={['intern']}><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<InternDashboard />} />
        <Route path="application" element={<InternApplication />} />
        <Route path="report" element={<InternReport />} />
        <Route path="attendance" element={<InternAttendance />} />
        <Route path="evaluation" element={<InternEvaluation />} />
        <Route path="certificate" element={<InternCertificate />} />
        <Route path="offre-stage" element={<InternOffreStage />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;




