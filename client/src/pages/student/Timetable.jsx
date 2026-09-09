import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import api from '../../api';

export default function Timetable() {
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const times = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00'];

  useEffect(() => {
    fetchTimetable();
  }, []);

  const fetchTimetable = async () => {
    try {
      const res = await api.get('/timetable');
      const formatted = {};
      res.data.forEach(slot => {
        if (!formatted[slot.day_of_week]) formatted[slot.day_of_week] = {};
        formatted[slot.day_of_week][slot.start_time.substring(0, 5)] = slot;
      });
      setTimetable(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2 flex items-center gap-3">
          <Calendar size={32} className="text-indigo-600" /> My Timetable
        </h1>
        <p className="text-gray-500">Weekly class schedule</p>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full min-w-[800px] border-separate border-spacing-2">
          <thead>
            <tr>
              <th className="p-3"></th>
              {times.map(time => (
                <th key={time} className="p-3 bg-gray-50 rounded-xl text-gray-600 font-bold text-sm">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {days.map(day => (
              <tr key={day}>
                <td className={`p-4 font-bold rounded-xl text-center ${day === currentDay ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-50 text-gray-700'}`}>
                  {day.substring(0, 3).toUpperCase()}
                </td>
                {times.map(time => {
                  const slot = timetable[day]?.[time];
                  return (
                    <td key={`${day}-${time}`} className={`p-3 rounded-xl border ${slot ? 'bg-indigo-50/50 border-indigo-100' : 'bg-gray-50/30 border-transparent hover:bg-gray-50 transition-colors'}`}>
                      {slot ? (
                        <div className="flex flex-col items-center text-center p-2">
                          <span className="font-bold text-indigo-900 text-sm mb-1">{slot.subject}</span>
                          <span className="text-xs text-gray-600 font-medium">{slot.faculty_name}</span>
                          <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                            <MapPin size={10} /> {slot.room_no}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-300 text-xs">-</div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
