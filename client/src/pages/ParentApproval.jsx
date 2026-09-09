import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ParentApproval() {
  const { code } = useParams();
  const [leave, setLeave] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchLeave();
  }, [code]);

  const fetchLeave = async () => {
    try {
      // Direct axios call, without auth headers since it's public
      const res = await axios.get(`http://localhost:3001/api/leaves/parent/${code}`);
      setLeave(res.data);
    } catch (err) {
      setError('Invalid or expired approval link.');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (status) => {
    setSubmitting(true);
    setError('');
    try {
      await axios.put(`http://localhost:3001/api/leaves/${leave.id}/parent`, {
        parent_code: code,
        status,
        remarks
      });
      setSuccess(true);
      setLeave({ ...leave, parent_status: status });
    } catch (err) {
      setError('Failed to update leave status. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 flex items-center justify-center p-4">
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>

      <div className="max-w-lg w-full relative z-10">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="bg-white/5 border-b border-white/10 p-6 text-center">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">🎓 GNITC Portal</h1>
            <p className="text-indigo-200 mt-1 font-medium">Parent Leave Approval</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="bg-rose-500/20 border border-rose-500/50 text-rose-100 px-4 py-3 rounded-xl mb-6 text-center text-sm">
                {error}
              </div>
            )}

            {!error && leave && (
              <>
                <div className="space-y-6">
                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Student Name</p>
                    <p className="text-white text-lg font-semibold">{leave.student_name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">From Date</p>
                      <p className="text-white font-medium">{new Date(leave.leave_date).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">To Date</p>
                      <p className="text-white font-medium">
                        {leave.leave_end_date ? new Date(leave.leave_end_date).toLocaleDateString() : new Date(leave.leave_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-1">Reason for Leave</p>
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-white text-sm">
                      {leave.reason}
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6">
                    {leave.parent_status === 'pending' && !success ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">
                            Remarks (Optional)
                          </label>
                          <textarea
                            className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/30 focus:ring-2 focus:ring-indigo-400 focus:outline-none resize-none"
                            placeholder="Add any remarks for the teacher..."
                            rows="2"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <button
                            onClick={() => handleAction('approved')}
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold shadow-lg transition-colors disabled:opacity-50"
                          >
                            <CheckCircle size={20} /> Approve
                          </button>
                          <button
                            onClick={() => handleAction('rejected')}
                            disabled={submitting}
                            className="flex items-center justify-center gap-2 py-3 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-lg transition-colors disabled:opacity-50"
                          >
                            <XCircle size={20} /> Reject
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                        {leave.parent_status === 'approved' ? (
                          <div className="text-emerald-400 mb-2 flex justify-center">
                            <CheckCircle size={48} />
                          </div>
                        ) : (
                          <div className="text-rose-400 mb-2 flex justify-center">
                            <XCircle size={48} />
                          </div>
                        )}
                        <h3 className="text-white font-bold text-xl mb-1">
                          Leave {leave.parent_status.charAt(0).toUpperCase() + leave.parent_status.slice(1)}
                        </h3>
                        <p className="text-white/60 text-sm">
                          Your response has been recorded and updated in the portal.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
