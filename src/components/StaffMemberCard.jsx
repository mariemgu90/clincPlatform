'use client';

export default function StaffMemberCard({ staff, onViewDetails }) {
  return (
    <div className="p-6 bg-white rounded-2xl hover:shadow-xl transition-all shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {staff.avatar || staff.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-bold text-xl text-slate-900 mb-1">{staff.name}</p>
            <div className="space-y-1">
              <p className="text-slate-600 flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {staff.email}
              </p>
              <p className="text-slate-600 flex items-center gap-2 text-sm">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {staff.phone}
              </p>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 flex-shrink-0 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-xs font-bold">
                  {staff.clinicName || staff.clinic?.name || 'MedFlow Clinic'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-md ${
            staff.role === 'DOCTOR' ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' :
            staff.role === 'RECEPTIONIST' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white' :
            staff.role === 'NURSE' ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white' :
            'bg-gradient-to-r from-slate-500 to-slate-600 text-white'
          }`}>
            {staff.role}
          </span>
          <button
            onClick={() => onViewDetails(staff)}
            className="px-5 py-2.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
