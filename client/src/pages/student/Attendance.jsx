import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { CheckSquare, Scan, History, AlertCircle } from 'lucide-react';
import api from '../../api';

export default function Attendance() {
  const [activeTab, setActiveTab] = useState('scan');
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState({ present: 0, total: 0 });
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (activeTab === 'scan') {
      const scanner = new Html5QrcodeScanner('reader', { qrbox: { width: 250, height: 250 }, fps: 5 });
      scanner.render(onScanSuccess, onScanFailure);

      return () => {
        scanner.clear().catch(error => console.error('Failed to clear scanner', error));
      };
    }
  }, [activeTab]);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/attendance');
      setHistory(res.data);
      const present = res.data.filter(r => r.status === 'present').length;
      setStats({ present, total: res.data.length });
    } catch (err) {
      console.error(err);
    }
  };

  const onScanSuccess = async (decodedText) => {
    try {
      const { session_id, token } = JSON.parse(decodedText);
      await api.post('/attendance/mark', { session_id, token });
      setScanResult('Attendance marked successfully!');
      setError('');
      fetchHistory();
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid QR code or session expired');
      setScanResult(null);
    }
  };

  const onScanFailure = (error) => {
    // console.warn(error);
  };

  const attendancePercentage = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;
  
  const getProgressColor = (pct) => {
    if (pct >= 75) return 'from-emerald-400 to-emerald-500';
    if (pct >= 60) return 'from-amber-400 to-amber-500';
    return 'from-rose-400 to-rose-500';
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            ✅ Attendance
          </h1>
          <p className="text-gray-500">Mark your presence and view history</p>
        </div>
        
        {stats.total > 0 && (
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path className="text-gray-200" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                <path className={`${attendancePercentage >= 75 ? 'text-emerald-500' : attendancePercentage >= 60 ? 'text-amber-500' : 'text-rose-500'}`} strokeDasharray={`${attendancePercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              </svg>
              <span className="absolute text-sm font-bold text-gray-700">{attendancePercentage}%</span>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">Overall Attendance</p>
              <p className="text-xs text-gray-500">{stats.present} / {stats.total} sessions</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex bg-white rounded-xl p-1 shadow-sm w-max border border-gray-100">
        <button onClick={() => setActiveTab('scan')} className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'scan' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
          <Scan size={16} className="mr-2" /> Mark Attendance
        </button>
        <button onClick={() => setActiveTab('history')} className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
          <History size={16} className="mr-2" /> History
        </button>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[400px]">
        {activeTab === 'scan' ? (
          <div className="max-w-md mx-auto space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Scan QR Code</h2>
              <p className="text-gray-500 text-sm mt-1">Point your camera at the QR code displayed by your faculty</p>
            </div>
            
            <div className="overflow-hidden rounded-2xl border-2 border-indigo-100 shadow-inner">
              <div id="reader" className="w-full"></div>
            </div>

            {scanResult && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center">
                <CheckSquare className="mr-2" size={20} /> {scanResult}
              </div>
            )}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center">
                <AlertCircle className="mr-2" size={20} /> {error}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {history.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No attendance records found.</div>
            ) : (
              history.map((record, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-md transition-all">
                  <div>
                    <h4 className="font-bold text-gray-900">{record.subject}</h4>
                    <p className="text-sm text-gray-500">{new Date(record.date).toLocaleString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${record.status === 'present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {record.status.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
