import React, { useState, useEffect } from 'react';
import { Award, TrendingUp } from 'lucide-react';
import api from '../../api';

export default function Marks() {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMarks();
  }, []);

  const fetchMarks = async () => {
    try {
      const res = await api.get('/marks');
      setMarks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (score, max) => {
    const pct = (score / max) * 100;
    if (pct >= 85) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (pct >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (pct >= 50) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            🏆 Academic Marks
          </h1>
          <p className="text-gray-500">View your performance across subjects</p>
        </div>
        <TrendingUp size={48} className="text-indigo-100" />
      </div>

      {loading ? (
        <div className="text-center py-12">Loading...</div>
      ) : marks.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 text-gray-500">No marks recorded yet.</div>
      ) : (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-bold text-gray-600">Subject</th>
                <th className="text-left p-4 font-bold text-gray-600">Exam Type</th>
                <th className="text-right p-4 font-bold text-gray-600">Score</th>
                <th className="text-center p-4 font-bold text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((mark, i) => (
                <tr key={i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">{mark.subject}</td>
                  <td className="p-4 text-gray-600 font-medium">{mark.exam_type}</td>
                  <td className="p-4 text-right font-bold text-gray-900">
                    {mark.score} <span className="text-gray-400 text-sm">/ {mark.max_score}</span>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${getGradeColor(mark.score, mark.max_score)}`}>
                      {((mark.score / mark.max_score) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
