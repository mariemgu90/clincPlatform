'use client';

import React from 'react';

export default function PatientCard({ patient, onViewDetails }) {
  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fullName = `${patient.firstName} ${patient.lastName}`;
  const initials = `${patient.firstName?.[0] || ''}${patient.lastName?.[0] || ''}`;
  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="flex justify-between items-center p-6 bg-white rounded-2xl hover:shadow-xl transition-all border-l-4 border-teal-500 shadow-md group">
      <div className="flex items-center gap-5 flex-1">
        <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
          {initials}
        </div>
        <div className="flex-1">
          <p className="font-bold text-lg text-slate-900">{fullName}</p>
          <div className="flex items-center gap-4 mt-1">
            <span className="text-sm text-slate-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {age} yrs{patient.gender ? `, ${patient.gender}` : ''}
            </span>
            <span className="text-sm text-slate-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {patient.phone}
            </span>
            {patient.bloodType && (
              <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-bold border border-teal-200">
                {patient.bloodType}
              </span>
            )}
          </div>
        </div>
      </div>
      <button 
        onClick={() => onViewDetails(patient)}
        className="px-5 py-2.5 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Details
      </button>
    </div>
  );
}
