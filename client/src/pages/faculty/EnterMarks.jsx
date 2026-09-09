import React, { useState } from 'react';
import { Award, Save } from 'lucide-react';
import api from '../../api';

export default function EnterMarks() {
  const [formData, setFormData] = useState({
    student_id: '', subject: '', exam_type: 'Mid Term 1', score: '', max_score: '100'
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/marks', formData);
      setMessage('Marks successfully entered!');
      setFormData({ ...formData, student_id: '', score: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to enter marks');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
          🎯 Enter Marks
        </h1>
        <p className="text-gray-500">Record student academic performance</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        {message && (
          <div className={`p-4 rounded-xl mb-6 text-center font-bold text-sm ${message.includes('success') ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {message}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Student ID</label>
            <input required type="text" value={formData.student_id} onChange={e => setFormData({...formData, student_id: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
            <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Type</label>
            <select value={formData.exam_type} onChange={e => setFormData({...formData, exam_type: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500">
              <option>Mid Term 1</option>
              <option>Mid Term 2</option>
              <option>Finals</option>
              <option>Assignment</option>
              <option>Lab</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Score</label>
              <input required type="number" step="0.1" value={formData.score} onChange={e => setFormData({...formData, score: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Max Score</label>
              <input required type="number" value={formData.max_score} onChange={e => setFormData({...formData, max_score: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
          <button type="submit" className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 mt-4">
            <Save size={20} /> Save Marks
          </button>
        </form>
      </div>
    </div>
  );
}
