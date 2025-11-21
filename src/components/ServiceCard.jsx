'use client';

export default function ServiceCard({ service, onViewDetails, index }) {
  return (
    <div 
      className="p-6 bg-white rounded-2xl hover:shadow-xl transition-all border-l-4 border-purple-500 shadow-md group cursor-pointer"
      onClick={() => onViewDetails(service)}
    >
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
          🏥
        </div>
        <div className="flex-1">
          <p className="font-bold text-xl text-slate-900 mb-2">{service.name}</p>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 rounded-full text-xs font-bold">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {service.category}
            </span>
          </div>
        </div>
        <button
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-600 hover:to-teal-600 transition-all shadow-md hover:shadow-lg text-sm"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(service);
          }}
        >
          View Details
        </button>
      </div>
    </div>
  );
}
