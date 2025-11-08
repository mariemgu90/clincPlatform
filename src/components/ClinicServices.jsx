'use client';

import ServiceCard from './ServiceCard';

export default function ClinicServices({ 
  allServices, 
  clinicId, 
  onEditServiceList, 
  onAddServices,
  onViewServiceDetails,
  clinicServices,
}) {
//   const clinicServices = allServices.filter(s => s.clinic === clinicId);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-purple-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="text-4xl">🏢</span>
            Services
          </h2>
          <p className="text-slate-600 mt-1">Available services offered at this clinic</p>
        </div>
        <div className="flex gap-3">
          {clinicServices.length > 0 && (
            <button 
              onClick={onEditServiceList}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Service List
            </button>
          )}
          <button 
            onClick={onAddServices}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Services
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clinicServices.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-300">
            <div className="text-6xl mb-4 animate-pulse">🏢</div>
            <p className="text-xl font-bold text-slate-700">No services linked yet</p>
            <p className="text-slate-500 mt-2">Click "Add Services" to link available services to this clinic</p>
          </div>
        ) : (
          clinicServices.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              onViewDetails={onViewServiceDetails}
              index={index}
            />
          ))
        )}
      </div>
    </div>
  );
}
