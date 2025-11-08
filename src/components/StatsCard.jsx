'use client';

import React from 'react';

export default function StatsCard({ title, value, delta, icon, color = 'emerald', trend = 'up' }) {
  const gradientClasses = {
    emerald: 'from-emerald-500 to-teal-500',
    teal: 'from-teal-500 to-cyan-500',
    amber: 'from-amber-500 to-orange-500',
    blue: 'from-blue-500 to-indigo-500',
  };

  const iconBgClasses = {
    emerald: 'bg-emerald-100',
    teal: 'bg-teal-100',
    amber: 'bg-amber-100',
    blue: 'bg-blue-100',
  };

  const iconColorClasses = {
    emerald: 'text-emerald-600',
    teal: 'text-teal-600',
    amber: 'text-amber-600',
    blue: 'text-blue-600',
  };

  const deltaColor = trend === 'up' ? 'text-emerald-600' : 'text-red-600';
  const deltaIcon = trend === 'up' ? '↑' : '↓';

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl hover:scale-105 transition-all duration-300 group cursor-pointer">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-2">
            {title}
          </p>
          <p className="text-4xl font-bold text-slate-900 mb-3 group-hover:scale-105 transition-transform">
            {value}
          </p>
          {delta !== undefined && (
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-semibold ${deltaColor} flex items-center`}>
                <span className="text-lg mr-1">{deltaIcon}</span>
                {Math.abs(delta)}%
              </span>
              <span className="text-xs text-slate-500">vs last month</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className={`
            p-4 rounded-2xl ${iconBgClasses[color]} ${iconColorClasses[color]}
            group-hover:scale-110 transition-transform
          `}>
            {icon}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 h-1 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${gradientClasses[color]} transition-all duration-1000`}
          style={{ width: `${Math.min(Math.abs(delta || 50), 100)}%` }}
        ></div>
      </div>
    </div>
  );
}
