export default function ServiceItemCard({ service, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:scale-105 hover:shadow-xl transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl">🏥</div>
        <div className="flex items-center space-x-2">
          {service.active ? (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
              Active
            </span>
          ) : (
            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
              Inactive
            </span>
          )}
        </div>
      </div>

      <h3 className="text-slate-900 font-bold text-xl mb-2">{service.name}</h3>
      {service.description && (
        <p className="text-slate-600 text-sm mb-4">{service.description}</p>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(service)}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:scale-105 transition-all font-semibold shadow-lg shadow-emerald-500/20"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(service.id)}
          className="flex-1 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl transition-all font-semibold"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
