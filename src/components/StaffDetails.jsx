"use client";

import React from 'react';

export default function StaffDetails({ staff, onClose, onEdit, onDelete }) {
  if (!staff) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl p-8 max-w-2xl w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="text-4xl">
              {staff.role === 'DOCTOR' ? '👨‍⚕️' : staff.role === 'RECEPTIONIST' ? '👨‍💼' : '👑'}
            </span>
            Staff Details
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-all">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Full Name</p>
              <p className="text-lg font-bold text-slate-900">{staff.name}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Role</p>
              <span className={`inline-block px-4 py-2 rounded-full text-sm font-bold ${
                staff.role === 'DOCTOR' ? 'bg-blue-100 text-blue-700' :
                staff.role === 'RECEPTIONIST' ? 'bg-emerald-100 text-emerald-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {staff.role}
              </span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-500 mb-1">Email Address</p>
            <p className="text-lg text-slate-900 flex items-center gap-2">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {staff.email}
            </p>
          </div>

          {staff.phone && (
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Phone Number</p>
              <p className="text-lg text-slate-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {staff.phone}
              </p>
            </div>
          )}

          {staff.clinic && (
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Clinic</p>
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 rounded-full text-sm font-bold">
                {staff.clinic.name}
              </span>
            </div>
          )}

          {staff.createdAt && (
            <div>
              <p className="text-sm font-semibold text-slate-500 mb-1">Join Date</p>
              <p className="text-lg text-slate-900">{new Date(staff.createdAt).toLocaleDateString()}</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
         {onEdit&& <button
            onClick={() => onEdit(staff)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit
          </button>}
         {onDelete && <button
            onClick={() => onDelete(staff.id)}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>}
          <button onClick={onClose} className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold transition-all">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
