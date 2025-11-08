"use client";

import React from 'react';

export default function CardClinicInfo({
  clinic,
  allStaff = [],
  patients = [],
  allServices = [],
  onView,
  onDelete,
  staffCountProp, // optional server-provided counts
  patientCountProp,
  servicesCountProp,
}) {
  // Prefer server-provided counts when available, otherwise fall back to local filtering
  const staffCount = typeof staffCountProp === 'number'
    ? staffCountProp
    : (allStaff || []).filter(s => s.clinic === clinic.id || s.clinicId === clinic.id).length;

  const patientsCount = typeof patientCountProp === 'number'
    ? patientCountProp
    : (patients || []).filter(p => p.clinicId === clinic.id || p.clinic === clinic.id).length;

  const servicesCount = typeof servicesCountProp === 'number'
    ? servicesCountProp
    : (allServices || []).filter(s => s.clinic === clinic.id || s.clinicId === clinic.id).length;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 hover:shadow-xl transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-3xl shadow-md">
            {clinic.logo}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{clinic.name}</h3>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${
              clinic.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}>
              {clinic.status}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 mb-4 text-sm">
        <div className="flex items-center text-slate-600">
          <span className="mr-2">📍</span> {clinic.address}
        </div>
        <div className="flex items-center text-slate-600">
          <span className="mr-2">📞</span> {clinic.phone}
        </div>
        <div className="flex items-center text-slate-600">
          <span className="mr-2">✉️</span> {clinic.email}
        </div>
        <div className="flex items-center text-slate-600">
          <span className="mr-2">🕐</span> {clinic.openingHours}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4 pt-4 border-t border-slate-200">
        <div className="text-center">
          <p className="text-xl font-bold text-emerald-600">{staffCount}</p>
          <p className="text-xs text-slate-600">Staff</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-blue-600">{patientsCount}</p>
          <p className="text-xs text-slate-600">Patients</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold text-purple-600">{servicesCount}</p>
          <p className="text-xs text-slate-600">Services</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg transition-all font-semibold text-sm"
        >
          Manage
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all font-semibold text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
