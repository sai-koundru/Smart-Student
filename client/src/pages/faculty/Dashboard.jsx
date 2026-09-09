import React, { useState, useEffect } from 'react';
import { Users, Calendar, CheckSquare, Bell } from 'lucide-react';
import StatCard from '../../components/StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    classesToday: 0,
    pendingLeaves: 0,
    activeAssignments: 0
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Mocking API for faculty dashboard
    setTimeout(() => {
      setStats({
        totalStudents: 120,
        classesToday: 3,
        pendingLeaves: 5,
        activeAssignments: 2
      });
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
          Welcome back, Prof. {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500">Manage your classes, students, and tasks from here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents} icon={Users} color="indigo" />
        <StatCard title="Classes Today" value={stats.classesToday} icon={Calendar} color="emerald" />
        <StatCard title="Pending Leaves" value={stats.pendingLeaves} icon={CheckSquare} color="amber" />
        <StatCard title="Active Assignments" value={stats.activeAssignments} icon={Bell} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Schedule</h2>
          <div className="space-y-4">
            {[1, 2].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div>
                  <p className="font-semibold text-gray-900">Data Structures Lab</p>
                  <p className="text-sm text-gray-500">CSE - Section A • Room 302</p>
                </div>
                <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-bold">
                  10:00 AM
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl font-bold border border-emerald-100 hover:bg-emerald-100 transition-colors">
              Start Attendance
            </button>
            <button className="p-4 bg-purple-50 text-purple-700 rounded-2xl font-bold border border-purple-100 hover:bg-purple-100 transition-colors">
              New Assignment
            </button>
            <button className="p-4 bg-amber-50 text-amber-700 rounded-2xl font-bold border border-amber-100 hover:bg-amber-100 transition-colors">
              Review Leaves
            </button>
            <button className="p-4 bg-rose-50 text-rose-700 rounded-2xl font-bold border border-rose-100 hover:bg-rose-100 transition-colors">
              Enter Marks
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
