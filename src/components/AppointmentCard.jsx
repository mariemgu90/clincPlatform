'use client';

import React from 'react';

export default function AppointmentCard({ appointment, onOpen }) {
  return (
    <div className="border p-3 rounded">
      <div className="text-sm font-medium">{appointment?.title || 'Appointment'}</div>
      <div className="text-xs text-gray-600">{appointment?.time}</div>
      <div className="mt-2">
        <button onClick={() => onOpen?.(appointment)} className="text-sm text-blue-600">Open</button>
      </div>
    </div>
  );
}
