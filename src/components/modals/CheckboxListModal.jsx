'use client';

/**
 * Generic Checkbox List Modal Component
 * Extended modal for displaying items with custom layouts and selection management
 * 
 * @component
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of modal
 * @param {function} props.onClose - Callback when modal closes
 * @param {string} props.title - Modal title
 * @param {string} props.subtitle - Optional subtitle
 * @param {string} props.icon - Emoji icon for the header
 * @param {string} props.borderColor - Tailwind border color
 * @param {Array} props.items - Items to display
 * @param {Array} props.selectedIds - Currently selected item IDs
 * @param {function} props.onToggleItem - Callback when item is toggled
 * @param {function} props.onSubmit - Form submission handler
 * @param {string} props.submitLabel - Submit button label
 * @param {string} props.cancelLabel - Cancel button label
 * @param {string} props.selectedBgColor - Tailwind bg color for selected items
 * @param {string} props.selectedBorderColor - Tailwind border color for selected items
 * @param {string} props.submitButtonColor - Tailwind color for submit button
 * @param {function} props.renderItem - Custom render function for each item
 * @param {boolean} props.isLarge - Use large layout variant (default: false)
 * @param {boolean} props.isLoading - Show loading state
 */
export default function CheckboxListModal({
  isOpen,
  onClose,
  title,
  subtitle,
  icon = '📋',
  borderColor = 'border-emerald-500',
  items = [],
  selectedIds = [],
  onToggleItem,
  onSubmit,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  selectedBgColor = 'bg-emerald-50',
  selectedBorderColor = 'border-emerald-500',
  submitButtonColor = 'bg-emerald-500 hover:bg-emerald-600',
  renderItem,
  isLarge = false,
  isLoading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div
        className={`bg-white rounded-3xl p-10 ${
          isLarge ? 'max-w-3xl' : 'max-w-2xl'
        } w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 ${borderColor}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              {icon && <span className="text-4xl">{icon}</span>}
              {title}
            </h2>
            {subtitle && <p className="text-slate-600 mt-2">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-slate-100 rounded-xl transition-all group"
            aria-label="Close modal"
          >
            <svg
              className="w-7 h-7 text-slate-600 group-hover:text-slate-900"
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
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Items List */}
          <div className={`space-y-${isLarge ? '4' : '3'} max-h-96 overflow-y-auto ${isLarge ? 'pr-2' : ''}`}>
            {items.length > 0 ? (
              items.map((item) => (
                <label
                  key={item.id}
                  className={`flex items-center gap-${isLarge ? '5' : '4'} p-${isLarge ? '5' : '4'} rounded-${isLarge ? '2xl' : 'xl'} border-${isLarge ? '3' : '2'} cursor-pointer transition-all ${
                    selectedIds.includes(item.id)
                      ? `${selectedBgColor} ${selectedBorderColor} ${isLarge ? 'shadow-lg scale-105' : ''}`
                      : `${isLarge ? 'bg-white border-slate-200 hover:border-emerald-300 hover:shadow-md' : 'bg-slate-50 border-slate-200 hover:border-emerald-300'}`
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    onChange={() => onToggleItem(item.id)}
                    className={`w-${isLarge ? '6' : '5'} h-${isLarge ? '6' : '5'} rounded-${isLarge ? 'lg' : 'base'} focus:ring-2`}
                  />
                  {renderItem ? (
                    renderItem(item, selectedIds.includes(item.id))
                  ) : (
                    <div className="flex-1">
                      <p className={`font-${isLarge ? 'bold' : 'semibold'} text-${isLarge ? 'lg' : 'base'} text-slate-900`}>
                        {item.name}
                      </p>
                      {(item.category || item.role) && (
                        <p className="text-sm text-slate-600 font-medium">
                          {item.category || item.role}
                        </p>
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
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-8 py-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-lg transition-all"
            >
              {cancelLabel}
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 px-8 py-4 ${submitButtonColor} text-white rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? 'Loading...' : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
