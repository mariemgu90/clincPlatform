"use client";

import React from 'react';

export default function StaffCard({ member, onViewDetails, index }) {
  const roleColors = {
    DOCTOR: 'bg-blue-100 text-blue-700 border-blue-200',
    RECEPTIONIST: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    ADMIN: 'bg-purple-100 text-purple-700 border-purple-200',
    PATIENT: 'bg-amber-100 text-amber-700 border-amber-200',

    
  };

  const roleIcons = {
    DOCTOR: '👨‍⚕️',
    RECEPTIONIST: '👨‍💼',
    ADMIN: '👑',
    PATIENT: '🧑',

  };

  return (
    <div
      className="flex items-center justify-between md:flex-row p-6 rounded-2xl bg-white shadow-lg hover:shadow-xl transition-all border border-slate-200 hover:scale-[1.02] animate-slideUp"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-4xl shadow-md shadow-emerald-500/30">
            {roleIcons[member.role]}
          </div>
          <div>
            <h3 className="text-slate-900 font-bold text-lg">{member.name}</h3>
            <p className="text-slate-600 text-sm flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {member.email}
            </p>
            {member.phone && (
              <p className="text-slate-500 text-sm flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {member.phone}
              </p>
            )}
            {member.clinic && (
              <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-semibold border border-indigo-200">
                  {member.clinic.name}
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="items-center space-x-3">
          <div className={`w-full px-4 py-2 rounded-xl text-sm font-semibold border-2 ${roleColors[member.role]}`}>
            {member.role}
          </div>
          <button
            onClick={() => onViewDetails(member)}
            className="w-full mt-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-md"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Details
          </button>
        </div>
    </div>
  );
}
