'use client';

import DayScheduleCard from './DayScheduleCard';

export default function ClinicOperatingHours({ operatingHours, onEditHours }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-amber-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="text-4xl">🕐</span>
            Operating Hours
          </h2>
          <p className="text-slate-600 mt-1">Weekly schedule and availability</p>
        </div>
        <button 
          onClick={onEditHours} 
          className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Hours
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {Object.entries(operatingHours).map(([day, hours]) => (
          <DayScheduleCard key={day} day={day} hours={hours} />
        ))}
      </div>
    </div>
  );
}
