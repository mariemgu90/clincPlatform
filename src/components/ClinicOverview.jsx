'use client';

export default function ClinicOverview({ clinic, onEditOverview }) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-blue-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="text-4xl">📋</span>
            Overview
          </h2>
          <p className="text-slate-600 mt-1">General clinic information and contact details</p>
        </div>
        <button 
          onClick={onEditOverview}
          className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Overview
        </button>
      </div>

      {/* Contact Information */}
      <div>
        <h3 className="text-xl font-bold mb-5 text-slate-700 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Information
        </h3>
        <div className="grid grid-cols-2 gap-5">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 border-blue-500 group">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Email</p>
            </div>
            <p className="font-bold text-lg text-slate-800">{clinic?.email}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 border-emerald-500 group">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-emerald-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Phone</p>
            </div>
            <p className="font-bold text-lg text-slate-800">{clinic?.phone}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 border-purple-500 group">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Website</p>
            </div>
            <p className="font-bold text-lg text-slate-800 truncate">{clinic?.website || 'N/A'}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border-l-4 border-amber-500 group">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-amber-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Status</p>
            </div>
            <span className="inline-flex px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-md">
              {clinic?.status}
            </span>
          </div>
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="text-xl font-bold mb-5 text-slate-700 flex items-center gap-2">
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Location
        </h3>
        <div className="p-8 bg-white rounded-2xl shadow-lg border-l-4 border-cyan-500">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-cyan-100 rounded-xl">
              <svg className="w-8 h-8 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-slate-800 mb-2">{clinic?.address}</p>
              <p className="text-slate-600 font-medium">{clinic?.city}, {clinic?.state} {clinic?.zipCode}</p>
              <p className="text-slate-600 font-medium">{clinic?.country}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
