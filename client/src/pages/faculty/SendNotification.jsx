import React, { useState } from 'react';
import { BellRing, Send } from 'lucide-react';
import api from '../../api';

export default function SendNotification() {
  const [formData, setFormData] = useState({
    target_role: 'all', department: '', title: '', message: ''
  });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/notifications', formData);
      setStatus('Notification sent successfully!');
      setFormData({ ...formData, title: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    } catch (err) {
      setStatus('Failed to send notification');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
          📢 Announcements
        </h1>
        <p className="text-gray-500">Broadcast messages to students or faculty</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <BellRing size={200} />
        </div>

        {status && (
          <div className={`p-4 rounded-xl mb-6 text-center font-bold text-sm relative z-10 ${status.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {status}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Audience</label>
              <select value={formData.target_role} onChange={e => setFormData({...formData, target_role: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500">
                <option value="all">Everyone</option>
                <option value="student">All Students</option>
                <option value="faculty">All Faculty</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Department (Optional)</label>
              <input type="text" placeholder="e.g. CSE" value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
            <input required type="text" placeholder="Announcement subject" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
            <textarea required rows="5" placeholder="Type your message here..." value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 resize-none" />
          </div>
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-4">
            <Send size={20} /> Send Broadcast
          </button>
        </form>
      </div>
    </div>
  );
}
