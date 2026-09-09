import React, { useState, useEffect } from 'react';
import { Calendar, CheckSquare, FileText, Bell } from 'lucide-react';
import api from '../../api';
import StatCard from '../../components/StatCard';

export default function Dashboard() {
  const [stats, setStats] = useState({
    attendancePercentage: 0,
    pendingAssignments: 0,
    recentMarks: [],
    notifications: []
  });
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // In a real app, fetch dashboard stats from API
    // Mocking for now
    setTimeout(() => {
      setStats({
        attendancePercentage: 85,
        pendingAssignments: 3,
        recentMarks: [
          { subject: 'Math', score: 90 },
          { subject: 'Physics', score: 85 }
        ],
        notifications: [
          { title: 'New Assignment Added', date: new Date().toISOString() },
          { title: 'Holiday on Friday', date: new Date().toISOString() }
        ]
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
          Welcome back, {user?.name.split(' ')[0]}! 👋
        </h1>
        <p className="text-gray-500">Here's what's happening with your academics today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Attendance"
          value={`${stats.attendancePercentage}%`}
          icon={CheckSquare}
          color="emerald"
        />
        <StatCard
          title="Pending Assignments"
          value={stats.pendingAssignments}
          icon={FileText}
          color="amber"
        />
        <StatCard
          title="Recent Marks"
          value={stats.recentMarks.length}
          icon={Calendar}
          color="indigo"
        />
        <StatCard
          title="Notifications"
          value={stats.notifications.length}
          icon={Bell}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <FileText className="mr-2 text-indigo-500" size={24} /> Recent Assignments
          </h2>
          <div className="space-y-4">
            {stats.pendingAssignments > 0 ? (
              [1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Database Design Lab</p>
                      <p className="text-sm text-gray-500">Due in {i + 1} days</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Pending</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending assignments</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Bell className="mr-2 text-purple-500" size={24} /> Recent Notifications
          </h2>
          <div className="space-y-4">
            {stats.notifications.map((notif, i) => (
              <div key={i} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                <p className="font-semibold text-gray-900 mb-1">{notif.title}</p>
                <p className="text-xs text-gray-500">{new Date(notif.date).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
