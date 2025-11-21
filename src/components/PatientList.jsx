'use client';

import React from 'react';
import PatientCard from './PatientCard';

export default function PatientList({ patients = [], onEdit, onDelete }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Patients ({patients.length})</h3>
        <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Add Patient</button>
      </div>
      <div className="grid gap-3">
        {patients.length === 0 && <p className="text-sm text-gray-500">No patients yet</p>}
        {patients.map((p) => (
          <PatientCard key={p.id} patient={p} onOpen={() => onEdit?.(p)} onBook={() => {}} />
        ))}
      </div>
    </div>
  );
}
