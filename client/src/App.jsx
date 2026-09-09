import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import InstallPrompt from './components/InstallPrompt';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Public Pages
import ParentApproval from './pages/ParentApproval';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import StudentTimetable from './pages/student/Timetable';
import StudentAttendance from './pages/student/Attendance';
import StudentAssignments from './pages/student/Assignments';
import StudentMarks from './pages/student/Marks';
import StudentNotifications from './pages/student/Notifications';
import StudentExams from './pages/student/Exams';
import StudentBusTrack from './pages/student/BusTrack';
import StudentLeaveApplication from './pages/student/LeaveApplication';
import StudentEvents from './pages/student/Events';

// Faculty Pages
import FacultyDashboard from './pages/faculty/Dashboard';
import FacultyManageTimetable from './pages/faculty/ManageTimetable';
import FacultyAttendanceSession from './pages/faculty/AttendanceSession';
import FacultyManageAssignments from './pages/faculty/ManageAssignments';
import FacultyEnterMarks from './pages/faculty/EnterMarks';
import FacultySendNotification from './pages/faculty/SendNotification';
import FacultyLeaveApprovals from './pages/faculty/LeaveApprovals';
import FacultyManageEvents from './pages/faculty/ManageEvents';

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      <InstallPrompt />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register />} />
        <Route path="/parent-approval/:code" element={<ParentApproval />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Main Views */}
          <Route index element={user?.role === 'faculty' ? <FacultyDashboard /> : <StudentDashboard />} />
          <Route path="timetable" element={user?.role === 'faculty' ? <FacultyManageTimetable /> : <StudentTimetable />} />
          <Route path="attendance" element={user?.role === 'faculty' ? <FacultyAttendanceSession /> : <StudentAttendance />} />
          <Route path="assignments" element={user?.role === 'faculty' ? <FacultyManageAssignments /> : <StudentAssignments />} />
          <Route path="marks" element={user?.role === 'faculty' ? <FacultyEnterMarks /> : <StudentMarks />} />
          <Route path="notifications" element={user?.role === 'faculty' ? <FacultySendNotification /> : <StudentNotifications />} />
          
          {/* Student Specific */}
          <Route path="exams" element={<StudentExams />} />
          <Route path="bus-track" element={<StudentBusTrack />} />
          <Route path="leave" element={<StudentLeaveApplication />} />
          
          {/* Shared / Faculty Specific */}
          <Route path="events" element={user?.role === 'faculty' ? <FacultyManageEvents /> : <StudentEvents />} />
          <Route path="leave-approvals" element={<FacultyLeaveApprovals />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
