import React, { useState, useEffect } from 'react';
import { ClipboardCheck, CheckCircle, XCircle } from 'lucide-react';
import api from '../../api';

export default function LeaveApprovals() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingLeaves();
  }, []);

  const fetchPendingLeaves = async () => {
    try {
      setLoading(true);
      const res = await api.get('/leaves/pending');
      setLeaves(res.data);
    } catch (err) {
      console.error('Failed to fetch leaves:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await api.put(`/leaves/${id}/teacher`, { status });
      // Update local state to remove or update the leave
      setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
    } catch (err) {
      alert('Failed to update leave status');
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
          📋 Leave Approvals
        </h1>
        <p className="text-gray-500">Review and manage student leave requests</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : leaves.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <ClipboardCheck className="mx-auto h-16 w-16 text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">All Caught Up!</h3>
          <p className="text-gray-500">There are no pending leave requests right now.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {leaves.map((leave) => (
            <div key={leave.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{leave.student_name}</h3>
                    <p className="text-xs text-indigo-600 font-semibold bg-indigo-50 inline-block px-2 py-1 rounded mt-1">
                      {leave.student_department}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadge(leave.status)}`}>
                    {leave.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">From</p>
                    <p className="text-sm font-medium text-gray-900">{new Date(leave.leave_date).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <p className="text-xs text-gray-500 font-bold uppercase mb-1">To</p>
                    <p className="text-sm font-medium text-gray-900">
                      {leave.leave_end_date ? new Date(leave.leave_end_date).toLocaleDateString() : new Date(leave.leave_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-500 font-bold uppercase mb-1">Reason</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    {leave.reason}
                  </p>
                </div>

                <div className="mb-6 flex items-center justify-between border-t border-b border-gray-50 py-3">
                  <span className="text-sm font-medium text-gray-700">Parent Approval Status:</span>
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${getStatusBadge(leave.parent_status)}`}>
                    {leave.parent_status.toUpperCase()}
                  </span>
                </div>

                {leave.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAction(leave.id, 'approved')}
                      className="flex items-center justify-center gap-2 py-2.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-xl font-bold transition-colors border border-emerald-200 hover:border-transparent"
                    >
                      <CheckCircle size={18} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(leave.id, 'rejected')}
                      className="flex items-center justify-center gap-2 py-2.5 bg-rose-50 text-rose-700 hover:bg-rose-600 hover:text-white rounded-xl font-bold transition-colors border border-rose-200 hover:border-transparent"
                    >
                      <XCircle size={18} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
