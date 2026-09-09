import React, { useState, useEffect } from 'react';
import { FileText, Calendar, CheckCircle } from 'lucide-react';
import api from '../../api';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments');
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const submitAssignment = async (id) => {
    try {
      await api.post(`/assignments/${id}/submit`);
      fetchAssignments();
    } catch (err) {
      alert('Failed to submit assignment');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
          📝 Assignments
        </h1>
        <p className="text-gray-500">Track and submit your coursework</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : assignments.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-500">No assignments found.</div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {assignments.map((assignment) => {
            const isSubmitted = assignment.status === 'submitted';
            const isLate = new Date(assignment.due_date) < new Date() && !isSubmitted;

            return (
              <div key={assignment.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl ${isSubmitted ? 'bg-emerald-100 text-emerald-600' : isLate ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                      <FileText size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">{assignment.title}</h3>
                      <p className="text-sm font-semibold text-indigo-600">{assignment.subject}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${isSubmitted ? 'bg-emerald-100 text-emerald-700' : isLate ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                    {isSubmitted ? 'Submitted' : isLate ? 'Late' : 'Pending'}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{assignment.description}</p>

                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 p-3 rounded-xl mb-6">
                  <Calendar size={16} /> Due: {new Date(assignment.due_date).toLocaleString()}
                </div>

                {!isSubmitted && (
                  <button
                    onClick={() => submitAssignment(assignment.id)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} /> Mark as Submitted
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
