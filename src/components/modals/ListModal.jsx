'use client';

/**
 * Generic List Modal Component
 * Reusable modal for displaying checkboxes/list items with filtering
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of modal
 * @param {function} props.onClose - Callback when modal closes
 * @param {string} props.title - Modal title
 * @param {string} props.icon - Emoji icon for the header
 * @param {Array} props.items - Items to display (objects with id, name, and optional additional fields)
 * @param {Array} props.selectedIds - Currently selected item IDs
 * @param {function} props.onToggleItem - Callback when item is toggled (receives itemId)
 * @param {function} props.onSubmit - Form submission handler
 * @param {string} props.submitLabel - Submit button label (default: Save Changes)
 * @param {string} props.cancelLabel - Cancel button label (default: Cancel)
 * @param {string} props.itemColor - Tailwind color for selected state (default: blue)
 * @param {string} props.submitColor - Tailwind button color classes
 * @param {function} props.renderItem - Custom render function for each item (receives item object)
 * @param {boolean} props.isLoading - Show loading state on submit button
 */
export default function ListModal({
  isOpen,
  onClose,
  title,
  icon = '📋',
  items = [],
  selectedIds = [],
  onToggleItem,
  onSubmit,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  itemColor = 'blue',
  submitColor = 'bg-blue-600 hover:bg-blue-700',
  renderItem,
  isLoading = false,
}) {
  if (!isOpen) return null;

  const colorMap = {
    blue: { bg: 'bg-blue-50', border: 'border-blue-500' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-500' },
    emerald: { bg: 'bg-emerald-50', border: 'border-emerald-500' },
    teal: { bg: 'bg-teal-50', border: 'border-teal-500' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-500' },
  };

  const colors = colorMap[itemColor] || colorMap.blue;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            {icon && <span>{icon}</span>}
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all"
            aria-label="Close modal"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Items List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {items.length > 0 ? (
              items.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedIds.includes(item.id)
                      ? `${colors.bg} ${colors.border}`
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleItem(item.id)}
                    className={`w-5 h-5 text-${itemColor}-600 rounded focus:ring-2 focus:ring-${itemColor}-500`}
                  />
                  {renderItem ? (
                    renderItem(item)
                  ) : (
                    <div className="flex-1">
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      {item.category && (
                        <p className="text-sm text-slate-600">{item.category}</p>
                      )}
                      {item.role && (
                        <p className="text-sm text-slate-600">{item.role}</p>
                      )}
                    </div>
                  )}
                </label>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">No items available</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-6 py-3 ${submitColor} text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Loading...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
