import React, { useState } from 'react';
import { Phone, Search, MapPin, Clock, ArrowRight, Bus } from 'lucide-react';

export default function BusTrack() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRoute, setExpandedRoute] = useState(null);

  const routes = [
    {
      id: 1,
      name: 'Dilsukhnagar Route',
      busNo: 'Bus 1',
      morningStart: '7:30 AM',
      eveningStart: '4:30 PM',
      stops: [
        { name: 'Dilsukhnagar', morning: '7:30 AM', evening: '5:50 PM' },
        { name: 'Kothapet', morning: '7:40 AM', evening: '5:40 PM' },
        { name: 'Chaitanyapuri', morning: '7:50 AM', evening: '5:30 PM' },
        { name: 'LB Nagar', morning: '8:00 AM', evening: '5:20 PM' },
        { name: 'Hayathnagar', morning: '8:15 AM', evening: '5:05 PM' },
        { name: 'Ibrahimpatnam', morning: '8:40 AM', evening: '4:40 PM' },
        { name: 'GNITC', morning: '8:50 AM', evening: '4:30 PM' }
      ]
    },
    {
      id: 2,
      name: 'Secunderabad Route',
      busNo: 'Bus 2',
      morningStart: '7:15 AM',
      eveningStart: '4:30 PM',
      stops: [
        { name: 'Secunderabad', morning: '7:15 AM', evening: '6:05 PM' },
        { name: 'Mettuguda', morning: '7:25 AM', evening: '5:55 PM' },
        { name: 'Tarnaka', morning: '7:35 AM', evening: '5:45 PM' },
        { name: 'Uppal', morning: '7:55 AM', evening: '5:25 PM' },
        { name: 'Boduppal', morning: '8:10 AM', evening: '5:10 PM' },
        { name: 'Ghatkesar', morning: '8:25 AM', evening: '4:55 PM' },
        { name: 'GNITC', morning: '8:50 AM', evening: '4:30 PM' }
      ]
    },
    {
      id: 3,
      name: 'Mehdipatnam Route',
      busNo: 'Bus 3',
      morningStart: '7:00 AM',
      eveningStart: '4:30 PM',
      stops: [
        { name: 'Mehdipatnam', morning: '7:00 AM', evening: '6:15 PM' },
        { name: 'Attapur', morning: '7:10 AM', evening: '6:05 PM' },
        { name: 'Rajendranagar', morning: '7:25 AM', evening: '5:50 PM' },
        { name: 'Shamshabad', morning: '7:45 AM', evening: '5:30 PM' },
        { name: 'Ibrahimpatnam', morning: '8:20 AM', evening: '4:55 PM' },
        { name: 'GNITC', morning: '8:45 AM', evening: '4:30 PM' }
      ]
    },
    {
      id: 4,
      name: 'Suchitra Route',
      busNo: 'Bus 4',
      morningStart: '6:45 AM',
      eveningStart: '4:30 PM',
      stops: [
        { name: 'Suchitra', morning: '6:45 AM', evening: '6:35 PM' },
        { name: 'Alwal', morning: '6:55 AM', evening: '6:25 PM' },
        { name: 'Malkajgiri', morning: '7:10 AM', evening: '6:10 PM' },
        { name: 'ECIL X Roads', morning: '7:25 AM', evening: '5:55 PM' },
        { name: 'Nacharam', morning: '7:40 AM', evening: '5:40 PM' },
        { name: 'Uppal', morning: '7:55 AM', evening: '5:25 PM' },
        { name: 'Ghatkesar', morning: '8:15 AM', evening: '5:05 PM' },
        { name: 'GNITC', morning: '8:50 AM', evening: '4:30 PM' }
      ]
    },
    {
      id: 5,
      name: 'Naredmet Route',
      busNo: 'Bus 5',
      morningStart: '7:00 AM',
      eveningStart: '4:30 PM',
      stops: [
        { name: 'Naredmet', morning: '7:00 AM', evening: '6:20 PM' },
        { name: 'Sainikpuri', morning: '7:10 AM', evening: '6:10 PM' },
        { name: 'ECIL', morning: '7:20 AM', evening: '6:00 PM' },
        { name: 'AS Rao Nagar', morning: '7:30 AM', evening: '5:50 PM' },
        { name: 'Nacharam', morning: '7:40 AM', evening: '5:40 PM' },
        { name: 'Uppal', morning: '7:55 AM', evening: '5:25 PM' },
        { name: 'GNITC', morning: '8:50 AM', evening: '4:30 PM' }
      ]
    },
    {
      id: 6,
      name: 'Kukatpally Route',
      busNo: 'Bus 6',
      morningStart: '6:45 AM',
      eveningStart: '4:30 PM',
      stops: [
        { name: 'Kukatpally', morning: '6:45 AM', evening: '6:35 PM' },
        { name: 'JNTU', morning: '6:50 AM', evening: '6:30 PM' },
        { name: 'KPHB', morning: '7:00 AM', evening: '6:20 PM' },
        { name: 'Miyapur', morning: '7:10 AM', evening: '6:10 PM' },
        { name: 'Chandanagar', morning: '7:25 AM', evening: '5:55 PM' },
        { name: 'Patancheru', morning: '7:40 AM', evening: '5:40 PM' },
        { name: 'GNITC', morning: '8:50 AM', evening: '4:30 PM' }
      ]
    },
    {
      id: 7,
      name: 'Malakpet Route',
      busNo: 'Bus 7',
      morningStart: '7:15 AM',
      eveningStart: '4:30 PM',
      stops: [
        { name: 'Malakpet', morning: '7:15 AM', evening: '6:00 PM' },
        { name: 'Chaderghat', morning: '7:25 AM', evening: '5:50 PM' },
        { name: 'Nalgonda X Roads', morning: '7:35 AM', evening: '5:40 PM' },
        { name: 'Vanasthalipuram', morning: '7:50 AM', evening: '5:25 PM' },
        { name: 'Hayathnagar', morning: '8:05 AM', evening: '5:10 PM' },
        { name: 'GNITC', morning: '8:45 AM', evening: '4:30 PM' }
      ]
    },
    {
      id: 8,
      name: 'Medipally Route',
      busNo: 'Bus 8',
      morningStart: '7:15 AM',
      eveningStart: '4:30 PM',
      stops: [
        { name: 'Medipally', morning: '7:15 AM', evening: '6:05 PM' },
        { name: 'Uppal Depot', morning: '7:25 AM', evening: '5:55 PM' },
        { name: 'Pirzadiguda', morning: '7:35 AM', evening: '5:45 PM' },
        { name: 'Nagole', morning: '7:45 AM', evening: '5:35 PM' },
        { name: 'LB Nagar', morning: '8:00 AM', evening: '5:20 PM' },
        { name: 'GNITC', morning: '8:50 AM', evening: '4:30 PM' }
      ]
    }
  ];

  const filteredRoutes = routes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.stops.some(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
            🚌 College Bus Track
          </h1>
          <p className="text-gray-500">GNITC Transport Routes & Timings</p>
        </div>
        
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm w-full md:w-auto">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shrink-0">
            <Phone size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-900">Transport Helpline</p>
            <p className="text-lg font-bold text-indigo-600">+91 84990 71144</p>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-sm font-medium flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
        Important: Please arrive 5 minutes early. Carry your Bus Pass and College ID at all times.
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for a route or stop name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
        />
      </div>

      <div className="grid gap-6">
        {filteredRoutes.map((route) => (
          <div key={route.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md">
            <div 
              className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r hover:from-gray-50 to-transparent transition-colors"
              onClick={() => setExpandedRoute(expandedRoute === route.id ? null : route.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-inner">
                  {route.id}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{route.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="inline-flex items-center text-xs font-medium bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                      <Bus size={12} className="mr-1" />
                      {route.busNo}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6 w-full md:w-auto px-4 py-2 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Morning Pickup</p>
                  <p className="text-sm font-bold text-gray-900">{route.morningStart}</p>
                </div>
                <ArrowRight size={16} className="text-gray-300" />
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Evening Drop</p>
                  <p className="text-sm font-bold text-gray-900">{route.eveningStart}</p>
                </div>
              </div>
            </div>

            {expandedRoute === route.id && (
              <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                      <Clock size={16} /> Morning Schedule (To GNITC)
                    </h4>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-300 before:to-indigo-300">
                      {route.stops.map((stop, i) => (
                        <div key={i} className="relative flex items-center justify-between z-10 group">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-white border-2 border-indigo-500 group-hover:bg-indigo-500 transition-colors shadow-sm"></div>
                            <span className="text-sm font-medium text-gray-700">{stop.name}</span>
                          </div>
                          <span className="text-sm font-bold text-indigo-600 bg-white px-2 py-1 rounded-md shadow-sm border border-indigo-50">{stop.morning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-purple-900 mb-4 flex items-center gap-2">
                      <Clock size={16} /> Evening Schedule (From GNITC)
                    </h4>
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-300 before:to-purple-300">
                      {/* Reverse order for evening display conceptually, but we can just map it as is since GNITC is last and they drop backwards */}
                      {[...route.stops].reverse().map((stop, i) => (
                        <div key={i} className="relative flex items-center justify-between z-10 group">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-white border-2 border-purple-500 group-hover:bg-purple-500 transition-colors shadow-sm"></div>
                            <span className="text-sm font-medium text-gray-700">{stop.name}</span>
                          </div>
                          <span className="text-sm font-bold text-purple-600 bg-white px-2 py-1 rounded-md shadow-sm border border-purple-50">{stop.evening}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        {filteredRoutes.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <MapPin className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">No routes found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
