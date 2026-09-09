import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  FileText,
  Award,
  GraduationCap,
  Bus,
  ClipboardList,
  PartyPopper,
  Bell,
  ClipboardCheck,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Timetable', path: '/timetable', icon: Calendar },
    { name: 'Attendance', path: '/attendance', icon: CheckSquare },
    { name: 'Assignments', path: '/assignments', icon: FileText },
    { name: 'Marks', path: '/marks', icon: Award },
    { name: 'Exams Guide', path: '/exams', icon: GraduationCap },
    { name: 'Bus Track', path: '/bus-track', icon: Bus },
    { name: 'Leave Application', path: '/leave', icon: ClipboardList },
    { name: 'Events', path: '/events', icon: PartyPopper },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const facultyLinks = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Timetable', path: '/timetable', icon: Calendar },
    { name: 'Attendance', path: '/attendance', icon: CheckSquare },
    { name: 'Assignments', path: '/assignments', icon: FileText },
    { name: 'Marks', path: '/marks', icon: Award },
    { name: 'Leave Approvals', path: '/leave-approvals', icon: ClipboardCheck },
    { name: 'Events', path: '/events', icon: PartyPopper },
    { name: 'Notifications', path: '/notifications', icon: Bell },
  ];

  const links = user?.role === 'faculty' ? facultyLinks : studentLinks;

  const getInitials = (name) => {
    if (!name) return '';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 md:relative flex flex-col ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              🎓 GNITC Portal
            </h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-white/80 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 pb-4 overflow-y-auto space-y-1 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-indigo-900 font-semibold shadow-lg scale-[1.02]'
                      : 'text-indigo-200 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10 shrink-0">
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden text-gray-500 hover:text-gray-700"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 text-right">
              <div className="hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                <span className="inline-block px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-medium uppercase tracking-wide">
                  {user?.role}
                </span>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-md ring-2 ring-white">
                {getInitials(user?.name)}
              </div>
            </div>
            
            <div className="h-8 w-px bg-gray-200 hidden sm:block"></div>
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-rose-600 transition-colors duration-200"
              title="Logout"
            >
              <LogOut size={20} />
              <span className="hidden sm:inline text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
