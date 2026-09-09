import React from 'react';

export default function StatCard({ title, value, icon: Icon, color }) {
  const gradients = {
    indigo: 'from-indigo-500 to-blue-600',
    purple: 'from-purple-500 to-pink-600',
    emerald: 'from-emerald-400 to-teal-500',
    amber: 'from-amber-400 to-orange-500',
    rose: 'from-rose-400 to-red-500',
  };

  const gradientClass = gradients[color] || gradients.indigo;

  return (
    <div className={`relative overflow-hidden bg-gradient-to-br ${gradientClass} rounded-2xl shadow-lg p-6 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}>
      <div className="relative z-10 flex flex-col h-full">
        <div className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2">
          {title}
        </div>
        <div className="text-3xl font-bold text-white mb-1">
          {value}
        </div>
      </div>
      
      {/* Absolute Icon for decorative purpose */}
      {Icon && (
        <div className="absolute -right-4 -bottom-4 opacity-20 text-white transform -rotate-12 transition-transform duration-300 group-hover:rotate-0">
          <Icon size={120} strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}
