import React, { useState, useEffect } from 'react';
import { Bell, Clock } from 'lucide-react';
import api from '../../api';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex items-center gap-4">
        <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
          <Bell size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-1">
            Notifications
          </h1>
          <p className="text-gray-500">Stay updated with latest announcements</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-500">No new notifications.</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div key={notif.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-4">
              <div className="mt-1">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900 text-lg mb-1">{notif.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{notif.message}</p>
                <div className="flex items-center text-xs text-gray-400 font-semibold">
                  <Clock size={14} className="mr-1" /> {new Date(notif.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
