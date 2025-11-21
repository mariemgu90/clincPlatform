'use client';

import React, { useState } from 'react';

export default function PatientProfile({ patientId }) {
  const [isEditing, setIsEditing] = useState(false);
  const patient = { id: patientId, name: 'Lina Ben Ali', dob: '1991-02-14', contact: '+216 98 765 432' };

  return (
    <div className="border rounded p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Patient Profile</h3>
        <button onClick={() => setIsEditing(!isEditing)} className="text-sm text-blue-600">
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium">Name</label>
          <input type="text" defaultValue={patient.name} disabled={!isEditing} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">Date of Birth</label>
          <input type="text" defaultValue={patient.dob} disabled={!isEditing} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="text-sm font-medium">Contact</label>
          <input type="text" defaultValue={patient.contact} disabled={!isEditing} className="w-full border p-2 rounded" />
        </div>
      </div>
      {isEditing && (
        <div className="mt-4 flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
        </div>
      )}
    </div>
  );
}
