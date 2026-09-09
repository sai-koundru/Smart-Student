import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/parent-approval/:code" element={<ParentApproval />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* We use a wrapper component or handle routing based on user role inside components. 
                For simplicity with existing structure, we render both sets of routes but they 
                will only be accessible if linked. In a real app, we'd conditionally render routes. */}
            
            {/* Student Routes */}
            <Route index element={<RoleBasedDashboard />} />
            <Route path="timetable" element={<RoleBasedTimetable />} />
            <Route path="attendance" element={<RoleBasedAttendance />} />
            <Route path="assignments" element={<RoleBasedAssignments />} />
            <Route path="marks" element={<RoleBasedMarks />} />
            <Route path="notifications" element={<RoleBasedNotifications />} />
            <Route path="exams" element={<StudentExams />} />
            <Route path="bus-track" element={<StudentBusTrack />} />
            <Route path="leave" element={<StudentLeaveApplication />} />
            <Route path="events" element={<RoleBasedEvents />} />
            <Route path="leave-approvals" element={<FacultyLeaveApprovals />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Role-based route wrappers
const RoleBasedDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'faculty' ? <FacultyDashboard /> : <StudentDashboard />;
};

const RoleBasedTimetable = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'faculty' ? <FacultyManageTimetable /> : <StudentTimetable />;
};

const RoleBasedAttendance = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'faculty' ? <FacultyAttendanceSession /> : <StudentAttendance />;
};

const RoleBasedAssignments = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'faculty' ? <FacultyManageAssignments /> : <StudentAssignments />;
};

const RoleBasedMarks = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'faculty' ? <FacultyEnterMarks /> : <StudentMarks />;
};

const RoleBasedNotifications = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'faculty' ? <FacultySendNotification /> : <StudentNotifications />;
};

const RoleBasedEvents = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'faculty' ? <FacultyManageEvents /> : <StudentEvents />;
};

export default App;
