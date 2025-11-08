'use client';

export default function ClinicActivityLogs({ activityLogs, clinicId }) {
  const clinicLogs = activityLogs.filter(log => log.clinic === clinicId).reverse();

  return (
    <div>
      <div className="mb-6 pb-4 border-b-2 border-rose-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="text-4xl">📊</span>
            Activity Logs
          </h2>
          <p className="text-slate-600 mt-1">Complete audit trail of all clinic activities</p>
        </div>
      </div>
      <div className="space-y-4">
        {clinicLogs.map((log) => (
          <div key={log.id} className="p-6 bg-white rounded-2xl flex items-center justify-between border-l-4 border-rose-500 shadow-md hover:shadow-xl transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-lg text-slate-900">{log.action}</p>
                <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  by <span className="font-semibold">{log.user}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl text-sm text-slate-600 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {new Date(log.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
