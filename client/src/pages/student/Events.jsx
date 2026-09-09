import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, ExternalLink, Filter, PartyPopper } from 'lucide-react';
import api from '../../api';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Hackathon', 'Internship', 'Workshop', 'Seminar', 'Cultural', 'Sports'];

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const url = filter === 'All' ? '/events' : `/events?category=${filter}`;
      const res = await api.get(url);
      setEvents(res.data);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'hackathon': return 'from-purple-500 to-indigo-500 border-purple-500 text-purple-700 bg-purple-50';
      case 'internship': return 'from-blue-500 to-cyan-500 border-blue-500 text-blue-700 bg-blue-50';
      case 'cultural': return 'from-pink-500 to-rose-500 border-pink-500 text-pink-700 bg-pink-50';
      case 'workshop': return 'from-emerald-500 to-teal-500 border-emerald-500 text-emerald-700 bg-emerald-50';
      case 'seminar': return 'from-amber-500 to-orange-500 border-amber-500 text-amber-700 bg-amber-50';
      case 'sports': return 'from-red-500 to-rose-600 border-red-500 text-red-700 bg-red-50';
      default: return 'from-gray-500 to-slate-500 border-gray-500 text-gray-700 bg-gray-50';
    }
  };

  const isClosed = (lastDate) => {
    return new Date(lastDate) < new Date();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            🎉 Events & Opportunities
          </h1>
          <p className="text-gray-500">Discover hackathons, internships, workshops & more</p>
        </div>
        <PartyPopper size={48} className="text-purple-200 hidden md:block" />
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <Filter size={20} className="text-gray-400 shrink-0 mr-2" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
              filter === cat
                ? 'bg-gray-900 text-white shadow-md'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
          <PartyPopper className="mx-auto h-16 w-16 text-gray-200 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 mb-1">No Events Found</h3>
          <p className="text-gray-500">There are currently no events matching your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            const closed = isClosed(event.last_date_to_apply);
            const style = getCategoryColor(event.category);
            
            return (
              <div 
                key={event.id} 
                className={`bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl relative ${closed ? 'opacity-75' : ''}`}
              >
                <div className={`h-2 bg-gradient-to-r ${style.split(' ')[0]} ${style.split(' ')[1]}`}></div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style.split(' ').slice(2).join(' ')}`}>
                      {event.category || 'Event'}
                    </span>
                    {closed && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                        Closed
                      </span>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-6 line-clamp-3 flex-1">
                    {event.description}
                  </p>

                  <div className="space-y-3 mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <div className="flex items-center text-sm text-gray-700">
                      <Calendar size={16} className="text-indigo-500 mr-3" />
                      <span className="font-semibold">{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    {event.venue && (
                      <div className="flex items-center text-sm text-gray-700">
                        <MapPin size={16} className="text-indigo-500 mr-3" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase mb-1">Fee</p>
                      <p className="text-sm font-bold text-gray-900">
                        {!event.registration_fee || event.registration_fee === '0' || event.registration_fee.toLowerCase() === 'free' 
                          ? <span className="text-emerald-600">Free</span> 
                          : `₹${event.registration_fee}`}
                      </p>
                    </div>
                    
                    <a
                      href={event.registration_link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`inline-flex items-center px-5 py-2.5 rounded-xl text-sm font-bold shadow-md transition-all ${
                        closed 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:scale-105'
                      }`}
                      onClick={(e) => {
                        if (closed || !event.registration_link) e.preventDefault();
                      }}
                    >
                      {closed ? 'Closed' : 'Register'}
                      {!closed && <ExternalLink size={16} className="ml-2" />}
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
