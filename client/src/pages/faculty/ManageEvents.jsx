import React, { useState, useEffect } from 'react';
import { PartyPopper, Plus, Trash2, Calendar, MapPin, Edit } from 'lucide-react';
import api from '../../api';

export default function ManageEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hackathon',
    description: '',
    event_date: '',
    last_date_to_apply: '',
    registration_fee: '',
    registration_link: '',
    venue: '',
    organizer: ''
  });

  const categories = ['Hackathon', 'Internship', 'Workshop', 'Seminar', 'Cultural', 'Sports'];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await api.get('/events');
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', formData);
      setShowForm(false);
      setFormData({
        title: '', category: 'Hackathon', description: '', event_date: '',
        last_date_to_apply: '', registration_fee: '', registration_link: '', venue: '', organizer: ''
      });
      fetchEvents();
    } catch (err) {
      alert('Failed to create event');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await api.delete(`/events/${id}`);
        fetchEvents();
      } catch (err) {
        alert('Failed to delete event');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            🎉 Manage Events
          </h1>
          <p className="text-gray-500">Create and oversee campus opportunities</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold transition-colors shadow-md"
        >
          {showForm ? <XCircle size={20} /> : <Plus size={20} />}
          {showForm ? 'Cancel' : 'New Event'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-3xl p-8 shadow-md border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Create New Event</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Title</label>
                <input
                  required name="title" value={formData.title} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Annual Tech Hackathon 2026"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  name="category" value={formData.category} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Organizer</label>
                <input
                  name="organizer" value={formData.organizer} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Club or Department Name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                <textarea
                  required name="description" value={formData.description} onChange={handleChange} rows="3"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Describe the event details..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Event Date</label>
                <input
                  required type="date" name="event_date" value={formData.event_date} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Last Date to Apply</label>
                <input
                  type="date" name="last_date_to_apply" value={formData.last_date_to_apply} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Fee</label>
                <input
                  name="registration_fee" value={formData.registration_fee} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Free, 500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Venue</label>
                <input
                  name="venue" value={formData.venue} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="e.g. Main Auditorium"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Registration Link</label>
                <input
                  type="url" name="registration_link" value={formData.registration_link} onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t">
              <button
                type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-md"
              >
                Create Event
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="text-center py-10">Loading events...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
              <div className="p-6 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold">
                    {event.category}
                  </span>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="text-gray-400 hover:text-rose-500 transition-colors p-1"
                    title="Delete Event"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">{event.description}</p>
                
                <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex items-center"><Calendar size={14} className="mr-2 text-indigo-400" /> {new Date(event.event_date).toLocaleDateString()}</div>
                  {event.venue && <div className="flex items-center"><MapPin size={14} className="mr-2 text-indigo-400" /> {event.venue}</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
