import React, { useState, useEffect } from 'react';
import { Calendar, ClipboardList, Send, Copy, CheckCircle } from 'lucide-react';
import api from '../../api';

export default function LeaveApplication() {
  const [formData, setFormData] = useState({
    leave_date: '',
    leave_end_date: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [parentLink, setParentLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/leaves');
      setLeaveHistory(res.data);
    } catch (err) {
      console.error('Failed to fetch leave history', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setParentLink('');
    setCopied(false);

    try {
      const res = await api.post('/leaves', formData);
      setSuccess('Leave request submitted successfully!');
      if (res.data && res.data.parent_code) {
        setParentLink(`${window.location.origin}/parent-approval/${res.data.parent_code}`);
      }
      setFormData({ leave_date: '', leave_end_date: '', reason: '' });
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit leave request');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (parentLink) {
      navigator.clipboard.writeText(parentLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'rejected': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-amber-100 text-amber-700 border-amber-200';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          📋 Leave Application
        </h1>
        <p className="text-gray-500">Apply for leave with teacher and parent approval</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Calendar className="mr-2 text-indigo-500" size={24} /> Apply for Leave
            </h2>

            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Start Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.leave_date}
                  onChange={(e) => setFormData({ ...formData, leave_date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">End Date</label>
                <input
                  type="date"
                  required
                  min={formData.leave_date || new Date().toISOString().split('T')[0]}
                  value={formData.leave_end_date}
                  onChange={(e) => setFormData({ ...formData, leave_end_date: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">Reason</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Describe your reason for taking leave..."
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-[1.02] transition-all disabled:opacity-70 disabled:hover:scale-100"
              >
                {loading ? 'Submitting...' : <><Send size={18} className="mr-2" /> Submit Application</>}
              </button>
            </form>

            {success && parentLink && (
              <div className="mt-6 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center text-emerald-800 font-semibold mb-3">
                  <CheckCircle size={20} className="mr-2" /> Application Submitted
                </div>
                <p className="text-sm text-emerald-700 mb-4">
                  Share this link with your parent to approve your leave request:
                </p>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={parentLink}
                    className="flex-1 text-xs bg-white border border-emerald-200 rounded-lg px-3 py-2 text-gray-600 outline-none"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="p-2 bg-emerald-100 text-emerald-700 hover:bg-emerald-200 rounded-lg transition-colors flex-shrink-0"
                    title="Copy Link"
                  >
                    {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <ClipboardList className="mr-2 text-purple-500" size={24} /> Leave History
            </h2>

            {leaveHistory.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <ClipboardList className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                <p>No leave applications found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaveHistory.map((leave) => {
                  const isApproved = leave.status === 'approved' && leave.parent_status === 'approved';
                  const isRejected = leave.status === 'rejected' || leave.parent_status === 'rejected';
                  const overallStatus = isApproved ? 'approved' : isRejected ? 'rejected' : 'pending';
                  
                  return (
                    <div key={leave.id} className="border border-gray-100 bg-gray-50/50 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-lg">
                            {new Date(leave.leave_date).toLocaleDateString()} 
                            {leave.leave_end_date && leave.leave_end_date !== leave.leave_date 
                              ? ` - ${new Date(leave.leave_end_date).toLocaleDateString()}` 
                              : ''}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">{leave.reason}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusBadge(overallStatus)}`}>
                          {overallStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4 py-3 border-t border-dashed border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Teacher Status</p>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(leave.status)}`}>
                            {leave.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Parent Status</p>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(leave.parent_status)}`}>
                            {leave.parent_status}
                          </span>
                        </div>
                      </div>

                      {leave.parent_code && leave.parent_status === 'pending' && (
                        <div className="mt-4 flex items-center gap-2 bg-indigo-50 px-3 py-2 rounded-xl">
                          <span className="text-xs text-indigo-700 font-medium whitespace-nowrap">Parent Link:</span>
                          <input
                            readOnly
                            value={`${window.location.origin}/parent-approval/${leave.parent_code}`}
                            className="flex-1 bg-transparent text-xs text-indigo-900 outline-none truncate"
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/parent-approval/${leave.parent_code}`);
                              alert('Link copied to clipboard!');
                            }}
                            className="text-indigo-600 hover:text-indigo-800 p-1"
                          >
                            <Copy size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
