'use client';

export default function DayScheduleCard({ day, hours }) {
  return (
    <div className="flex items-center justify-between p-6 bg-white rounded-2xl border-l-4 border-amber-500 shadow-md hover:shadow-xl transition-all group">
      <div className="flex items-center gap-6">
        <div className="w-36">
          <span className="font-bold text-lg capitalize text-slate-900">{day}</span>
        </div>
        {hours.enabled ? (
          <div className="flex items-center gap-4">
            <div className="px-5 py-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 shadow-sm">
              <span className="font-bold text-amber-900">{hours.open}</span>
            </div>
            <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            <div className="px-5 py-3 bg-gradient-to-r from-amber-50 to-amber-100 rounded-xl border-2 border-amber-200 shadow-sm">
              <span className="font-bold text-amber-900">{hours.close}</span>
            </div>
          </div>
        ) : (
          <span className="text-slate-500 italic font-medium">Not operational on this day</span>
        )}
      </div>
      <span className={`px-5 py-2 rounded-full text-sm font-bold shadow-md ${
        hours.enabled 
          ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' 
          : 'bg-slate-200 text-slate-600'
      }`}>
        {hours.enabled ? 'Open' : 'Closed'}
      </span>
    </div>
  );
}
