import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, Calendar } from 'lucide-react';
import api from '../../api';

export default function ManageAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '', description: '', subject: '', due_date: ''
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/assignments', formData);
      setFormData({ title: '', description: '', subject: '', due_date: '' });
      setShowForm(false);
      fetchAssignments();
    } catch (err) {
      alert('Failed to create assignment');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/assignments/${id}`);
      fetchAssignments();
    } catch (err) {
      alert('Failed to delete assignment');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500 mb-2">
            📚 Manage Assignments
          </h1>
          <p className="text-gray-500">Create and oversee class coursework</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-colors"
        >
          <Plus size={20} /> New Assignment
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl p-6 shadow-md border border-amber-100">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
                <input required type="text" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Due Date & Time</label>
              <input required type="datetime-local" value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100">Cancel</button>
              <button type="submit" className="px-5 py-2.5 rounded-xl font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-md">Create</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-8">Loading...</div>
        ) : assignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-md text-xs font-bold">{assignment.subject}</span>
              <button onClick={() => handleDelete(assignment.id)} className="text-gray-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 size={18} />
              </button>
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">{assignment.title}</h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">{assignment.description}</p>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center text-sm font-medium text-gray-600 border border-gray-100">
              <Calendar size={16} className="text-amber-500 mr-2" />
              Due: {new Date(assignment.due_date).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
