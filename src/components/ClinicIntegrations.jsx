'use client';

export default function ClinicIntegrations({ 
  integrations, 
  clinicId, 
  onEditIntegrationList, 
  onAddIntegrations 
}) {
  const clinicIntegrations = integrations.filter(i => i.clinic === clinicId);
  
  const getIntegrationIcon = (type) => {
    switch(type) {
      case 'Labs': return '🔬';
      case 'Pharmacy': return '💊';
      case 'Imaging': return '🏥';
      case 'Insurance': return '🛡️';
      case 'Billing': return '💳';
      default: return '🔗';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-cyan-200">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <span className="text-4xl">🔗</span>
            Integrations
          </h2>
          <p className="text-slate-600 mt-1">External services and system connections</p>
        </div>
        <div className="flex gap-3">
          {clinicIntegrations.length > 0 && (
            <button 
              onClick={onEditIntegrationList} 
              className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Integration List
            </button>
          )}
          <button 
            onClick={onAddIntegrations} 
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Integrations
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clinicIntegrations.length === 0 ? (
          <div className="col-span-2 text-center py-16 bg-white rounded-2xl shadow-lg border-2 border-dashed border-slate-300">
            <div className="text-6xl mb-4 animate-pulse">🔗</div>
            <p className="text-xl font-bold text-slate-700">No integrations configured yet</p>
            <p className="text-slate-500 mt-2">Click "Add Integrations" to connect external services</p>
          </div>
        ) : (
          clinicIntegrations.map((integration) => (
            <div key={integration.id} className="p-6 bg-white rounded-2xl border-l-4 border-cyan-500 shadow-md hover:shadow-xl transition-all group">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg group-hover:scale-110 transition-transform">
                  {getIntegrationIcon(integration.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-xl text-slate-900">{integration.name}</h4>
                    <span className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full text-sm font-bold shadow-md">{integration.status}</span>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-cyan-100 to-cyan-200 text-cyan-700 rounded-full text-xs font-bold">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {integration.type}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
