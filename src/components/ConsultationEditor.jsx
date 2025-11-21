'use client';

import React, { useState } from 'react';

export default function ConsultationEditor({ appointmentId }) {
  const [notes, setNotes] = useState('');

  return (
    <div className="border rounded p-6">
      <h3 className="text-xl font-semibold mb-4">Consultation for Appointment #{appointmentId}</h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Diagnosis / Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border p-2 rounded h-32"
            placeholder="Enter consultation notes..."
          />
        </div>
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded mr-2">Save</button>
          <button className="px-4 py-2 bg-green-600 text-white rounded">Generate Prescription</button>
        </div>
      </div>
    </div>
  );
}
