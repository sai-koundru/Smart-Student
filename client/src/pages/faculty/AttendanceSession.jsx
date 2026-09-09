import React, { useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { QrCode, Play, StopCircle } from 'lucide-react';
import api from '../../api';

export default function AttendanceSession() {
  const [subject, setSubject] = useState('');
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const startSession = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/attendance/session/start', { subject });
      setSession(res.data);
    } catch (err) {
      setError('Failed to start session');
    } finally {
      setLoading(false);
    }
  };

  const endSession = async () => {
    try {
      await api.post(`/attendance/session/${session.id}/end`);
      setSession(null);
      setSubject('');
    } catch (err) {
      setError('Failed to end session');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
        <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">
          QR Attendance
        </h1>
        <p className="text-gray-500">Start a session and display QR code for students</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        {!session ? (
          <form onSubmit={startSession} className="space-y-6">
            {error && <div className="text-rose-500 text-sm font-bold text-center bg-rose-50 py-2 rounded-xl">{error}</div>}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Subject Name</label>
              <input
                required type="text" value={subject} onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Database Systems"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Play size={20} /> Start Session
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">{subject}</h2>
              <p className="text-emerald-600 font-semibold animate-pulse">Session Active</p>
            </div>
            
            <div className="p-4 bg-white rounded-2xl shadow-lg border-4 border-emerald-100">
              <QRCode 
                value={JSON.stringify({ session_id: session.id, token: session.token })} 
                size={256}
                level="H"
                includeMargin={true}
              />
            </div>

            <p className="text-sm text-gray-500">Ask students to scan this QR code via the app</p>

            <button
              onClick={endSession}
              className="w-full max-w-xs py-3.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2"
            >
              <StopCircle size={20} /> End Session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
