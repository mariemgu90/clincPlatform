'use client';

import React from 'react';

export default function CalendarView({ events = [], onCreate, onEdit }) {
  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Calendar</h3>
        <button onClick={onCreate} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
          New Appointment
        </button>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div key={d} className="text-center text-sm font-medium p-2">{d}</div>
        ))}
        {Array.from({ length: 30 }, (_, i) => (
          <div key={i} className="border p-2 text-center text-sm hover:bg-gray-50 cursor-pointer">
            {i + 1}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <h4 className="text-sm font-medium mb-2">Upcoming events</h4>
        {events.length === 0 && <p className="text-sm text-gray-500">No events scheduled</p>}
        {events.map((e, i) => (
          <div key={i} className="text-sm p-2 border-l-2 border-blue-500 mb-2" onClick={() => onEdit?.(e)}>
            {e.title} - {e.time}
          </div>
        ))}
      </div>
    </div>
  );
}
